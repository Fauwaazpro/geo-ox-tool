import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">404 - Page Not Found</h2>
            <p className="text-slate-600 mb-8 max-w-md">
                The page you are looking for does not exist. It might have been moved or you may have mistyped the address.
            </p>
            <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
            </Link>
        </div>
    )
}
