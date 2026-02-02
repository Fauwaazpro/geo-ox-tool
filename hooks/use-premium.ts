"use client"

import { useState, useEffect } from "react"

export function usePremium() {
    // Persist premium state in localStorage for demo purposes
    // In a real app, this would come from Supabase user metadata or a subscription table
    const [isPremium, setIsPremium] = useState(false)

    useEffect(() => {
        // Load initial state
        const stored = localStorage.getItem('geo_ox_is_premium')
        if (stored === 'true') {
            setIsPremium(true)
        }
    }, [])

    const togglePremium = () => {
        const newState = !isPremium
        setIsPremium(newState)
        localStorage.setItem('geo_ox_is_premium', String(newState))
    }

    const setPremium = (status: boolean) => {
        setIsPremium(status)
        localStorage.setItem('geo_ox_is_premium', String(status))
    }

    return {
        isPremium,
        togglePremium,
        setPremium
    }
}
