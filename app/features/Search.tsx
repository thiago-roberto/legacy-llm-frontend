'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MAX_LENGTH = 500;

const SearchFeature = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validate input length and emptiness on every change
    const handleChange = (value: string) => {
        setQuery(value);
        const trimmed = value.trim();

        if (trimmed.length === 0) {
            setError('Input cannot be empty.');
        } else if (trimmed.length > MAX_LENGTH) {
            setError(`Input must be at most ${MAX_LENGTH} characters.`);
        } else {
            setError(null);
        }
    };

    const handleSearch = async () => {
        if (error) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/search`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: query.trim() }),
                }
            );
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Request failed');
            }
            const data = await res.json();
            if (data.results) {
                setResults(data.results.map((r: any) => r.pageContent));
            } else {
                setError('No results found.');
            }
        } catch (err: any) {
            setError(`Failed to fetch results. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = loading || Boolean(error);

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
                    <span>{query.trim().length} / {MAX_LENGTH} chars</span>
                    {error && <span className="text-red-600">{error}</span>}
                </div>
                <Button onClick={handleSearch} disabled={isButtonDisabled}>
                    {loading ? 'Searching...' : 'Search'}
                </Button>
                {results.length > 0 && (
                    <div className="space-y-4">
                        {results.map((r, i) => {
                            const fullText = r;
                            const isExpanded = expanded.has(i);
                            const displayText = isExpanded
                                ? fullText
                                : fullText.slice(0, 400) + (fullText.length > 400 ? '...' : '');

                            const formatted = displayText.replace(
                                /(https?:\/\/[^\s]+)/g,
                                (url) => `<a href="${url}" class="text-blue-600 underline" target="_blank">${url}</a>`
                            );

                            return (
                                <div key={i} className="p-4 border rounded bg-white shadow-sm text-sm space-y-2">
                                    <div
                                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formatted }}
                                    />
                                    {fullText.length > 400 && (
                                        <button
                                            className="text-emerald-700 text-xs underline"
                                            onClick={() => {
                                                setExpanded((prev) => {
                                                    const newSet = new Set(prev);
                                                    if (newSet.has(i)) newSet.delete(i);
                                                    else newSet.add(i);
                                                    return newSet;
                                                });
                                            }}
                                        >
                                            {isExpanded ? 'Show less' : 'Read more'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SearchFeature;
