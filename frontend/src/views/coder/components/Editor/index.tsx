import { useRef, useState, useEffect, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import debounce from 'lodash/debounce';

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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [codeSuggestion, setCodeSuggestion] = useState<string | null>(null);
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 3;  // 最大重试次数

  // 实际发送请求的函数
  const fetchSuggestion = async (retry = 0) => {
    if (!editorRef.current || isFetchingSuggestion) return;

    try {
      setIsFetchingSuggestion(true);
      setErrorMessage(null);

      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      const currentCode = editorRef.current.getValue();
      const response = await fetch('http://localhost:5004/api/knit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentCode }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }

      const data = await response.json();
      if (!data.message) {
        throw new Error('返回数据格式错误');
      }

      setCodeSuggestion(data.message);
      setRetryCount(0);  // 重置重试计数
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('代码提示请求已取消');
        return;
      }

      console.error('获取代码提示时出错:', error);
      setErrorMessage(error.message || '获取代码提示失败');

      // 如果还没达到最大重试次数，则进行重试
      if (retry < maxRetries) {
        const nextRetry = retry + 1;
        setRetryCount(nextRetry);
        
        // 使用指数退避策略，延迟时间随重试次数增加
        const delay = Math.min(1000 * Math.pow(2, retry), 10000);
        console.log(`将在 ${delay/1000} 秒后进行第 ${nextRetry} 次重试`);
        
        setTimeout(() => {
          fetchSuggestion(nextRetry);
        }, delay);
      }
    } finally {
      // 如果不是重试过程中，就重置状态
      if (retry === 0 || retry === maxRetries) {
        setIsFetchingSuggestion(false);
      }
    }
  };

  // 使用防抖包装请求函数
  const debouncedFetchSuggestion = useCallback(
    debounce((retry = 0) => {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // 发起新请求
      fetchSuggestion(retry);
    }, 1000),
    []
  );

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // 重置错误状态
    setErrorMessage(null);
    setRetryCount(0);

    // 设置新的定时器
    idleTimerRef.current = setTimeout(() => {
      debouncedFetchSuggestion(0);
    }, 3000);
  }, [debouncedFetchSuggestion]);

  const cleanup = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    debouncedFetchSuggestion.cancel();
  }, [debouncedFetchSuggestion]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    console.log('Editor mounted successfully', editor);
    editorRef.current = editor;
    setIsEditorReady(true);
    setIsLoading(false);

    editor.onDidChangeModelContent(() => {
      resetIdleTimer();
    });
  };

  const handleEditorWillMount = (monaco: any) => {
    console.log('Monaco instance will mount', monaco);
    return monaco;
  };

  const handleEditorValidation = (markers: any) => {
    if (markers.length > 0) {
      console.log('Editor validation markers:', markers);
    }
  };

  const acceptSuggestion = async () => {
    if (!codeSuggestion || !editorRef.current) return;

    const editor = editorRef.current;
    const selection = editor.getSelection();
    
    if (selection) {
      editor.executeEdits('suggestion', [{
        range: selection,
        text: codeSuggestion,
        forceMoveMarkers: true
      }]);
    } else {
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits('suggestion', [{
          range: {
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          },
          text: codeSuggestion,
          forceMoveMarkers: true
        }]);
      }
    }

    if (onChange) {
      onChange(editor.getValue());
    }

    await fetch('http://localhost:5003/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `请记录到数据库中：
          行为类别：coding
          code 内容：${editor.getValue()}
          tab 提示内容：${codeSuggestion}
          用户采纳行为：1
        ` })
    });

    setCodeSuggestion(null);
  };

  const rejectSuggestion = async () => {
    const editor = editorRef.current;

    await fetch('http://localhost:5003/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `请记录到数据库中：
          行为类别：coding
          code 内容：${editor?.getValue()}
          tab 提示内容：${codeSuggestion}
          用户采纳行为：0
        ` })
    });
    
    setCodeSuggestion(null);
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
          {(codeSuggestion || errorMessage) && (
            <div className="absolute bottom-4 left-4 bg-gray-800 text-white p-4 rounded shadow-lg max-w-lg">
              <div className="flex items-center justify-between mb-2">
                <p>代码提示:</p>
                {isFetchingSuggestion && (
                  <span className="text-xs text-gray-400">
                    {retryCount > 0 ? `正在重试 (${retryCount}/${maxRetries})...` : '正在更新...'}
                  </span>
                )}
              </div>
              {errorMessage ? (
                <div className="bg-red-900/50 p-3 rounded text-red-200 text-sm mb-2">
                  <p>{errorMessage}</p>
                  {retryCount > 0 && (
                    <p className="mt-1 text-xs">
                      正在自动重试，请稍候...
                    </p>
                  )}
                </div>
              ) : (
                <pre className="bg-gray-900 p-2 rounded">{codeSuggestion}</pre>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={acceptSuggestion}
                  className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isFetchingSuggestion || !codeSuggestion || !!errorMessage}
                >
                  接受
                </button>
                <button
                  onClick={rejectSuggestion}
                  className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isFetchingSuggestion || (!codeSuggestion && !errorMessage)}
                >
                  拒绝
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CodeEditor;