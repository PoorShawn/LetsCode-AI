import { useState, useEffect } from 'react';
import './styles.css';
import { CodeSnippet, getAllSnippets, getSnippetsByLanguage } from '../../services/snippetService';

interface SnippetPanelProps {
  language?: string;
  onSnippetSelect?: (code: string) => void;
}

const SnippetPanel = ({ language = 'javascript', onSnippetSelect }: SnippetPanelProps) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 加载代码片段
  useEffect(() => {
    if (selectedCategory === 'all') {
      if (language === 'all') {
        setSnippets(getAllSnippets());
      } else {
        setSnippets(getSnippetsByLanguage(language));
      }
    } else {
      // 按标签筛选
      const filtered = getAllSnippets().filter(snippet => 
        (language === 'all' || snippet.language === language) && 
        (snippet.tags?.includes(selectedCategory) || false)
      );
      setSnippets(filtered);
    }
  }, [language, selectedCategory]);

  // 搜索过滤
  const filteredSnippets = snippets.filter(snippet => 
    searchTerm === '' || 
    snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取所有唯一的标签
  const allTags = Array.from(new Set(
    snippets.flatMap(snippet => snippet.tags || [])
  ));

  // 处理代码片段选择
  const handleSnippetSelect = (snippet: CodeSnippet) => {
    if (onSnippetSelect) {
      onSnippetSelect(snippet.code);
    }
  };

  return (
    <div className="snippet-panel">
      <div className="snippet-panel-header">
        <h3>代码片段</h3>
      </div>
      
      <div className="snippet-panel-content">
        <div className="snippet-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索代码片段..."
            className="snippet-search-input"
          />
        </div>
        
        <div className="snippet-categories">
          <button 
            className={`snippet-category-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`snippet-category-button ${selectedCategory === tag ? 'active' : ''}`}
              onClick={() => setSelectedCategory(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="snippet-list">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map(snippet => (
              <div key={snippet.id} className="snippet-item">
                <div className="snippet-item-header">
                  <h4>{snippet.name}</h4>
                  <span className="snippet-language">{snippet.language}</span>
                </div>
                <p className="snippet-description">{snippet.description}</p>
                <div className="snippet-actions">
                  <button 
                    className="snippet-insert-button"
                    onClick={() => handleSnippetSelect(snippet)}
                  >
                    插入代码
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="snippet-empty-state">
              没有找到匹配的代码片段
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetPanel;