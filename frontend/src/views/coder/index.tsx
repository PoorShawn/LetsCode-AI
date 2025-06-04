import { useState, useRef } from 'react';
import { Splitter } from 'antd';
import { EditorConfig, loadEditorConfig } from '../../api/editorConfigService';
import { saveFileContent, getFileContent, getFileLanguage } from '../../api/fileService';
import { loadThemePreference } from '../../api/themeService';
import AIPanel from './components/AIPanel';
import DebugPanel from './components/DebugPanel';
import CodeEditor from './components/Editor';
import FileTree from './components/FileTree';
import Settings from './components/Settings';
import type { editor } from 'monaco-editor';

function Coder() {
  const [code, setCode] = useState('// 在这里开始编写代码\n');
  const [currentFile, setCurrentFile] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState(loadThemePreference());
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(loadEditorConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const selection = editor.getSelection();
    
    if (selection) {
      // 如果有选中的文本，替换选中的部分
      const { startLineNumber, startColumn, endLineNumber, endColumn } = selection;
      editor.executeEdits('ai-suggestion', [{
        range: {
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn
        },
        text: suggestion,
        forceMoveMarkers: true
      }]);
    } else {
      // 如果没有选中文本，在当前光标位置插入
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits('ai-suggestion', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: suggestion,
          forceMoveMarkers: true
        }]);
      }
    }

    // 更新代码状态
    setCode(editor.getValue());
    // 如果有当前文件，保存更新
    if (currentFile) {
      saveFileContent(currentFile, editor.getValue());
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

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#1a1a1a] text-gray-100 font-sans">
      <header className="h-[60px] flex items-center px-5 bg-[#252525] border-b border-[#3d3d3d] justify-between shadow-md">
        <span className="text-white text-lg font-medium flex items-center before:content-['🤖'] before:mr-2.5 before:text-3xl">
          AI 代码编辑器
        </span>
        <button 
          className="bg-transparent border-none text-gray-300 text-xl cursor-pointer p-2 rounded flex items-center justify-center transition-all duration-200 hover:bg-[#3d3d3d] hover:text-white hover:rotate-[30deg]"
          onClick={toggleSettings}
          title="打开设置"
        >
          ⚙️
        </button>
      </header>
      <main className="flex-1 flex h-full w-full overflow-hidden">
        <Splitter>
        <Splitter.Panel>
        <FileTree onFileSelect={handleFileSelect} />
        </Splitter.Panel>
        <Splitter.Panel>
        <div className="h-full flex-1 flex flex-col relative transition-all duration-300">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language={language}
            theme={theme}
            onMount={handleEditorDidMount}
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
            <div className="h-[30px] bg-[#252525] text-gray-300 px-2.5 flex items-center text-xs border-t border-[#3d3d3d]">
              当前文件: {currentFile}
            </div>
          )}
        </div>
        </Splitter.Panel>
        <Splitter.Panel>
        <div className="flex flex-col h-full w-full overflow-hidden border-l border-[#3d3d3d] shadow-lg md:border-l-0 md:border-t">
          <DebugPanel 
            code={code}
            language={language}
          />
          <AIPanel 
            code={code}
            language={language}
            onSuggestionApply={handleApplySuggestion}
            editor={editorRef.current}
          />
        </div>
        </Splitter.Panel>
        </Splitter>
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

export default Coder;
