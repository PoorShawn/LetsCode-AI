import { useState } from 'react';
import './styles.css';
import { getAICodeSuggestions } from '../../services/aiService';

interface AIPanelProps {
  code?: string;
  language?: string;
  onSuggestionApply?: (suggestion: string) => void;
}

const AIPanel = ({ code, language = 'javascript', onSuggestionApply }: AIPanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用AI服务生成代码建议
  const generateSuggestions = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 调用AI服务获取代码建议
      const response = await getAICodeSuggestions({
        prompt: prompt,
        code: code,
        language: language
      });
      
      if (response.error) {
        console.error('获取AI建议失败:', response.error);
        setError(`获取建议失败: ${response.error}`);
      } else {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error('AI服务调用异常:', error);
      setError('AI服务暂时不可用，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && prompt.trim()) {
      generateSuggestions();
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>AI 代码助手</h3>
      </div>
      
      <div className="ai-panel-content">
        <div className="ai-input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题或需求..."
            className="ai-input"
          />
          <button 
            onClick={generateSuggestions}
            disabled={isLoading || !prompt.trim()}
            className="ai-button"
          >
            {isLoading ? '生成中...' : '生成建议'}
          </button>
        </div>
        
        {error && (
          <div className="ai-error-message">
            {error}
          </div>
        )}
        
        <div className="ai-suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div key={index} className="ai-suggestion-item">
                <pre className="ai-suggestion-code">{suggestion}</pre>
                <button 
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="ai-apply-button"
                >
                  应用此建议
                </button>
              </div>
            ))
          ) : (
            <div className={`ai-empty-state ${isLoading ? 'loading' : ''}`}>
              {isLoading ? 
                '正在生成建议...' : 
                '在上方输入你的问题，AI将为你生成代码建议'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;