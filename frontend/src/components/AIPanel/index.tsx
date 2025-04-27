import { useState, useEffect, useRef } from 'react';
import './styles.css';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

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
      const response = await fetch('http://localhost:5003/api/chat', {
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
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>AI 代码助手</h3>
      </div>

      <div className="chat-container">
        <div className="chat-history" ref={chatHistoryRef}>
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
              dangerouslySetInnerHTML={{
                __html: msg.type === 'user' ? msg.content : marked(msg.content)
              }}
            />
          ))}
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="在这里输入你的问题..."
          />
          <button onClick={() => sendMessage(inputValue)}>发送</button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;