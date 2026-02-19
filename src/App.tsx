import { useState, useCallback, useRef } from 'react';
import type { BlockType, ReportData } from './types/report';
import { defaultReportData } from './utils/defaults';
import { exportToDocx } from './utils/docxExport';
import { ChatPanel } from './components/ChatPanel';
import { ReportEditor } from './components/ReportEditor';
import './App.css';

const STORAGE_KEY_API = 'gemini_api_key';
const STORAGE_KEY_REPORT = 'report_draft';

function loadApiKey(): string {
  return localStorage.getItem(STORAGE_KEY_API) ?? '';
}

function loadDraft(): ReportData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORT);
    return raw ? (JSON.parse(raw) as ReportData) : defaultReportData;
  } catch {
    return defaultReportData;
  }
}

function App() {
  const [apiKey, setApiKey] = useState<string>(loadApiKey);
  const [reportData, setReportData] = useState<ReportData>(loadDraft);
  const [activeBlock, setActiveBlock] = useState<BlockType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem(STORAGE_KEY_API, key);
  }, []);

  const handleReportChange = useCallback((data: ReportData) => {
    setReportData(data);
    localStorage.setItem(STORAGE_KEY_REPORT, JSON.stringify(data));
  }, []);

  const handleExport = useCallback(async () => {
    const name = `${reportData.titlePage.labNumber}_${reportData.titlePage.topic || 'звіт'}`.replace(/[^a-zA-Zа-яА-ЯіїєёІЇЄ0-9_\- ]/g, '').trim();
    await exportToDocx(reportData, name || 'звіт');
  }, [reportData]);

  const handleNew = useCallback(() => {
    if (window.confirm('Створити новий звіт? Незбережені зміни буде втрачено.')) {
      const fresh = { ...defaultReportData, titlePage: { ...defaultReportData.titlePage, year: new Date().getFullYear().toString() } };
      handleReportChange(fresh);
      setActiveBlock(null);
    }
  }, [handleReportChange]);

  const handleSave = useCallback(() => {
    const json = JSON.stringify(reportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.titlePage.labNumber || 'звіт'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reportData]);

  const handleLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileLoad = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ReportData;
        handleReportChange(data);
      } catch {
        alert('Помилка читання файлу. Перевірте формат JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [handleReportChange]);

  const handleApplyToBlock = useCallback((block: BlockType, text: string) => {
    const updated = { ...reportData };
    switch (block) {
      case 'abstract':
        updated.abstract = { ...updated.abstract, purpose: text };
        break;
      case 'workProgress':
        if (updated.workProgress.steps.length > 0) {
          const steps = [...updated.workProgress.steps];
          steps[0] = { ...steps[0], content: text };
          updated.workProgress = { steps };
        }
        break;
      case 'conclusion':
        updated.conclusion = { content: text };
        break;
      case 'references':
        updated.references = { items: text.split('\n').filter(Boolean) };
        break;
      case 'titlePage':
        updated.titlePage = { ...updated.titlePage, topic: text };
        break;
    }
    handleReportChange(updated);
  }, [reportData, handleReportChange]);

  return (
    <div className="app">
      <ChatPanel
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        activeBlock={activeBlock}
        onApplyToBlock={handleApplyToBlock}
        reportData={reportData}
      />
      <ReportEditor
        data={reportData}
        onChange={handleReportChange}
        activeBlock={activeBlock}
        onActivateBlock={setActiveBlock}
        onExport={handleExport}
        onNew={handleNew}
        onSave={handleSave}
        onLoad={handleLoad}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileLoad}
      />
    </div>
  );
}

export default App;
