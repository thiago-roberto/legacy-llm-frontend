'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LLMFeature = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResponse(null);
        try {
            const res = await fetch('http://localhost:4000/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input }),
            });
            const data = await res.json();
            setResponse(data.result);
        } catch (err) {
            setResponse('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="Describe the challenge you're facing with the patient..."
            className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
                <Button onClick={handleAsk} disabled={loading}>
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
