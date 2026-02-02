"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Download, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface GuideDownloadButtonProps {
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    showIcon?: boolean
}

export function GuideDownloadButton({ className, variant = "default", size = "default", showIcon = true }: GuideDownloadButtonProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setIsLoggedIn(!!user)
        }
        checkUser()
    }, [])

    const handleDownload = () => {
        if (isLoggedIn) {
            router.push('/survey')
        } else {
            router.push('/login?next=/survey')
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleDownload}
        >
            {showIcon && (
                isLoggedIn ? <Download className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />
            )}
            Download Free Guide
        </Button>
    )
}
