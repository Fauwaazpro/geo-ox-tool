"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Download, CheckCircle2, Code2 } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface GeneratorForm {
    type: string
    name: string
    description: string
    url: string
    author?: string
    datePublished?: string
    price?: string
}

const schemaTypes = [
    { value: "Article", label: "Article" },
    { value: "Product", label: "Product" },
    { value: "Organization", label: "Organization" },
    { value: "LocalBusiness", label: "Local Business" },
    { value: "FAQPage", label: "FAQ Page" },
]

export default function SchemaGeneratorPage() {
    const { isPremium } = usePremium()
    const [form, setForm] = useState<GeneratorForm>({
        type: "Article",
        name: "",
        description: "",
        url: "",
    })
    const [generatedSchema, setGeneratedSchema] = useState<string | null>(null)
    const [validated, setValidated] = useState(false)

    const generateSchema = () => {
        let schema: any = {
            "@context": "https://schema.org",
            "@type": form.type,
            "name": form.name,
            "description": form.description,
            "url": form.url,
        }

        // Add type-specific fields
        if (form.type === "Article" && form.author) {
            schema.author = {
                "@type": "Person",
                "name": form.author
            }
            if (form.datePublished) {
                schema.datePublished = form.datePublished
            }
        }

        if (form.type === "Product" && form.price) {
            schema.offers = {
                "@type": "Offer",
                "price": form.price,
                "priceCurrency": "USD"
            }
        }

        const jsonLd = JSON.stringify(schema, null, 2)
        setGeneratedSchema(jsonLd)
        setValidated(false)
    }

    const validateSchema = () => {
        // Simulate validation (in real app, call Google's Structured Data Testing Tool API)
        setTimeout(() => {
            setValidated(true)
        }, 1000)
    }

    const copyToClipboard = () => {
        if (generatedSchema) {
            navigator.clipboard.writeText(generatedSchema)
        }
    }

    const downloadSchema = () => {
        if (generatedSchema) {
            const blob = new Blob([generatedSchema], { type: 'application/ld+json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'schema.json'
            a.click()
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Schema Generator</span>
                    </div>

                    <div className="w-32" />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Form */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Schema Generator</h1>
                            <p className="text-muted-foreground">
                                Create verified JSON-LD structured data with one click
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Configure Schema</CardTitle>
                                <CardDescription>
                                    Fill in your content details to generate structured data
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Schema Type */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Schema Type</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    >
                                        {schemaTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Name *</label>
                                    <Input
                                        placeholder="e.g., My Awesome Article"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Description *</label>
                                    <textarea
                                        className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                                        placeholder="Provide a brief description..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>

                                {/* URL */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">URL *</label>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/page"
                                        value={form.url}
                                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    />
                                </div>

                                {/* Type-specific fields */}
                                {form.type === "Article" && (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Author</label>
                                            <Input
                                                placeholder="John Doe"
                                                value={form.author || ""}
                                                onChange={(e) => setForm({ ...form, author: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Date Published</label>
                                            <Input
                                                type="date"
                                                value={form.datePublished || ""}
                                                onChange={(e) => setForm({ ...form, datePublished: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}

                                {form.type === "Product" && (
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Price</label>
                                        <Input
                                            type="number"
                                            placeholder="99.99"
                                            value={form.price || ""}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        />
                                    </div>
                                )}

                                <Button
                                    onClick={generateSchema}
                                    className="w-full"
                                    disabled={!form.name || !form.description || !form.url}
                                >
                                    Generate Schema
                                </Button>
                            </CardContent>
                        </Card>

                        <ToolBenefits toolSlug="schema-generator" />
                    </div>

                    {/* Right Side - Generated Schema */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Generated Schema</h2>
                            <p className="text-muted-foreground">
                                Copy or download your verified structured data
                            </p>
                        </div>

                        <PremiumLock isLocked={!isPremium} title="View Generated Schema">
                            {generatedSchema ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center justify-between">
                                                <span>JSON-LD Output</span>
                                                {validated && (
                                                    <span className="flex items-center gap-2 text-sm font-normal text-success">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Validated
                                                    </span>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="relative">
                                                <pre className="p-4 bg-surface rounded-lg text-sm overflow-x-auto border max-h-[400px]">
                                                    <code>{generatedSchema}</code>
                                                </pre>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                                                    Copy to Clipboard
                                                </Button>
                                                <Button onClick={downloadSchema} variant="outline" className="flex-1">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                            </div>

                                            {!validated && (
                                                <Button onClick={validateSchema} className="w-full" variant="success">
                                                    Validate with Google
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">How to Use</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                                <li>Copy the JSON-LD code above</li>
                                                <li>Paste it in the {`<head>`} section of your HTML</li>
                                                <li>Wrap it in {`<script type="application/ld+json">`} tags</li>
                                                <li>Test with Google's Rich Results Test</li>
                                            </ol>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <Card className="border-dashed">
                                    <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                        <div className="text-center">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Fill in the form to generate schema</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </PremiumLock>
                    </div>
                </div>
            </main>
        </div>
    )
}
