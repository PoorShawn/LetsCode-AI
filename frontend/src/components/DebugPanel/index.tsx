import { useState } from 'react';
import { executeCode, CodeExecutionResult } from '../../api/codeExecutionService';
import Terminal from '../Terminal';

interface DebugPanelProps {
  code: string;
  language: string;
  onBreakpointSet?: (line: number) => void;
  onBreakpointRemove?: (line: number) => void;
}

const DebugPanel = ({ code, language }: DebugPanelProps) => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [executionTime, setExecutionTime] = useState<number | undefined>(undefined);
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  // 清除输出
  const handleClearOutput = () => {
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
  };

  // 运行代码
  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('代码为空，无法执行');
      return;
    }
    
    setIsRunning(true);
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
    
    try {
      const result: CodeExecutionResult = await executeCode({
        code,
        language
      });
      
      setOutput(result.output || '代码执行完成，无输出');
      setError(result.error);
      setExecutionTime(result.executionTime);
    } catch (err) {
      setError(`执行错误: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  // 切换调试模式
  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
  };

  // 格式化输出内容
  const formatOutput = () => {
    let formattedOutput = output;
    
    if (error) {
      formattedOutput += `\n\n${error}`;
    }
    
    if (executionTime !== undefined) {
      formattedOutput += `\n\n执行耗时: ${executionTime}ms`;
    }
    
    return formattedOutput;
  };

  return (
    <div className="flex flex-col bg-[#1e1e1e] text-gray-100 rounded overflow-hidden w-full border border-[#333333] mb-2.5">
      <div className="flex justify-between items-center px-3 py-2 bg-[#2d2d2d] border-b border-[#444444]">
        <h3 className="m-0 text-sm font-medium">代码执行</h3>
        <div className="flex gap-2">
          <button 
            className={`bg-transparent text-gray-300 border border-[#555555] rounded px-3 py-1 text-xs cursor-pointer transition-all hover:bg-[#444444] ${
              isDebugMode ? 'bg-[#6a329f] border-[#6a329f] text-white' : ''
            }`}
            onClick={toggleDebugMode}
            title={isDebugMode ? '关闭调试模式' : '开启调试模式'}
          >
            {isDebugMode ? '调试模式' : '运行模式'}
          </button>
          <button 
            className="bg-[#0e639c] text-white border-none rounded px-3 py-1 text-xs cursor-pointer transition-all hover:bg-[#1177bb] disabled:bg-[#555555] disabled:cursor-not-allowed"
            onClick={handleRunCode}
            disabled={isRunning}
            title="运行代码"
          >
            {isRunning ? '执行中...' : '运行'}
          </button>
        </div>
      </div>
      
      {isDebugMode && (
        <div className="flex gap-1.5 p-2 bg-[#252525] border-b border-[#444444] overflow-x-auto">
          <button 
            className="bg-[#333333] text-gray-300 border border-[#555555] rounded px-2 py-1 text-xs cursor-pointer transition-all hover:bg-[#444444] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            title="设置断点" 
            disabled={true}
          >
            断点
          </button>
          <button className="debug-button" title="单步执行" disabled={true}>单步</button>
          <button className="debug-button" title="步入函数" disabled={true}>步入</button>
          <button className="debug-button" title="步出函数" disabled={true}>步出</button>
          <button className="debug-button" title="继续执行" disabled={true}>继续</button>
          <button className="debug-button" title="停止调试" disabled={true}>停止</button>
        </div>
      )}
      
      <Terminal
        output={formatOutput()}
        isRunning={isRunning}
        onClear={handleClearOutput}
        height="200px"
      />
    </div>
  );
};

export default DebugPanel;