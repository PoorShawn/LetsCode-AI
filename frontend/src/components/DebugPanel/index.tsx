import { useState } from 'react';
import './styles.css';
import { executeCode, CodeExecutionResult } from '../../services/codeExecutionService';
import Terminal from '../Terminal';

interface DebugPanelProps {
  code: string;
  language: string;
  onBreakpointSet?: (line: number) => void;
  onBreakpointRemove?: (line: number) => void;
}

const DebugPanel = ({ code, language }: DebugPanelProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
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
    <div className="debug-panel">
      <div className="debug-panel-header">
        <h3>代码执行</h3>
        <div className="debug-controls">
          <button 
            className={`debug-mode-toggle ${isDebugMode ? 'active' : ''}`}
            onClick={toggleDebugMode}
            title={isDebugMode ? '关闭调试模式' : '开启调试模式'}
          >
            {isDebugMode ? '调试模式' : '运行模式'}
          </button>
          <button 
            className="run-button" 
            onClick={handleRunCode}
            disabled={isRunning}
            title="运行代码"
          >
            {isRunning ? '执行中...' : '运行'}
          </button>
        </div>
      </div>
      
      {isDebugMode && (
        <div className="debug-toolbar">
          <button className="debug-button" title="设置断点" disabled={true}>断点</button>
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
      
      {isDebugMode && (
        <div className="variables-panel">
          <h4>变量</h4>
          <div className="variables-content">
            <p className="placeholder-text">调试时变量将显示在这里</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;