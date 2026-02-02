"use client"

import { useEffect } from "react"


export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Something went wrong!</h2>
            <p className="text-slate-500 max-w-md text-center">
                {error.message || "An unexpected error occurred."}
            </p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Try again
            </button>
        </div>
    )
}
