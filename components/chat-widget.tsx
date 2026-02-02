"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Bot, User, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

// --- Expanded Knowledge Base ---
const KNOWLEDGE_BASE = [
    // --- Specific User Requests ---
    {
        keywords: ["accuracy", "accurate", "precision", "reliable"],
        answer: "Yes, our results are **98% accurate**. We use advanced, multi-modal verification to ensure the data you get is precise and actionable for AI models."
    },
    // --- Pricing & Subscription ---
    {
        keywords: ["pricing", "price", "cost", "subscription", "pay", "plan", "billing"],
        answer: "Our pricing is just **$19.99/month** only. This is the **best alternative** to other GEO tools which charge **$100s of dollars** per month. We provide **18 useful tools** included in this affordable $19.99/month package."
    },
    {
        keywords: ["cancel", "refund", "money back"],
        answer: "You can **cancel anytime** from your dashboard with a single click. No hidden fees or long-term contracts."
    },

    // --- GEO Concepts ---
    {
        keywords: ["what is geo", "generative engine", "define geo"],
        answer: "**GEO (Generative Engine Optimization)** is the process of optimizing for AI 'Answer Engines' like ChatGPT and Perplexity. Unlike SEO which targets 10 blue links, GEO targets the single direct answer."
    },
    {
        keywords: ["answer engine", "blue links", "traditional seo"],
        answer: "Search engines are becoming **Answer Engines**. They don't just list links; they read content and summarize it. Our tools ensure your content is structured so these engines cite YOU as the source."
    },

    // --- Specific Tools (Infrastructure) ---
    {
        keywords: ["technical readiness", "crawler", "robot"],
        answer: "The **Technical Readiness Checker** ensures your site is accessible. It verifies robots.txt, sitemaps, and SSL to make sure AI crawlers can actually read your content."
    },
    {
        keywords: ["schema", "json-ld", "structured data"],
        answer: "Our **Schema Generator** creates verified JSON-LD code. It supports multiple schema types (Article, FAQ, Product) to help machines understand your context."
    },
    {
        keywords: ["core web vital", "speed", "performance"],
        answer: "The **Core Web Vitals Fixer** analyzes your page speed and LCP/CLS metrics. It helps you pass Google's performance standards which is crucial for ranking."
    },
    {
        keywords: ["mobile", "render", "phone"],
        answer: "The **Mobile Auditor** checks your site on different devices and ensures tap targets are sized correctly for mobile-first indexing."
    },
    {
        keywords: ["link fixer", "broken link", "404"],
        answer: "The **Link Fixer** auto-generates redirect rules for broken links, helping you recover lost 'link juice' and user trust."
    },

    // --- Specific Tools (AI & Semantic) ---
    {
        keywords: ["citation checker", "track brand", "mentions"],
        answer: "The **AI Citation Checker** discovers if and how your brand is being mentioned in AI results like ChatGPT. It tracks sentiment and visibility."
    },
    {
        keywords: ["content scorer", "readability", "score"],
        answer: "The **AI Content Scorer** measures how easy it is for an LLM to read your content. It specifically looks for 'hallucination triggers' and structural clarity."
    },
    {
        keywords: ["llms.txt", "txt file", "training data"],
        answer: "The **llms.txt Generator** creates a specialized markdown file for AI crawlers. It acts as a 'high-speed lane' for bots to ingest your core business info."
    },
    {
        keywords: ["answer first", "structure", "rewrite"],
        answer: "The **Answer-First Structure Tool** helps you rewrite content to place the most important info at the top (Inverted Pyramid), which LLMs prefer."
    },
    {
        keywords: ["semantic mapper", "entity", "topics"],
        answer: "The **Semantic SEO Mapper** finds missing entities and topics in your content compared to competitors, helping you build topical authority."
    },

    // --- Specific Tools (Content Audit) ---
    {
        keywords: ["audit", "gap analysis", "competitor"],
        answer: "The **General Audit & Gap Analysis** tool compares your content against top competitors to find what opportunities you are missing."
    },
    {
        keywords: ["linking suggester", "internal link"],
        answer: "The **Linking Suggester** uses AI to recommend relevant internal links, improving your site architecture and keeping users engaged."
    },
    {
        keywords: ["serp", "preview", "google view"],
        answer: "The **SERP Previewer** lets you see how your page will look on Google, Bing, and Social Media before you publish."
    },
    {
        keywords: ["duplicate", "cannibalization"],
        answer: "The **Duplicate Content Finder** detects identical content across your site and suggests canonical tags to prevent keyword cannibalization."
    },
    {
        keywords: ["lsi", "keyword", "related terms"],
        answer: "The **LSI Keyword Extractor** finds semantically related terms to help you rank for a broader range of search queries."
    },
    {
        keywords: ["rendering", "javascript", "js check"],
        answer: "The **JavaScript Rendering Checker** verifies if your content is visible when JS is disabled, ensuring bots (which often skip JS) can see your text."
    },

    // --- General / Fallback ---
    {
        keywords: ["login", "sign in"],
        answer: "You can log in at [geo-ox.ai/login](/login). We support Google Sign-In and Email."
    },
    {
        keywords: ["hi", "hello", "hey", "start"],
        answer: "Hello! I'm the **GEO Ox Assistant**. You can ask me about our **18+ tools**, **pricing**, or check your **results accuracy**."
    }
]

type Message = {
    role: "assistant" | "user"
    content: string
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi there! 👋 I can help you understand GEO Ox features or answer support questions. How can I help?" }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMsg }])
        setIsTyping(true)

        // Simulate AI "Thinking" delay
        setTimeout(() => {
            const lowerInput = userMsg.toLowerCase()

            // Logic: Find the FIRST match where ANY keyword exists in the input
            const match = KNOWLEDGE_BASE.find(item =>
                item.keywords.some(k => lowerInput.includes(k) || k === lowerInput)
            )

            let response = "I'm not sure about that specific detail yet. You can ask about **accuracy**, **pricing**, or specific tools like **llms.txt**."

            if (match) {
                response = match.answer
            }

            setMessages(prev => [...prev, { role: "assistant", content: response }])
            setIsTyping(false)
        }, 800 + Math.random() * 500)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] md:w-[380px] h-[500px] shadow-2xl border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-slate-900 p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">GEO Ox Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-slate-400 text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                            onClick={() => setIsOpen(false)}
                        >
                            <ChevronDown className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 bg-slate-50 p-4" ref={scrollRef}>
                        <div className="space-y-4 pb-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                        }`}>
                                        {/* Simple Markdown for Bold Text */}
                                        {msg.content.split("**").map((part, i) =>
                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                        <form
                            className="flex gap-2"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                placeholder="Ask about accuracy, tools..."
                                className="focus-visible:ring-blue-500"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                                disabled={!input.trim() || isTyping}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        <div className="text-[10px] text-center text-slate-400 mt-2">
                            Powered by GEO Ox AI
                        </div>
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-xl shadow-blue-600/30 bg-blue-600 hover:bg-blue-700 hover:scale-110 transition-all p-0"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="w-7 h-7" />
                    <span className="sr-only">Open Chat</span>
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                </Button>
            )}
        </div>
    )
}
