'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MAX_LENGTH = 500;

const LLMFeature = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (value: string) => {
        setInput(value);
        const trimmed = value.trim();
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
        setResponse(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: input.trim() }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Request failed');
            }

            const data = await res.json();
            setResponse(data.result);
        } catch (err: any) {
            setResponse(`Something went wrong. ${err.message}`);
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
                {response && (
                    <div className="mt-4">
                        <strong>Suggestion:</strong>
                        <p className="mt-2 whitespace-pre-line">{response}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LLMFeature;
