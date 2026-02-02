import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { TOOLS } from "@/lib/constants"

interface ToolBenefitsProps {
    toolSlug: string
    className?: string
}

export function ToolBenefits({ toolSlug, className }: ToolBenefitsProps) {
    const tool = TOOLS.find(t => t.slug === toolSlug || t.id === toolSlug)

    if (!tool || !tool.benefits || tool.benefits.length === 0) {
        return null
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Why {tool.name}?
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {tool.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-success mt-0.5">✓</span>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
