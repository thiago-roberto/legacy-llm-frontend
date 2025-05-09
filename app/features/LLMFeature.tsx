'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sanitizeInput } from '@/helpers/sanitizer';

const MAX_LENGTH = 500;

interface ApiResponse {
    result: string;
    sources?: string[];
}

const LLMFeature: React.FC = () => {
    const [input, setInput] = useState('');
    const [rawResponse, setRawResponse] = useState<string | null>(null);
    const [formattedResponse, setFormattedResponse] = useState<string | null>(null);
    const [sources, setSources] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (value: string) => {
        const cleanValue = sanitizeInput(value);
        setInput(cleanValue);
        const trimmed = cleanValue.trim();
        if (trimmed.length === 0) {
            setError('Input cannot be empty.');
        } else if (trimmed.length > MAX_LENGTH) {
            setError(`Input must be at most ${MAX_LENGTH} characters.`);
        } else {
            setError(null);
        }
    };

    const handleAsk = async () => {
        if (error) return;
        setLoading(true);
        setRawResponse(null);
        setFormattedResponse(null);
        setSources([]);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/ask`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ input: input.trim() }),
                }
            );
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Request failed');
            }
            const data: ApiResponse = await res.json();
            setRawResponse(data.result);
            const html = data.result
                // escape HTML special chars first (optional, if you trust the content you can skip)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                // now replace **...**
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                // convert newlines to <br>
                .replace(/\n/g, '<br/>');

            setFormattedResponse(html);
            if (data.sources) {
                const unique = Array.from(new Set(data.sources));
                setSources(unique);
            }
        } catch (err: any) {
            setError(`Something went wrong. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled =
        loading ||
        Boolean(error) ||
        input.trim().length === 0;

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
        <textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
            placeholder="Describe the challenge you're facing with the patient..."
            className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{input.trim().length} / {MAX_LENGTH} chars</span>
                    {error && <span className="text-red-600">{error}</span>}
                </div>
                <Button onClick={handleAsk} disabled={isButtonDisabled}>
                    {loading ? 'Thinking...' : 'Ask for Advice'}
                </Button>

                {formattedResponse && (
                    <div className="mt-4 space-y-2">
                        <div>
                            <strong>Suggestion:</strong>
                            <div
                                className="mt-2 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: formattedResponse }}
                            />
                        </div>
                        {sources.length > 0 && (
                            <div className="text-xs text-gray-600">
                                <strong>Sources used:</strong> {sources.join(', ')}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LLMFeature;
