"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, Download, Users, Briefcase, Zap, GraduationCap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Data Structure
const questions = [
    {
        id: 1,
        question: "Which of the following best describes your current role?",
        options: [
            { id: "dev", label: "Professional Developer", sub: "Building for clients or a company", icon: Briefcase },
            { id: "student", label: "Student", sub: "Learning SEO/Web Development", icon: GraduationCap },
            { id: "indie", label: "Solo Entrepreneur", sub: "Building your own products", icon: Zap },
            { id: "seo", label: "Marketing/SEO Specialist", sub: "Optimizing for a brand", icon: Users },
            { id: "owner", label: "Non-Technical Business Owner", sub: "Managing your own site", icon: Users },
        ]
    },
    {
        id: 2,
        question: "What is your main goal for using GEOOX?",
        options: [
            { id: "business", label: "Business / Commercial Use", sub: "Ranking a company website" },
            { id: "side-hustle", label: "Solo Project", sub: "Growing a personal side-hustle" },
            { id: "client", label: "Client Work", sub: "Managing multiple websites for others" },
            { id: "research", label: "Education / Research", sub: "Testing how AI models see the web" },
            { id: "explore", label: "Trial / Exploration", sub: "Just seeing what the 18 tools can do" },
        ]
    },
    {
        id: 3,
        question: "How familiar are you with Generative Engine Optimization (GEO)?",
        options: [
            { id: "beginner", label: "Beginner", sub: "I'm just learning how AI search works." },
            { id: "intermediate", label: "Intermediate", sub: "I understand SEO but am new to AI-driven optimization." },
            { id: "advanced", label: "Advanced", sub: "I already optimize sites for Perplexity, Gemini, and ChatGPT." },
        ]
    },
    {
        id: 4,
        question: "How often do you expect to use GEOOX for your projects?",
        options: [
            { id: "daily", label: "Daily", sub: "I'm actively building/optimizing every day" },
            { id: "weekly", label: "Weekly", sub: "I do regular site maintenance and updates" },
            { id: "monthly", label: "Monthly", sub: "I check my performance once in a while" },
            { id: "once", label: "One-time", sub: "I just need to fix a specific issue right now" },
        ]
    }
]

export default function SurveyPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [isDownloading, setIsDownloading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [countdown, setCountdown] = useState(5)

    const currentQuestion = questions[step]
    const progress = ((step) / questions.length) * 100

    const handleSelect = (optionId: string) => {
        setAnswers(prev => ({ ...prev, [step]: optionId }))

        // Auto advance
        if (step < questions.length - 1) {
            setTimeout(() => setStep(prev => prev + 1), 250)
        } else {
            finishSurvey()
        }
    }

    const finishSurvey = () => {
        setCompleted(true)
    }

    const triggerDownload = useCallback(() => {
        setIsDownloading(true)
        const link = document.createElement('a')
        link.href = '/GEOGuide.pdf'
        link.download = 'GENERATIVE-ENGINE-OPTIMIZATION-Guide.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
            router.push('/dashboard')
        }, 3000)
    }, [router])

    useEffect(() => {
        if (completed && countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        } else if (completed && countdown === 0) {
            triggerDownload()
        }
    }, [completed, countdown, triggerDownload])

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                {!completed && (
                    <div className="mb-8 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!completed ? (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="p-8 shadow-xl border-slate-100 bg-white/80 backdrop-blur-sm">
                                <div className="mb-2 text-sm font-medium text-blue-600 uppercase tracking-wider">
                                    Step {step + 1} of {questions.length}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    {currentQuestion.question}
                                </h2>

                                <div className="space-y-3">
                                    {currentQuestion.options.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleSelect(option.id)}
                                            className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Option details */}
                                                <div>
                                                    <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                                                        {option.label}
                                                    </div>
                                                    <div className="text-sm text-slate-500 group-hover:text-blue-600">
                                                        {option.sub}
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <Card className="p-12 shadow-2xl border-blue-100 bg-white">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">All Set!</h2>

                                {!isDownloading ? (
                                    <p className="text-slate-600 mb-8 text-lg">
                                        Your download will start in <span className="font-bold text-blue-600 text-2xl">{countdown}</span> seconds...
                                    </p>
                                ) : (
                                    <p className="text-slate-600 mb-8 text-lg">
                                        Downloading now...
                                    </p>
                                )}

                                {isDownloading && (
                                    <div className="flex items-center justify-center text-blue-600 gap-2 animate-pulse">
                                        <Download className="w-5 h-5" />
                                        <span>Downloading...</span>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <p className="text-slate-400 text-sm mb-4">Didn&apos;t start?</p>
                                    <Button onClick={triggerDownload} variant="outline" className="gap-2">
                                        Try Again
                                    </Button>
                                    <div className="mt-4">
                                        <Button variant="link" asChild>
                                            <a href="/dashboard">Continue to Dashboard <ArrowRight className="w-4 h-4 ml-1" /></a>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
