import { useState, useRef, useEffect } from 'react';
import './styles.css';

interface TerminalProps {
  output?: string;
  isRunning?: boolean;
  onClear?: () => void;
  height?: string;
}

const Terminal = ({ output = '', isRunning = false, onClear, height = '200px' }: TerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [] = useState<string[]>([]);
  
  // 自动滚动到底部
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // 清除终端内容
  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="terminal-container" style={{ height }}>
      <div className="terminal-header">
        <h3>终端</h3>
        <div className="terminal-controls">
          <button 
            className="terminal-clear-button" 
            onClick={handleClear}
            title="清除终端"
          >
            清除
          </button>
        </div>
      </div>
      <div className="terminal-content" ref={terminalRef}>
        {output ? (
          <pre className="terminal-output">{output}</pre>
        ) : (
          <div className="terminal-placeholder">
            {isRunning ? '正在执行...' : '运行代码后输出将显示在这里'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;