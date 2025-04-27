import { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

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
    <div className="w-full h-full relative overflow-hidden">
      {loadError ? (
        <div className="w-full h-full flex flex-col justify-center items-center bg-[#1e1e1e] text-[#ff6b6b] p-5 text-center">
          <p>{loadError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#4d4d4d] text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-[#5a5a5a]"
          >
            刷新页面
          </button>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="w-full h-full flex justify-center items-center bg-[#1e1e1e] text-gray-300 text-base">
              加载编辑器中...
            </div>
          )}
          <Editor
            height={height}
            defaultLanguage={language}
            language={language}
            value={value}
            onChange={onChange}
            onMount={handleEditorDidMount}
            beforeMount={handleEditorWillMount}
            onValidate={handleEditorValidation}
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