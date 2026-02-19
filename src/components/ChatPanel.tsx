import React, { useState, useRef, useEffect } from 'react';
import type { BlockType, ChatMessage, LabReport } from '../types/report';
import { useGemini } from '../hooks/useGemini';

const BLOCK_LABELS: Record<BlockType, string> = {
  titlePage:    '📄 Титульна сторінка',
  abstract:     '📋 Мета роботи',
  workProgress: '🔧 Хід роботи',
  conclusion:   '✅ Висновки',
  appendix:     '🗂️ Додаток',
  references:   '📚 Список джерел',
};

interface Props {
  apiKey: string;
  activeBlock: BlockType | null;
  onApplyToBlock: (block: BlockType, text: string) => void;
  report: LabReport;
  collapsed?: boolean;
}

function getBlockContext(block: BlockType | null, report: LabReport): string {
  if (!block) return '';
  switch (block) {
    case 'abstract':     return report.abstract.content;
    case 'workProgress': return report.workProgress.items.map((s, i) => `${i + 1}. ${s.text}`).join('\n');
    case 'conclusion':   return report.conclusion.content;
    case 'appendix':     return report.appendix.code;
    case 'references':   return report.references.items.join('\n');
    default:             return '';
  }
}

export const ChatPanel: React.FC<Props> = ({ apiKey, activeBlock, onApplyToBlock, report, collapsed }) => {
  if (collapsed) return null;
  const [prompt, setPrompt] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<BlockType | null>(activeBlock);
  const { messages, isLoading, error, sendMessage } = useGemini(apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSelectedBlock(activeBlock); }, [activeBlock]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const context = getBlockContext(selectedBlock, report);
    await sendMessage(prompt, selectedBlock ?? undefined, context);
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
  };

  const handleApply = (msg: ChatMessage) => {
    if (!selectedBlock) return;
    onApplyToBlock(selectedBlock, msg.content);
  };

  return (
    <aside className="chat-panel">
      <div className="chat-panel__header">
        <h2 className="chat-panel__title">🤖 AI Асистент</h2>
        <p className="chat-panel__subtitle">Gemini 1.5 Flash</p>
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
            <p>👋 Привіт! Я допоможу написати звіт.</p>
            <p>Виберіть блок і введіть запит:</p>
            <ul>
              <li>«Напиши мету для лабораторної з ООП»</li>
              <li>«Допоможи написати висновки»</li>
              <li>«Напиши хід роботи»</li>
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
              <button className="btn-apply" onClick={() => handleApply(msg)}>
                ↩ Вставити в «{BLOCK_LABELS[selectedBlock]}»
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message chat-message--assistant">
            <div className="chat-message__meta">🤖 Gemini</div>
            <div className="chat-loading"><span /><span /><span /></div>
          </div>
        )}
        {error && <div className="chat-error">⚠️ {error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-panel__input">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введіть запит... (Ctrl+Enter)"
          rows={3}
        />
        <button className="btn-send" onClick={handleSend} disabled={isLoading || !prompt.trim()}>
          {isLoading ? '⏳' : '▶ Надіслати'}
        </button>
      </div>
    </aside>
  );
};
