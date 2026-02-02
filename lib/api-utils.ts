/**
 * Shared Utilities for Deterministic API Results
 * 
 * These utilities ensure all APIs return consistent results
 * for the same inputs across multiple requests.
 */

// Deterministic hash function
export function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
}

// Simple in-memory cache (use Redis in production)
export class SimpleCache {
    private cache = new Map<string, { data: any, timestamp: number }>()
    private duration: number

    constructor(durationMs: number = 3600000) { // 1 hour default
        this.duration = durationMs
    }

    get(key: string): any | null {
        const cached = this.cache.get(key)
        if (cached && (Date.now() - cached.timestamp) < this.duration) {
            return cached.data
        }
        this.cache.delete(key)
        return null
    }

    set(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        })
    }

    has(key: string): boolean {
        return this.get(key) !== null
    }

    clear(): void {
        this.cache.clear()
    }
}

// Generate deterministic score based on input
export function deterministicScore(input: string, min: number = 0, max: number = 100): number {
    const hash = hashString(input)
    return min + (hash % (max - min + 1))
}

// Generate deterministic boolean based on input and threshold
export function deterministicBoolean(input: string, threshold: number = 50): boolean {
    const score = deterministicScore(input, 0, 100)
    return score >= threshold
}

// Generate deterministic choice from array
export function deterministicChoice<T>(input: string, choices: T[]): T {
    const hash = hashString(input)
    const index = hash % choices.length
    return choices[index]
}

// Extract domain from URL
export function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url)
        return urlObj.hostname.replace('www.', '')
    } catch {
        return url
    }
}

// Normalize input for consistent hashing
export function normalizeInput(input: string): string {
    return input.toLowerCase().trim()
}
