import React, { useState, useRef, useEffect } from 'react';
import type { BlockType, ChatMessage, ReportData } from '../types/report';
import { useGemini } from '../hooks/useGemini';

const BLOCK_LABELS: Record<BlockType, string> = {
  titlePage: '📄 Титульна сторінка',
  abstract: '📋 Мета роботи',
  workProgress: '🔧 Хід роботи',
  conclusion: '✅ Висновки',
  appendix: '🗂️ Додаток',
  references: '📚 Список джерел',
};

interface Props {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  activeBlock: BlockType | null;
  onApplyToBlock: (block: BlockType, text: string) => void;
  reportData: ReportData;
}

function getBlockContext(block: BlockType | null, reportData: ReportData): string {
  if (!block) return '';
  switch (block) {
    case 'titlePage': return `Курс: ${reportData.titlePage.course}, Тема: ${reportData.titlePage.topic}`;
    case 'abstract': return reportData.abstract.content;
    case 'workProgress': return reportData.workProgress.steps.map(s => `${s.title}: ${s.content}`).join('\n');
    case 'conclusion': return reportData.conclusion.content;
    case 'appendix': return reportData.appendix.code;
    case 'references': return reportData.references.items.join('\n');
    default: return '';
  }
}

export const ChatPanel: React.FC<Props> = ({
  apiKey,
  onApiKeyChange,
  activeBlock,
  onApplyToBlock,
  reportData,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<BlockType | null>(activeBlock);
  const { messages, isLoading, error, sendMessage } = useGemini(apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedBlock(activeBlock);
  }, [activeBlock]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const context = getBlockContext(selectedBlock, reportData);
    await sendMessage(prompt, selectedBlock ?? undefined, context);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  const handleApply = (msg: ChatMessage) => {
    if (!selectedBlock) return;
    onApplyToBlock(selectedBlock, msg.content);
  };

  return (
    <aside className="chat-panel">
      <div className="chat-panel__header">
        <h2 className="chat-panel__title">🤖 AI Асистент</h2>
        <p className="chat-panel__subtitle">Gemini 2.5 Flash</p>
      </div>

      <div className="chat-panel__api-key">
        <label>API Ключ Gemini</label>
        <input
          type="password"
          value={apiKey}
          onChange={e => onApiKeyChange(e.target.value)}
          placeholder="Вставте ваш Gemini API ключ..."
        />
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="api-key-link"
        >
          Отримати безкоштовний API ключ →
        </a>
      </div>

      <div className="chat-panel__block-select">
        <label>Цільовий блок</label>
        <select
          value={selectedBlock ?? ''}
          onChange={e => setSelectedBlock((e.target.value as BlockType) || null)}
        >
          <option value="">— Загальний запит —</option>
          {(Object.keys(BLOCK_LABELS) as BlockType[]).map(b => (
            <option key={b} value={b}>{BLOCK_LABELS[b]}</option>
          ))}
        </select>
      </div>

      <div className="chat-panel__messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>👋 Привіт! Я допоможу вам написати звіт.</p>
            <p>Виберіть блок і введіть запит, наприклад:</p>
            <ul>
              <li>«Напиши мету для лабораторної з ООП»</li>
              <li>«Допоможи написати висновки»</li>
              <li>«Напиши хід роботи для кроку 1»</li>
            </ul>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
            <div className="chat-message__meta">
              {msg.role === 'user' ? '👤 Ви' : '🤖 Gemini'}
              {msg.targetBlock && (
                <span className="chat-message__block-tag">{BLOCK_LABELS[msg.targetBlock]}</span>
              )}
            </div>
            <div className="chat-message__content">{msg.content}</div>
            {msg.role === 'assistant' && selectedBlock && (
              <button
                className="btn-apply"
                onClick={() => handleApply(msg)}
                title="Вставити в обраний блок"
              >
                ↩ Вставити в «{BLOCK_LABELS[selectedBlock]}»
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__meta">🤖 Gemini</div>
            <div className="chat-loading">
              <span /><span /><span />
            </div>
          </div>
        )}
        {error && (
          <div className="chat-error">⚠️ {error}</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-panel__input">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введіть запит... (Ctrl+Enter для відправки)"
          rows={3}
        />
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? '⏳' : '▶ Надіслати'}
        </button>
      </div>
    </aside>
  );
};
