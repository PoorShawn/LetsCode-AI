import { useState, useEffect } from "react";
import {
  CodeSnippet,
  getAllSnippets,
  getSnippetsByLanguage,
} from "../../../../api/snippetService";

interface SnippetPanelProps {
  language?: string;
  onSnippetSelect?: (code: string) => void;
}

const SnippetPanel = ({
  language = "javascript",
  onSnippetSelect,
}: SnippetPanelProps) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 加载代码片段
  useEffect(() => {
    if (selectedCategory === "all") {
      if (language === "all") {
        setSnippets(getAllSnippets());
      } else {
        setSnippets(getSnippetsByLanguage(language));
      }
    } else {
      // 按标签筛选
      const filtered = getAllSnippets().filter(
        (snippet) =>
          (language === "all" || snippet.language === language) &&
          (snippet.tags?.includes(selectedCategory) || false)
      );
      setSnippets(filtered);
    }
  }, [language, selectedCategory]);

  // 搜索过滤
  const filteredSnippets = snippets.filter(
    (snippet) =>
      searchTerm === "" ||
      snippet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取所有唯一的标签
  const allTags = Array.from(
    new Set(snippets.flatMap((snippet) => snippet.tags || []))
  );

  // 处理代码片段选择
  const handleSnippetSelect = (snippet: CodeSnippet) => {
    if (onSnippetSelect) {
      onSnippetSelect(snippet.code);
    }
  };

  return (
    <div className="w-[640px] h-full bg-[#252526] border-l border-[#3d3d3d] flex flex-col overflow-hidden">
      <div className="px-4 py-2.5 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <h3 className="m-0 text-sm text-white">代码片段</h3>
      </div>

      <div className="flex-1 flex flex-col p-2.5 overflow-hidden">
        <div className="mb-2.5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索代码片段..."
            className="w-full px-2.5 py-2 bg-[#3c3c3c] border border-[#3d3d3d] text-white rounded outline-none transition-colors focus:border-[#007acc]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <button
            className={`px-2 py-1 text-xs rounded border-none cursor-pointer transition-colors ${
              selectedCategory === "all"
                ? "bg-[#0e639c] text-white"
                : "bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`px-2 py-1 text-xs rounded border-none cursor-pointer transition-colors ${
                selectedCategory === tag
                  ? "bg-[#0e639c] text-white"
                  : "bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
              }`}
              onClick={() => setSelectedCategory(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-1.5">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="bg-[#2d2d2d] border border-[#3d3d3d] rounded mb-2.5 p-2.5"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="m-0 text-sm text-white">{snippet.name}</h4>
                  <span className="text-xs text-gray-300 bg-[#3c3c3c] px-1.5 py-0.5 rounded">
                    {snippet.language}
                  </span>
                </div>
                <p className="text-xs text-gray-300 my-1.5">
                  {snippet.description}
                </p>
                <div className="flex justify-end">
                  <button
                    className="px-3 py-1.5 bg-[#0e639c] text-white rounded text-xs border-none cursor-pointer transition-colors hover:bg-[#1177bb]"
                    onClick={() => handleSnippetSelect(snippet)}
                  >
                    插入代码
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-300 text-center p-5 text-sm italic">
              没有找到匹配的代码片段
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetPanel;
