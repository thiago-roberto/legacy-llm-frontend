'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SearchFeature = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: query })
            });
            const data = await res.json();
            if (data.results) {
                setResults(data.results.map((r: any) => r.pageContent));
            } else {
                setError('No results found.');
            }
        } catch (err) {
            setError(`Failed to fetch results. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (index: number) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={3}
                    placeholder="Search for similar counseling cases..."
                    className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </Button>
                {error && <p className="text-red-500">{error}</p>}
                {results.length > 0 && (
                    <div className="space-y-4">
                        {results.map((r, i) => {
                            const [firstLine, ...rest] = r.split('\n');
                            const fullText = [firstLine, ...rest].join('\n');
                            const isExpanded = expanded.has(i);
                            const displayText = isExpanded ? fullText : fullText.slice(0, 400) + (fullText.length > 400 ? '...' : '');

                            const formatted = displayText.replace(/(https?:\/\/[^\s]+)/g, (url) => `<a href="${url}" class="text-blue-600 underline" target="_blank">${url}</a>`);

                            return (
                                <div key={i} className="p-4 border rounded bg-white shadow-sm text-sm space-y-2">
                                    <div
                                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formatted }}
                                    />
                                    {fullText.length > 400 && (
                                        <button
                                            className="text-emerald-700 text-xs underline"
                                            onClick={() => toggleExpand(i)}
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
