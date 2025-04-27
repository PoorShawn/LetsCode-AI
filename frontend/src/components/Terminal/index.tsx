import { useRef, useEffect } from 'react';

interface TerminalProps {
  output?: string;
  isRunning?: boolean;
  onClear?: () => void;
  height?: string;
}

const Terminal = ({ output = '', isRunning = false, onClear, height = '200px' }: TerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col bg-[#1e1e1e] border border-[#3d3d3d] rounded" style={{ height }}>
      <div className="flex justify-between items-center px-4 h-[40px] border-b border-[#3d3d3d]">
        <h3 className="text-sm font-normal text-white m-0">终端</h3>
        <button 
          className="px-2 py-1 text-xs bg-transparent text-gray-400 border border-transparent rounded hover:bg-[#2a2d2e] hover:text-white"
          onClick={onClear}
          title="清除终端"
        >
          清除
        </button>
      </div>
      <div 
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300"
        ref={terminalRef}
      >
        {output ? (
          <pre className="m-0 whitespace-pre-wrap">{output}</pre>
        ) : (
          <div className="text-gray-500 italic">
            {isRunning ? '正在执行...' : '运行代码后输出将显示在这里'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;