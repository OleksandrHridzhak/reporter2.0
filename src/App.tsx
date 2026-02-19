import { useState, useCallback } from 'react';
import type { BlockType, GlobalSettings, Space, LabReport } from './types/report';
import { defaultGlobalSettings } from './utils/defaults';
import { exportToDocx } from './utils/docxExport';
import { HomeScreen } from './components/HomeScreen';
import { GlobalSettingsModal } from './components/GlobalSettingsModal';
import { ChatPanel } from './components/ChatPanel';
import { ReportEditor } from './components/ReportEditor';
import './App.css';

// ─── LocalStorage keys ────────────────────────────────────────────────────────
const KEY_SETTINGS = 'reporter_settings';
const KEY_SPACES   = 'reporter_spaces';
const KEY_API      = 'gemini_api_key';

// ─── Persistence helpers ─────────────────────────────────────────────────────
function loadSettings(): GlobalSettings {
  try { return JSON.parse(localStorage.getItem(KEY_SETTINGS) ?? '') as GlobalSettings; }
  catch { return { ...defaultGlobalSettings }; }
}

function loadSpaces(): Space[] {
  try { return JSON.parse(localStorage.getItem(KEY_SPACES) ?? '[]') as Space[]; }
  catch { return []; }
}

function loadApiKey(): string {
  return localStorage.getItem(KEY_API) ?? '';
}

function saveSettings(s: GlobalSettings) { localStorage.setItem(KEY_SETTINGS, JSON.stringify(s)); }
function saveSpaces(s: Space[])          { localStorage.setItem(KEY_SPACES,   JSON.stringify(s)); }
function saveApiKey(k: string)           { localStorage.setItem(KEY_API,      k); }

// ─── App ─────────────────────────────────────────────────────────────────────
type View = 'home' | 'editor';

function App() {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(loadSettings);
  const [spaces, setSpaces]                 = useState<Space[]>(loadSpaces);
  const [apiKey, setApiKey]                 = useState<string>(loadApiKey);

  const [view, setView]                         = useState<View>('home');
  const [selectedSpaceId, setSelectedSpaceId]   = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeBlock, setActiveBlock]           = useState<BlockType | null>(null);
  const [showSettings, setShowSettings]         = useState(false);

  // ── Derived current space/report ──────────────────────────────────────────
  const currentSpace  = spaces.find(s => s.id === selectedSpaceId) ?? null;
  const currentReport = currentSpace?.reports.find(r => r.id === selectedReportId) ?? null;

  // ── Spaces mutators ───────────────────────────────────────────────────────
  const handleSpacesChange = useCallback((s: Space[]) => {
    setSpaces(s);
    saveSpaces(s);
  }, []);

  // ── Open a report ─────────────────────────────────────────────────────────
  const handleOpenReport = useCallback((spaceId: string, reportId: string) => {
    setSelectedSpaceId(spaceId);
    setSelectedReportId(reportId);
    setActiveBlock(null);
    setView('editor');
  }, []);

  // ── Report change (saves into spaces array) ───────────────────────────────
  const handleReportChange = useCallback((updated: LabReport) => {
    const newSpaces = spaces.map(s =>
      s.id === selectedSpaceId
        ? { ...s, reports: s.reports.map(r => r.id === updated.id ? updated : r) }
        : s
    );
    handleSpacesChange(newSpaces);
  }, [spaces, selectedSpaceId, handleSpacesChange]);

  // ── Global settings ───────────────────────────────────────────────────────
  const handleSaveSettings = useCallback((settings: GlobalSettings, key: string) => {
    setGlobalSettings(settings);
    saveSettings(settings);
    setApiKey(key);
    saveApiKey(key);
  }, []);

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = useCallback(async () => {
    if (!currentSpace || !currentReport) return;
    const name = `Лаб_${currentReport.labNumber}_${currentReport.topic || 'звіт'}`
      .replace(/[^a-zA-Zа-яА-ЯіїєёІЇЄ0-9_\- ]/g, '').trim();
    await exportToDocx(globalSettings, currentSpace, currentReport, name || 'звіт');
  }, [globalSettings, currentSpace, currentReport]);

  // ── Save as JSON ──────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!currentReport) return;
    const json = JSON.stringify(currentReport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Лаб_${currentReport.labNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [currentReport]);

  // ── Apply AI text to a block ──────────────────────────────────────────────
  const handleApplyToBlock = useCallback((block: BlockType, text: string) => {
    if (!currentReport) return;
    const r = { ...currentReport };
    switch (block) {
      case 'abstract':
        r.abstract = { content: text };
        break;
      case 'workProgress': {
        const lines = text.split('\n').filter(Boolean);
        r.workProgress = {
          items: lines.map((line, i) => ({
            id: (Date.now() + i).toString(),
            text: line.replace(/^\d+\.\s*/, ''), // remove leading "1. " if present
          })),
        };
        break;
      }
      case 'conclusion':
        r.conclusion = { content: text };
        break;
      case 'appendix':
        r.appendix = { ...r.appendix, code: text };
        break;
      case 'references':
        r.references = { items: text.split('\n').filter(Boolean) };
        break;
      default:
        break;
    }
    handleReportChange(r);
  }, [currentReport, handleReportChange]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (view === 'editor' && currentSpace && currentReport) {
    return (
      <div className="app">
        <ChatPanel
          apiKey={apiKey}
          activeBlock={activeBlock}
          onApplyToBlock={handleApplyToBlock}
          report={currentReport}
        />
        <ReportEditor
          global={globalSettings}
          space={currentSpace}
          report={currentReport}
          onReportChange={handleReportChange}
          activeBlock={activeBlock}
          onActivateBlock={setActiveBlock}
          onExport={handleExport}
          onBack={() => setView('home')}
          onSave={handleSave}
        />
        {showSettings && (
          <GlobalSettingsModal
            settings={globalSettings}
            apiKey={apiKey}
            onSave={handleSaveSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app app--home">
      <HomeScreen
        spaces={spaces}
        globalSettings={globalSettings}
        onOpenReport={handleOpenReport}
        onSpacesChange={handleSpacesChange}
        onOpenSettings={() => setShowSettings(true)}
      />
      {showSettings && (
        <GlobalSettingsModal
          settings={globalSettings}
          apiKey={apiKey}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
