import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';

interface AIPanelProps {
  code?: string;
  language?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

const AIPanel = ({ code, language = 'javascript', onSuggestionApply }: AIPanelProps) => {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 配置 marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // 添加用户消息
    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputValue('');

    try {
      // 发送到后端
      const response = await fetch('http://localhost:5006/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });
      
      const data = await response.json();
      
      // 添加机器人回复
      setMessages(prev => [...prev, { type: 'bot', content: data.message }]);
      
      // 更新建议
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: '抱歉，服务器出现错误，请稍后重试。' 
      }]);
    }
  };

  useEffect(() => {
    // 滚动到底部
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col w-full h-full bg-[#1e1e1e] border-t border-[#3d3d3d]">
      <div className="fixed w-full flex items-center px-4 py-3 bg-gradient-to-r from-[#252525] to-[#2d2d2d] border-b border-[#3d3d3d]">
        <h3 className="m-0 text-base text-white font-medium flex items-center before:content-['🤖'] before:mr-2 before:text-lg">
          AI 代码助手
        </h3>
      </div>

      <div className="flex-1 flex flex-col pb-16 p-4 pt-16 gap-2.5 bg-[#1e1e1e] text-[#d4d4d4]">
        <div 
          className="flex-1 flex flex-col overflow-y-auto p-4 border border-[#3d3d3d] rounded-lg bg-[#252525] scrollbar-custom"
          ref={chatHistoryRef}
        >
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg mb-3 text-sm leading-relaxed ${
                msg.type === 'user' 
                  ? 'bg-[#2b3a55] text-white ml-5 border border-[#3d4d6b]' 
                  : 'bg-[#252525] text-[#d4d4d4] mr-5 border border-[#3d3d3d]'
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.type === 'user' ? msg.content : marked(msg.content)
              }}
            />
          ))}
        </div>
        
        <div className="fixed w-full bottom-0 flex gap-2.5 p-2.5 bg-[#252525] rounded-lg">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="在这里输入你的问题..."
            className="flex-1 px-3 py-2 bg-[#1e1e1e] border border-[#3d3d3d] rounded-md text-[#d4d4d4] text-sm outline-none transition-colors focus:border-[#0078d4]"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            className="px-5 py-2 bg-gradient-to-b from-[#0078d4] to-[#0063b1] text-white rounded-md font-medium transition-all hover:from-[#0086ef] hover:to-[#0071d1] hover:-translate-y-0.5"
          >
            发送
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2.5">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full mt-2 p-3 bg-[#252525] text-[#d4d4d4] border border-[#3d3d3d] rounded-md text-sm text-left cursor-pointer transition-all hover:bg-[#2b2b2b] hover:border-[#0078d4]"
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Markdown 样式 */}
      <style jsx global>{`
        .bot-message p { @apply mb-2.5 last:mb-0; }
        .bot-message a { @apply text-[#0078d4] no-underline hover:underline; }
        .bot-message ul, .bot-message ol { @apply my-2.5 pl-5; }
        .bot-message li { @apply my-1.5; }
        pre { @apply p-3 bg-[#1a1a1a] rounded-md overflow-x-auto my-2.5 border border-[#3d3d3d]; }
        code { @apply font-mono text-sm leading-relaxed; }
      `}</style>
    </div>
  );
};

export default AIPanel;