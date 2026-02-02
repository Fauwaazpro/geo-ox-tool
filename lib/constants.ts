// Tool metadata and configuration
export interface Tool {
    id: string
    slug: string
    name: string
    description: string
    category: 'infrastructure' | 'ai-semantic' | 'content-audit'
    icon: string
    isPremium?: boolean
    benefits?: string[]
}

export const TOOLS: Tool[] = [
    // Phase A: Infrastructure & Technical Base
    {
        id: 'technical-readiness',
        slug: 'technical-readiness',
        name: 'Technical Readiness Checker',
        description: 'Verify robots.txt, sitemap, SSL, and canonical tags with instant fixes',
        category: 'infrastructure',
        icon: 'Shield',
        benefits: [
            'Ensures your site is accessible to search engine crawlers',
            'Fixes critical security and indexing issues instantly',
            'Prevents duplicate content penalties with canonical tags',
            'Validates sitemap structure for better indexing'
        ]
    },
    {
        id: 'schema-generator',
        slug: 'schema-generator',
        name: 'Schema Generator',
        description: 'Create verified JSON-LD structured data with one-click validation',
        category: 'infrastructure',
        icon: 'Code2',
        benefits: [
            'Boosts visibility with Rich Snippets in search results',
            'Helps search engines understand your content context',
            'Generates error-free JSON-LD code automatically',
            'Supports multiple schema types (Article, Product, FAQ, etc.)'
        ]
    },
    {
        id: 'vitals-fixer',
        slug: 'vitals-fixer',
        name: 'Core Web Vitals Fixer',
        description: 'Analyze performance and get optimized images instantly',
        category: 'infrastructure',
        icon: 'Gauge',
        benefits: [
            'Improves page load speed for better user experience',
            'Boosts SEO rankings by meeting Core Web Vitals standards',
            'Automatically optimizes images to reduce file size',
            'Identifies performance bottlenecks instantly'
        ]
    },
    {
        id: 'mobile-auditor',
        slug: 'mobile-auditor',
        name: 'Mobile Auditor',
        description: 'Visual mobile rendering check with tap target analysis',
        category: 'infrastructure',
        icon: 'Smartphone',
        benefits: [
            'Ensures a seamless experience for mobile users',
            'Detects tap target errors that frustrate users',
            'Simulates rendering across different device sizes',
            'Improves mobile-first indexing rankings'
        ]
    },
    {
        id: 'link-fixer',
        slug: 'link-fixer',
        name: 'Link Fixer (404 Resolver)',
        description: 'Auto-generate redirect rules for broken links',
        category: 'infrastructure',
        icon: 'Link',
        benefits: [
            'Recovers lost link equity from broken pages',
            'Improves user experience by eliminating dead links',
            'Auto-generates Nginx/Apache redirect rules',
            'Preserves SEO rankings during site migrations'
        ]
    },

    // Phase B: AI & Semantic Optimization
    {
        id: 'ai-citation-checker',
        slug: 'ai-citation-checker',
        name: 'AI Citation Checker',
        description: 'Discover if your brand appears in AI search results',
        category: 'ai-semantic',
        icon: 'Sparkles',
        benefits: [
            'Tracks brand visibility in ChatGPT, Perplexity, and Gemini',
            'Analyzes sentiment of AI mentions about your brand',
            'Identifies sources AI models are citing for your business',
            'Helps optimize content for Generative Engine Optimization (GEO)'
        ]
    },
    {
        id: 'ai-content-scorer',
        slug: 'ai-content-scorer',
        name: 'AI Content Scorer',
        description: 'Measure your content\'s LLM readability and citation potential',
        category: 'ai-semantic',
        icon: 'BarChart3',
        benefits: [
            'Scores content based on LLM comprehension ease',
            'Predicts likelihood of being cited by AI models',
            'Provides actionable tips to improve AI readability',
            'Optimizes content structure for machine learning training'
        ]
    },
    {
        id: 'llms-txt-generator',
        slug: 'llms-txt-generator',
        name: 'llms.txt Generator',
        description: 'Create AI-optimized documentation in llms.txt format',
        category: 'ai-semantic',
        icon: 'FileText',
        isPremium: true,
        benefits: [
            'Helps AI chatbots understand your business accurately',
            'Increases chances of being cited by ChatGPT, Claude, etc.',
            'Provides structured, machine-readable information',
            'Improves AI-driven search visibility (GEO)'
        ]
    },
    {
        id: 'answer-first-structure',
        slug: 'answer-first-structure',
        name: 'Answer-First Structure Tool',
        description: 'Optimize content for answer engines with AI rewriting',
        category: 'ai-semantic',
        icon: 'MessageSquare',
        benefits: [
            'Structures content to directly answer user queries',
            'Increases chances of winning Featured Snippets',
            'Optimizes for voice search and direct answers',
            'Improves user engagement by delivering value fast'
        ]
    },
    {
        id: 'semantic-seo-mapper',
        slug: 'semantic-seo-mapper',
        name: 'Semantic SEO Mapper',
        description: 'Find missing entities compared to top competitors',
        category: 'ai-semantic',
        icon: 'Network',
        benefits: [
            'Identifies missing topical entities in your content',
            'Compares your entity coverage against top competitors',
            'Enhances topical authority and relevance',
            'Helps search engines connect your content to broader topics'
        ]
    },
    {
        id: 'citation-authority-builder',
        slug: 'citation-authority-builder',
        name: 'Citation Authority Builder',
        description: 'Identify unlinked brand mentions across your site',
        category: 'ai-semantic',
        icon: 'Quote',
        benefits: [
            'Turns unlinked mentions into valuable backlinks',
            'Strengthens brand authority and recognition',
            'Finds missed opportunities for internal linking',
            'Consolidates brand signals for search engines'
        ]
    },
    {
        id: 'authority-checker',
        slug: 'authority-checker',
        name: 'Authority Checker (Topic Map)',
        description: 'Visualize topic clusters and find orphan pages',
        category: 'ai-semantic',
        icon: 'GitBranch',
        benefits: [
            'Visualizes internal linking and topic clusters',
            'Identifies orphan pages that need internal links',
            'Ensures link juice flows efficiently across the site',
            'Helps plan a logical content hierarchy'
        ]
    },

    // Phase C: Content & Audit
    {
        id: 'general-audit',
        slug: 'general-audit',
        name: 'General Audit & Gap Analysis',
        description: 'Comprehensive competitor comparison for content gaps',
        category: 'content-audit',
        icon: 'Search',
        benefits: [
            'Reveals content gaps your competitors are exploiting',
            'Provides a comprehensive checklist for site improvement',
            'Analyzes on-page SEO factors in depth',
            'Prioritizes fixes based on potential impact'
        ]
    },
    {
        id: 'linking-suggester',
        slug: 'linking-suggester',
        name: 'Linking Suggester',
        description: 'AI-powered internal linking recommendations',
        category: 'content-audit',
        icon: 'LinkIcon',
        benefits: [
            'Suggests relevant internal links powered by AI',
            'Improves site structure and crawlability',
            'Increases time on site by guiding users to related content',
            'Distributes page authority to new articles'
        ]
    },
    {
        id: 'serp-previewer',
        slug: 'serp-previewer',
        name: 'SERP Previewer (Multi-Modal)',
        description: 'See how your metadata looks across platforms',
        category: 'content-audit',
        icon: 'Eye',
        benefits: [
            'Previews search listings on Google, Bing, and Socials',
            'Optimizes CTR with compelling titles and descriptions',
            'Simulates mobile and desktop search storage',
            'Ensures metadata is not truncated in results'
        ]
    },
    {
        id: 'duplicate-finder',
        slug: 'duplicate-finder',
        name: 'Duplicate Content Finder',
        description: 'Detect duplicate content and get canonical suggestions',
        category: 'content-audit',
        icon: 'Copy',
        benefits: [
            'Identifies internal duplicate content issues',
            'Suggests correct canonical tags to resolve conflicts',
            'Prevents keyword cannibalization',
            'Consolidates ranking signals to preferred pages'
        ]
    },
    {
        id: 'lsi-keyword-tool',
        slug: 'lsi-keyword-extractor',
        name: 'LSI Keyword Extractor',
        description: 'Extract and analyze LSI keywords vs competitors',
        category: 'content-audit',
        icon: 'Key',
        benefits: [
            'Discovers semantically related keywords (LSI)',
            'Improves content relevance for broader rankings',
            'Analyzes competitor keyword usage patterns',
            'Helps write more natural, authoritative content'
        ]
    },
    {
        id: 'js-rendering-checker',
        slug: 'js-rendering-checker',
        name: 'JavaScript Rendering Checker',
        description: 'Verify content visibility without JavaScript',
        category: 'infrastructure',
        icon: 'Cpu',
        benefits: [
            'Checks if content is visible when JS is disabled',
            'Diagnoses rendering issues for search bots',
            'Ensures critical content is indexed by all crawlers',
            'Validates progressive enhancement implementation'
        ]
    },
]

export const CATEGORIES = {
    infrastructure: {
        name: 'Infrastructure & Technical',
        description: 'Core technical SEO and performance optimization',
        color: 'from-blue-500 to-cyan-500',
    },
    'ai-semantic': {
        name: 'AI & Semantic Optimization',
        description: 'GEO tools for AI search engines and LLMs',
        color: 'from-purple-500 to-pink-500',
    },
    'content-audit': {
        name: 'Content & Audit',
        description: 'Content analysis and gap identification',
        color: 'from-emerald-500 to-teal-500',
    },
}

export const FREE_TOOL_LIMIT = 3

export const PRICING = {
    free: {
        name: 'Free',
        price: 0,
        features: [
            '3 tools of your choice',
            'Basic analytics',
            'Community support',
        ],
    },
    pro: {
        name: 'Pro',
        price: 49,
        features: [
            'All 18 tools',
            'Unlimited usage',
            'Advanced analytics',
            'Priority support',
            'API access',
        ],
    },
    enterprise: {
        name: 'Enterprise',
        price: 'Custom',
        features: [
            'Everything in Pro',
            'Custom integrations',
            'Dedicated account manager',
            'SLA guarantee',
            'White-label option',
        ],
    },
}
