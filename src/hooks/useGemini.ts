import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, BlockType } from '../types/report';

export function useGemini(apiKey: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userText: string, targetBlock?: BlockType, blockContext?: string): Promise<string> => {
      if (!apiKey.trim()) {
        setError('Будь ласка, введіть API ключ Gemini.');
        return '';
      }

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userText,
        targetBlock,
      };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      setError(null);

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use Gemini 2.5 Flash - the latest stable model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `Ти асистент для написання академічних звітів. Стиль: офіційний, науковий, українська мова. 
Дотримуйся стандартів ДСТУ та вимог ЛНУ ім. Івана Франка.
${blockContext ? `\nПоточний вміст розділу:\n${blockContext}` : ''}
Надай відповідь тільки текстом розділу без зайвих пояснень, якщо не запитують іншого.`;

        const result = await model.generateContent(`${systemPrompt}\n\nЗапит: ${userText}`);
        const text = result.response.text();

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text,
          targetBlock,
        };
        setMessages(prev => [...prev, assistantMsg]);
        return text;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Помилка з\'єднання з Gemini API';
        setError(msg);
        return '';
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
