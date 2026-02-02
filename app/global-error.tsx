"use client"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
                    <h2 className="text-3xl font-bold text-slate-900">Critical System Error</h2>
                    <p className="text-slate-600">The application encountered a critical error.</p>
                    <pre className="bg-slate-200 p-4 rounded text-xs overflow-auto max-w-lg">
                        {error.message}
                    </pre>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => reset()}
                    >
                        Reload Application
                    </button>
                </div>
            </body>
        </html>
    )
}
