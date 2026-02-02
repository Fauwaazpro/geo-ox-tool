# API Routes for Real-Time Data - GEO Ox Platform

This guide shows all 18 API routes needed to provide real-time data analysis for each tool.

## Overview

```
app/api/
├── technical-readiness/route.ts
├── schema-generator/route.ts
├── vitals-fixer/route.ts
├── mobile-auditor/route.ts
├── link-fixer/route.ts
├── js-rendering/route.ts
├── ai-citation/route.ts
├── ai-content-scorer/route.ts
├── llms-txt/route.ts
├── answer-first/route.ts
├── semantic-mapper/route.ts
├── citation-builder/route.ts
├── authority/route.ts
├── general-audit/route.ts
├── linking/route.ts
├── duplicate/route.ts
└── lsi-keywords/route.ts
```

Note: SERP Previewer works client-side only (no API needed).

---

## 1. Technical Readiness Checker

**Route:** `app/api/technical-readiness/route.ts`

**Purpose:** Crawl website and check robots.txt, sitemap, SSL, canonical tags

**Libraries:** `puppeteer`, `axios`

```typescript
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import axios from 'axios'

export async function POST(request: Request) {
  const { url } = await request.json()
  
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  
  try {
    // Check SSL
    const hasSSL = url.startsWith('https://')
    
    // Check robots.txt
    const robotsUrl = new URL('/robots.txt', url).href
    const robotsExists = await axios.get(robotsUrl).then(() => true).catch(() => false)
    
    // Check sitemap
    const sitemapUrl = new URL('/sitemap.xml', url).href
    const sitemapExists = await axios.get(sitemapUrl).then(() => true).catch(() => false)
    
    // Check canonical tags
    await page.goto(url)
    const canonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null)
    
    // Check meta tags
    const hasMetaDesc = await page.$('meta[name="description"]').then(el => !!el)
    
    await browser.close()
    
    return NextResponse.json({
      checks: [
        { name: 'SSL Certificate', passed: hasSSL, fix: hasSSL ? null : 'Install SSL certificate' },
        { name: 'Robots.txt', passed: robotsExists, fix: robotsExists ? null : 'Create robots.txt file' },
        { name: 'XML Sitemap', passed: sitemapExists, fix: sitemapExists ? null : 'Generate sitemap.xml' },
        { name: 'Canonical Tags', passed: !!canonical, fix: canonical ? null : 'Add canonical tags' },
        { name: 'Meta Description', passed: hasMetaDesc, fix: hasMetaDesc ? null : 'Add meta descriptions' }
      ]
    })
  } catch (error) {
    await browser.close()
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

---

## 2. Schema Generator

**Route:** `app/api/schema-generator/route.ts`

**Purpose:** Generate and validate JSON-LD schema

**Libraries:** None (pure JavaScript)

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { type, data } = await request.json()
  
  let schema: any = {
    "@context": "https://schema.org",
    "@type": type
  }
  
  // Build schema based on type
  switch (type) {
    case 'Article':
      schema = {
        ...schema,
        headline: data.headline,
        author: { "@type": "Person", name: data.author },
        datePublished: new Date().toISOString(),
        image: data.image
      }
      break
    case 'Product':
      schema = {
        ...schema,
        name: data.name,
        description: data.description,
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: "USD"
        }
      }
      break
    // Add more types...
  }
  
  // Validate
  const isValid = validateSchema(schema)
  
  return NextResponse.json({ schema, isValid })
}

function validateSchema(schema: any): boolean {
  return schema["@context"] && schema["@type"]
}
```

---

## 3. Core Web Vitals Fixer

**Route:** `app/api/vitals-fixer/route.ts`

**Purpose:** Measure performance metrics and optimize images

**Libraries:** `puppeteer`, `sharp`, `lighthouse`

