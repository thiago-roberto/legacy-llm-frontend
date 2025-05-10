'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { sanitizeInput } from '@/helpers/sanitizer'
import {SearchResult} from "@/interfaces/SearchResult";

const MAX_LENGTH = 500

type Hit = {
    content: string
    source: string
}

const SearchFeature: React.FC = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Hit[]>([])
    const [expanded, setExpanded] = useState<Set<number>>(new Set())
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (value: string) => {
        const cleanValue = sanitizeInput(value)
        setQuery(cleanValue)
        const trimmed = cleanValue.trim()

        if (trimmed.length === 0) {
            setError('Input cannot be empty.')
        } else if (trimmed.length > MAX_LENGTH) {
            setError(`Input must be at most ${MAX_LENGTH} characters.`)
        } else {
            setError(null)
        }
    }

    const handleSearch = async () => {
        if (error) return
        setLoading(true)
        setError(null)
        setResults([])

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/search`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: query.trim() }),
                }
            )
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Request failed')
            }
            const data: { results: SearchResult[] } = await res.json()
            if (data.results) {
                setResults(
                    data.results.map((r) => {
                        console.log(r);
                        if (typeof r.pageContent === 'string') {
                            return {
                                content: r.pageContent,
                                source: r.source,
                            }
                        }
                    })
                )
            } else {
                setError('No results found.')
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(`Failed to fetch results. ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const isButtonDisabled = loading || Boolean(error)

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
        <textarea
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            rows={3}
            placeholder="Search for similar counseling cases..."
            className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
                <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            {query.trim().length} / {MAX_LENGTH} chars
          </span>
                    {error && <span className="text-red-600">{error}</span>}
                </div>
                <Button onClick={handleSearch} disabled={isButtonDisabled}>
                    {loading ? 'Searching...' : 'Search'}
                </Button>

                {results.length > 0 && (
                    <div className="space-y-4">
                        {results.map((hit, i) => {
                            const fullText = hit.content
                            const isExpanded = expanded.has(i)
                            const displayText = isExpanded
                                ? fullText
                                : fullText.slice(0, 400) +
                                (fullText.length > 400 ? '...' : '')

                            const formatted = displayText.replace(
                                /(https?:\/\/[^\s]+)/g,
                                (url) =>
                                    `<a href="${url}" class="text-blue-600 underline" target="_blank">${url}</a>`
                            )

                            return (
                                <div
                                    key={i}
                                    className="p-4 border rounded bg-white shadow-sm text-sm space-y-2"
                                >
                                    <div
                                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formatted }}
                                    />
                                    {fullText.length > 400 && (
                                        <button
                                            className="text-emerald-700 text-xs underline"
                                            onClick={() => {
                                                setExpanded((prev) => {
                                                    const nxt = new Set(prev)
                                                    if (nxt.has(i)) nxt.delete(i)
                                                    else nxt.add(i)
                                                    return nxt
                                                })
                                            }}
                                        >
                                            {isExpanded ? 'Show less' : 'Read more'}
                                        </button>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                        Source: {hit.source}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SearchFeature
