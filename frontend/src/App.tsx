import { useState } from 'react';
import './App.css';
import CodeEditor from './components/Editor';
import FileTree from './components/FileTree';
import AIPanel from './components/AIPanel';
import SnippetPanel from './components/SnippetPanel';
import Settings from './components/Settings';
import DebugPanel from './components/DebugPanel';
import { getFileContent, getFileLanguage, saveFileContent } from './services/fileService';
import { loadThemePreference } from './services/themeService';
import { EditorConfig, loadEditorConfig } from './services/editorConfigService';

function App() {
  const [code, setCode] = useState('// 在这里开始编写代码\n');
  const [currentFile, setCurrentFile] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState(loadThemePreference());
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(loadEditorConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      // 如果有当前文件，则保存内容
      if (currentFile) {
        saveFileContent(currentFile, value);
      }
    }
  };
  
  const handleApplySuggestion = (suggestion: string) => {
    setCode(suggestion);
    if (currentFile) {
      saveFileContent(currentFile, suggestion);
    }
  };

  const handleFileSelect = (filePath: string) => {
    const content = getFileContent(filePath);
    const fileLanguage = getFileLanguage(filePath);
    
    setCode(content);
    setCurrentFile(filePath);
    setLanguage(fileLanguage);
    console.log('Loaded file:', filePath, 'with language:', fileLanguage);
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
  };

  const handleConfigChange = (config: EditorConfig) => {
    setEditorConfig(config);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI 代码编辑器</h1>
        <button 
          className="settings-button" 
          onClick={toggleSettings}
          title="打开设置"
        >
          ⚙️
        </button>
      </header>
      <main className="app-main">
        <FileTree onFileSelect={handleFileSelect} />
        <div className="editor-section">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language={language}
            theme={theme}
            options={{
              fontSize: editorConfig.fontSize,
              tabSize: editorConfig.tabSize,
              wordWrap: editorConfig.wordWrap,
              minimap: { enabled: editorConfig.minimap },
              lineNumbers: editorConfig.lineNumbers,
              fontFamily: editorConfig.fontFamily,
              autoIndent: editorConfig.autoIndent ? 'advanced' : 'none',
            }}
          />
          {currentFile && (
            <div className="current-file-info">
              当前文件: {currentFile}
            </div>
          )}
        </div>
        <div className="panels-container">
          <DebugPanel 
            code={code}
            language={language}
          />
          <AIPanel 
            code={code}
            language={language}
            onSuggestionApply={handleApplySuggestion}
          />
          <SnippetPanel 
            language={language}
            onSnippetSelect={handleApplySuggestion}
          />
        </div>
      </main>
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={handleThemeChange}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
}

export default App;