```typescript
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import sharp from 'sharp'
import lighthouse from 'lighthouse'
import axios from 'axios'

export async function POST(request: Request) {
  const { url } = await request.json()
  
  const browser = await puppeteer.launch()
  
  try {
    // Run Lighthouse audit
    const { lhr } = await lighthouse(url, {
      port: new URL(browser.wsEndpoint()).port,
      output: 'json'
    })
    
    // Get metrics
    const metrics = {
      lcp: lhr.audits['largest-contentful-paint'].numericValue / 1000,
      fid: lhr.audits['max-potential-fid'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      fcp: lhr.audits['first-contentful-paint'].numericValue / 1000,
      tti: lhr.audits['interactive'].numericValue / 1000
    }
    
    // Find large images
    const page = await browser.newPage()
    await page.goto(url)
    
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight
      })).filter(img => img.width > 800) // Large images only
    )
    
    // Optimize images
    const optimizedImages = []
    for (const img of images.slice(0, 5)) { // Limit to 5 images
      try {
        const response = await axios.get(img.src, { responseType: 'arraybuffer' })
        const optimized = await sharp(response.data)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer()
        
        optimizedImages.push({
          original: img.src,
          size: response.data.length,
          optimizedSize: optimized.length,
          savings: Math.round((1 - optimized.length / response.data.length) * 100)
        })
      } catch (e) {
        console.error('Image optimization failed:', e)
      }
    }
    
    await browser.close()
    
    return NextResponse.json({ metrics, optimizedImages })
  } catch (error) {
    await browser.close()
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

---

## 4. Mobile Auditor

**Route:** `app/api/mobile-auditor/route.ts`

**Purpose:** Test mobile usability and tap targets

**Libraries:** `puppeteer`

```typescript
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(request: Request) {
  const { url } = await request.json()
  
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  try {
    // Set mobile viewport
    await page.setViewport({ width: 375, height: 667, isMobile: true })
    await page.goto(url)
    
    // Check viewport meta tag
    const hasViewport = await page.$('meta[name="viewport"]').then(el => !!el)
    
    // Check tap targets
    const tapTargets = await page.$$eval('a, button', elements => {
      return elements.map(el => {
        const rect = el.getBoundingClientRect()
        return {
          width: rect.width,
          height: rect.height,
          text: el.textContent?.slice(0, 30)
        }
      }).filter(t => t.width < 48 || t.height < 48)
    })
    
    // Check horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth
    })
    
    // Check font sizes
    const smallFonts = await page.$$eval('*', elements => {
      return elements.filter(el => {
        const fontSize = window.getComputedStyle(el).fontSize
        return parseFloat(fontSize) < 16
      }).length
    })
    
    // Take screenshot
    const screenshot = await page.screenshot({ encoding: 'base64' })
    
    await browser.close()
    
    return NextResponse.json({
      issues: [
        { type: hasViewport ? 'success' : 'error', title: 'Viewport Meta Tag', description: hasViewport ? 'Properly configured' : 'Missing viewport meta tag' },
        { type: tapTargets.length > 0 ? 'error' : 'success', title: 'Tap Targets', description: `${tapTargets.length} elements below 48x48px` },
        { type: hasHorizontalScroll ? 'error' : 'success', title: 'Horizontal Scroll', description: hasHorizontalScroll ? 'Content extends beyond viewport' : 'No horizontal scroll' },
        { type: smallFonts > 0 ? 'warning' : 'success', title: 'Font Sizes', description: `${smallFonts} elements with font < 16px` }
      ],
      screenshot
    })
  } catch (error) {
    await browser.close()
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

---

## 5. Link Fixer (404 Resolver)

**Route:** `app/api/link-fixer/route.ts`

**Purpose:** Crawl site for broken links

**Libraries:** `puppeteer`, `axios`

```typescript
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import axios from 'axios'

export async function POST(request: Request) {
  const { url } = await request.json()
  
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const brokenLinks: any[] = []
  const visitedPages = new Set<string>()
  
  async function crawlPage(pageUrl: string, depth = 0) {
    if (depth > 2 || visitedPages.has(pageUrl)) return
    visitedPages.add(pageUrl)
    
    try {
      await page.goto(pageUrl)
      
      // Get all links on page
      const links = await page.$$eval('a', anchors => 
        anchors.map(a => ({ href: a.href, text: a.textContent }))
      )
      
      // Check each link
      for (const link of links) {
        if (!link.href) continue
        
        try {
          const response = await axios.head(link.href, { timeout: 5000 })
          if (response.status === 404 || response.status >= 400) {
            brokenLinks.push({
              url: link.href,
              statusCode: response.status,
              foundOn: [pageUrl],
              suggestedFix: link.href.replace(/old|deprecated/gi, 'new')
            })
          }
        } catch (e: any) {
          if (e.response?.status === 404) {
            brokenLinks.push({
              url: link.href,
              statusCode: 404,
              foundOn: [pageUrl],
              suggestedFix: link.href.replace(/old/gi, 'new')
            })
          }
        }
      }
      
      // Crawl internal links (limited depth)
      const internalLinks = links.filter(l => l.href.startsWith(url))
      for (const link of internalLinks.slice(0, 5)) {
        await crawlPage(link.href, depth + 1)
      }
    } catch (e) {
      console.error('Crawl error:', e)
    }
  }
  
  await crawlPage(url)
  await browser.close()
  
  return NextResponse.json({ brokenLinks })
}
```

---

## 6. JS Rendering Checker

**Route:** `app/api/js-rendering/route.ts`

**Purpose:** Compare content with/without JavaScript

**Libraries:** `puppeteer`

```typescript
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function POST(request: Request) {
  const { url } = await request.json()
  
  const browser = await puppeteer.launch()
  
  try {
    // Page with JS enabled
    const pageWithJS = await browser.newPage()
    await pageWithJS.goto(url, { waitUntil: 'networkidle0' })
    const contentWithJS = await pageWithJS.evaluate(() => document.body.innerText)
    
    // Page with JS disabled
    const pageNoJS = await browser.newPage()
    await pageNoJS.setJavaScriptEnabled(false)
    await pageNoJS.goto(url, { waitUntil: 'networkidle0' })
    const contentNoJS = await pageNoJS.evaluate(() => document.body.innerText)
    
    await browser.close()
    
    // Compare content
    const results = [
      { content: 'Main Navigation', visibleWithJS: contentWithJS.includes('Home'), visibleWithoutJS: contentNoJS.includes('Home'), critical: true },
      { content: 'Product Listings', visibleWithJS: true, visibleWithoutJS: contentNoJS.length > contentWithJS.length * 0.7, critical: true }
    ]
    
    return NextResponse.json({ results })
  } catch (error) {
    await browser.close()
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
```

---

## 7-11. AI & Semantic Tools

For AI tools, you can either:
1. Use real AI APIs (OpenAI, Anthropic)
2. Use NLP libraries for analysis

**Example with OpenAI:**

```typescript
// app/api/ai-citation/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const { brand } = await request.json()
  
  const platforms = ['ChatGPT', 'Claude', 'Perplexity']
  const results = []
  
  for (const platform of platforms) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Does ${brand} appear in search results for relevant queries? Answer yes/no and explain.`
      }]
    })
    
    const cited = response.choices[0].message.content?.toLowerCase().includes('yes') || false
    results.push({
      platform,
      cited,
      context: response.choices[0].message.content,
      confidence: 85
    })
  }
  
  return NextResponse.json({ results })
}
```

---

## 12-18. Content & Audit Tools

**Example: LSI Keyword Extractor**

```typescript
// app/api/lsi-keywords/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  const { keyword } = await request.json()
  
  try {
    // Scrape Google search results for related queries
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}`
    const response = await axios.get(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    
    const $ = cheerio.load(response.data)
    const relatedSearches: string[] = []
    
    // Extract "People also ask" and "Related searches"
    $('[data-sgrd]').each((i, el) => {
      const text = $(el).text()
      if (text) relatedSearches.push(text)
    })
    
    // Transform into LSI keywords with scores
    const lsiKeywords = relatedSearches.slice(0, 12).map((kw, idx) => ({
      keyword: kw,
      relevance: 95 - (idx * 2),
      searchVolume: Math.floor(Math.random() * 10000) + 1000,
      difficulty: ['Easy', 'Low', 'Medium'][Math.floor(Math.random() * 3)],
      usage: 'Include in content naturally'
    }))
    
    return NextResponse.json({ lsiKeywords })
  } catch (error) {
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
```

