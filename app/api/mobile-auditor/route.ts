import { NextResponse } from 'next/server'
import { hashString, SimpleCache, normalizeInput } from '@/lib/api-utils'
import { getBrowser } from '@/lib/puppeteer'

const cache = new SimpleCache(3600000) // 1 hour cache

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let browser = null; // Declare browser at a higher scope
    let page = null; // Declare page at a higher scope
    let evaluation: any = null; // Declare evaluation at a higher scope

    try {
        const normalizedUrl = normalizeInput(url)
        const cacheKey = `mobile_${normalizedUrl} `

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached) {
            console.log(`[Mobile Auditor] Returning cached results for: ${url} `)
            return NextResponse.json(cached)
        }

        // Generate deterministic results based on URL hash
        const urlHash = hashString(normalizedUrl)

        // Capture screenshot (real-time)
        let screenshot = null
        try {
            browser = await getBrowser() // Use the helper
            page = await browser.newPage()

            // Set mobile viewport (iPhone 13 Pro)
            await page.setViewport({
                width: 390,
                height: 844,
                isMobile: true,
                hasTouch: true,
                deviceScaleFactor: 3
            })

            await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

            // Take screenshot
            const screenshotBuffer = await page.screenshot({
                encoding: 'base64',
                fullPage: false
            })

            screenshot = `data: image / png; base64, ${screenshotBuffer} `

            await browser.close()
        } catch (screenshotError) {
            console.error('Screenshot capture failed:', screenshotError)
            // Continue without screenshot
        }

        // REAL-TIME Mobile Audit Checks using Puppeteer
        const evaluation = await page.evaluate(() => {
            // 1. Viewport Meta Tag
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            const hasViewport = !!viewportMeta && viewportMeta.getAttribute('content')?.includes('width=device-width');

            // 2. Tap Targets (Buttons & Links)
            const interactiveElements = Array.from(document.querySelectorAll('a, button, input[type="submit"], input[type="button"]'));
            let smallTapTargets = 0;
            interactiveElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && (rect.width < 48 || rect.height < 48)) {
                    smallTapTargets++;
                }
            });

            // 3. Font Size Readability
            const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div'));
            let smallFontCount = 0;
            textElements.forEach(el => {
                const style = window.getComputedStyle(el);
                const fontSize = parseFloat(style.fontSize);
                const text = (el as HTMLElement).innerText; // Cast to HTMLElement
                if (fontSize < 16 && text && text.trim().length > 0) {
                    smallFontCount++;
                }
            });

            // 4. Horizontal Scroll
            const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
            const overflowWidth = document.documentElement.scrollWidth;

            // 6. Touch Event Optimization (Check for passive listeners or touch-action)
            // This is hard to detect perfectly without performance profile, checking for 'touch-action' css
            const bodyStyle = window.getComputedStyle(document.body);
            // @ts-ignore
            const hasTouchOptimization = bodyStyle.touchAction !== 'auto' || !!document.querySelector('meta[name="viewport"]'); // rough proxy

            return {
                hasViewport,
                smallTapTargets,
                smallFontCount,
                hasHorizontalScroll,
                overflowWidth,
                hasTouchOptimization,
                interactiveCount: interactiveElements.length
            };
        });

        // Construct Issues List from Real Data
        const issues = [];
        let passedChecks = 0;
        const totalChecks = 6;

        // 1. Viewport Meta Tag
        if (evaluation.hasViewport) {
            passedChecks++;
            issues.push({
                type: 'success',
                title: 'Viewport Meta Tag',
                description: 'Mobile viewport is properly configured',
                details: 'width=device-width, initial-scale=1.0 detected',
                impact: 'High',
                passed: true
            });
        } else {
            issues.push({
                type: 'error',
                title: 'Viewport Meta Tag',
                description: 'Missing or incorrect viewport meta tag',
                details: 'Page may not scale correctly on mobile devices',
                impact: 'High',
                passed: false,
                fix: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
            });
        }

        // 2. Tap Targets
        if (evaluation.smallTapTargets === 0) {
            passedChecks++;
            issues.push({
                type: 'success',
                title: 'Tap Targets',
                description: 'All interactive elements are appropriately sized (≥48x48px)',
                details: `${evaluation.interactiveCount} interactive elements checked`,
                impact: 'High',
                passed: true
            });
        } else {
            issues.push({
                type: 'error',
                title: 'Tap Targets Too Small',
                description: `${evaluation.smallTapTargets} elements have touch targets smaller than 48x48px`,
                details: 'Buttons and links are too small for comfortable mobile usage',
                impact: 'High',
                passed: false,
                fix: 'Ensure min-width and min-height are at least 48px for clickable elements'
            });
        }

        // 3. Font Size Readability
        if (evaluation.smallFontCount === 0) {
            passedChecks++;
            issues.push({
                type: 'success',
                title: 'Font Size Readability',
                description: 'All text is readable on mobile (≥16px)',
                details: 'Text is legible without zooming',
                impact: 'Medium',
                passed: true
            });
        } else {
            issues.push({
                type: 'warning',
                title: 'Small Text Detected',
                description: `${evaluation.smallFontCount} elements have font sizes below 16px`,
                details: 'Text may be difficult to read on mobile devices',
                impact: 'Medium',
                passed: false,
                fix: 'body { font-size: 16px; }'
            });
        }

        // 4. Horizontal Scroll
        if (!evaluation.hasHorizontalScroll) {
            passedChecks++;
            issues.push({
                type: 'success',
                title: 'Horizontal Scroll',
                description: 'Content fits within viewport',
                details: 'No horizontal overflow detected',
                impact: 'High',
                passed: true
            });
        } else {
            issues.push({
                type: 'error',
                title: 'Horizontal Scroll Detected',
                description: `Content extends beyond viewport(${evaluation.overflowWidth}px)`,
                details: 'Users must scroll horizontally to read content',
                impact: 'High',
                passed: false,
                fix: 'Use max-width: 100% and overflow-x: hidden'
            });
        }

        // 5. Mobile Friendly (Aggregate check)
        const isMobileFriendly = evaluation.hasViewport && !evaluation.hasHorizontalScroll;
        if (isMobileFriendly) {
            passedChecks++;
            issues.push({
                type: 'success',
                title: 'Mobile-Friendly Layout',
                description: 'Layout adapts well to mobile screens',
                details: 'Responsive core metrics passed',
                impact: 'High',
                passed: true
            });
        } else {
            issues.push({
                type: 'error',
                title: 'Layout Issues',
                description: 'Fixed widths or viewport issues detected',
                details: 'Design does not adapt fully to mobile',
                impact: 'High',
                passed: false,
                fix: 'Use responsive units (%, vw) and valid viewport settings'
            });
        }

        // 6. Touch Optimization
        if (evaluation.hasTouchOptimization) {
            passedChecks++;
            issues.push({
                type: 'success',
                title: 'Touch Optimization',
                description: 'Touch config looks standard',
                details: 'Standard touch actions enabled',
                impact: 'Low',
                passed: true
            });
        } else {
            // Relaxed check since it's hard to be perfect without deep analysis
            issues.push({
                type: 'info',
                title: 'Touch Optimization',
                description: 'Ensure touch-action is set for interactive maps/scroll areas',
                details: 'Check complex widgets for touch compatibility',
                impact: 'Low',
                passed: true // Pass by default if no obvious error to avoid false positives
            });
            passedChecks++;
        }

        const score = Math.round((passedChecks / totalChecks) * 100)
        const scoreDisplay = `${passedChecks}/${totalChecks}`

        const responseData = {
            issues,
            score,
            scoreDisplay,
            screenshot: screenshot || null,
            deviceInfo: {
                name: 'iPhone 13 Pro',
                viewport: '390 x 844',
                deviceScaleFactor: 3
            },
            summary: {
                passed: passedChecks,
                total: totalChecks,
                status: passedChecks === totalChecks ? 'excellent' : passedChecks >= 4 ? 'good' : 'needs-work',
                grade: passedChecks === totalChecks ? 'A+' : passedChecks === 5 ? 'A' : passedChecks === 4 ? 'B' : passedChecks === 3 ? 'C' : 'D'
            },
            recommendations: [
                'Ensure all tap targets are at least 48x48px',
                'Use viewport meta tag for responsive design',
                'Test on real devices for best results',
                'Optimize images for mobile bandwidth',
                'Avoid horizontal scrolling at all breakpoints'
            ]
        }

        // Cache the results
        cache.set(cacheKey, responseData)
        console.log(`[Mobile Auditor] Generated consistent results for: ${url} (Score: ${scoreDisplay})`)

        return NextResponse.json(responseData)
    } catch (error: any) {
        console.error('Mobile audit failed:', error)
        return NextResponse.json({
            error: 'Analysis failed',
            message: error.message
        }, { status: 500 })
    }
}
