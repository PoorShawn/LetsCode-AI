import { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './styles.css';

interface CodeEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  height?: string;
  theme?: string;
  options?: any;
}

const CodeEditor = ({
  value,
  language = 'javascript',
  onChange,
  height = '100%',
  theme = 'vs-dark',
  options = {}
}: CodeEditorProps) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 添加useEffect来监控加载状态
  useEffect(() => {
    console.log('Editor component mounted');
    // 设置一个超时检查，如果编辑器长时间未加载完成，则显示错误
    const timeoutId = setTimeout(() => {
      if (!isEditorReady && isLoading) {
        console.error('Editor loading timeout');
        setLoadError('编辑器加载超时，请检查网络连接或刷新页面');
        setIsLoading(false);
      }
    }, 10000); // 10秒超时

    return () => clearTimeout(timeoutId);
  }, [isEditorReady, isLoading]);

  const handleEditorDidMount = (editor: any) => {
    console.log('Editor mounted successfully', editor);
    editorRef.current = editor;
    setIsEditorReady(true);
    setIsLoading(false);
  };

  const handleEditorWillMount = (monaco: any) => {
    console.log('Monaco instance will mount', monaco);
    // 可以在这里进行Monaco实例的预配置
    return monaco;
  };

  const handleEditorValidation = (markers: any) => {
    // 处理编辑器验证信息
    if (markers.length > 0) {
      console.log('Editor validation markers:', markers);
    }
  };


  return (
    <div className="code-editor-container">
      {loadError ? (
        <div className="editor-error-message">
          <p>{loadError}</p>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      ) : (
        <>
          {isLoading && <div className="editor-loading">加载编辑器中...</div>}
          <Editor
            height={height}
            defaultLanguage={language}
            language={language}
            value={value}
            onChange={onChange}
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            onValidate={handleEditorValidation}
            // Removed onError as it is not a valid prop for the Editor component
            theme={theme}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              ...options
            }}
          />
        </>
      )}
    </div>
  );
};

export default CodeEditor;