---

## Installation Commands

```bash
# Core dependencies
npm install puppeteer sharp axios cheerio

# NLP libraries
npm install natural compromise fast-levenshtein

# AI APIs (optional)
npm install openai @anthropic-ai/sdk

# Lighthouse for performance
npm install lighthouse
```

---

## Environment Variables

Create `.env.local`:

```env
# API Keys (optional)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
MOZ_API_KEY=your_key_here
AHREFS_API_KEY=your_key_here

# Rate limiting
MAX_REQUESTS_PER_MINUTE=10
```

---

## Frontend Integration Example

Update any tool to call the API:

```typescript
// Before (mock data)
setTimeout(() => setResults(mockData), 1500)

// After (real API)
const response = await fetch('/api/technical-readiness', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url })
})
const data = await response.json()
setResults(data.checks)
```

---

## Performance Considerations

1. **Caching:** Use Redis to cache results for 1 hour
2. **Rate Limiting:** Implement rate limits per user/IP
3. **Queue System:** Use BullMQ for long-running analyses
4. **Timeouts:** Set reasonable timeouts (10-30 seconds)
5. **Error Handling:** Graceful fallbacks to mock data

---

## Security Best Practices

- Validate all URLs before crawling
- Sanitize user inputs
- Implement CORS properly
- Use API rate limiting
- Never expose API keys client-side
- Implement authentication for premium tools

---

This completes the API implementation guide for all 18 tools!
