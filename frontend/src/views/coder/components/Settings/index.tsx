import { useState, useEffect } from "react";
import {
  themes,
  loadThemePreference,
  saveThemePreference,
} from "../../../../api/themeService";
import {
  EditorConfig,
  loadEditorConfig,
  updateEditorConfigItem,
} from "../../../../api/editorConfigService";

interface SettingsProps {
  onThemeChange: (themeId: string) => void;
  onConfigChange: (config: EditorConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings = ({
  onThemeChange,
  onConfigChange,
  isOpen,
  onClose,
}: SettingsProps) => {
  const [currentTheme, setCurrentTheme] = useState<string>(
    loadThemePreference()
  );
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(
    loadEditorConfig()
  );

  useEffect(() => {
    // 当设置面板打开时，加载最新的配置
    if (isOpen) {
      setCurrentTheme(loadThemePreference());
      setEditorConfig(loadEditorConfig());
    }
  }, [isOpen]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newThemeId = e.target.value;
    setCurrentTheme(newThemeId);
    saveThemePreference(newThemeId);
    onThemeChange(newThemeId);
  };

  const handleConfigChange = <K extends keyof EditorConfig>(
    key: K,
    value: EditorConfig[K]
  ) => {
    const newConfig = updateEditorConfigItem(key, value);
    setEditorConfig(newConfig);
    onConfigChange(newConfig);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#252526] text-white rounded-lg shadow-xl w-[500px] max-w-[90vw]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#3d3d3d]">
          <h3 className="text-lg font-medium">编辑器设置</h3>
          <button
            className="text-2xl text-gray-400 hover:text-white bg-transparent border-none cursor-pointer"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-4">主题</h4>
              <div className="space-y-2">
                <label
                  htmlFor="theme-select"
                  className="block text-sm text-gray-300"
                >
                  选择主题：
                </label>
                <select
                  id="theme-select"
                  value={currentTheme}
                  onChange={handleThemeChange}
                  className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#3d3d3d] rounded text-white focus:outline-none focus:border-[#0e639c]"
                >
                  {themes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">编辑器</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="font-size" className="text-sm text-gray-300">
                    字体大小：
                  </label>
                  <input
                    id="font-size"
                    type="number"
                    min="8"
                    max="32"
                    value={editorConfig.fontSize}
                    onChange={(e) =>
                      handleConfigChange("fontSize", parseInt(e.target.value))
                    }
                    className="w-20 px-2 py-1 bg-[#3c3c3c] border border-[#3d3d3d] rounded text-white focus:outline-none focus:border-[#0e639c]"
                  />
                </div>

                {/* 其他设置项使用相同的样式模式 */}
                <div className="settings-item">
                  <label htmlFor="tab-size">缩进大小：</label>
                  <input
                    id="tab-size"
                    type="number"
                    min="1"
                    max="8"
                    value={editorConfig.tabSize}
                    onChange={(e) =>
                      handleConfigChange("tabSize", parseInt(e.target.value))
                    }
                    className="settings-input"
                  />
                </div>

                <div className="settings-item">
                  <label htmlFor="word-wrap">自动换行：</label>
                  <select
                    id="word-wrap"
                    value={editorConfig.wordWrap}
                    onChange={(e) =>
                      handleConfigChange(
                        "wordWrap",
                        e.target.value as "on" | "off"
                      )
                    }
                    className="settings-select"
                  >
                    <option value="off">关闭</option>
                    <option value="on">开启</option>
                  </select>
                </div>

                <div className="settings-item">
                  <label htmlFor="minimap">显示小地图：</label>
                  <input
                    id="minimap"
                    type="checkbox"
                    checked={editorConfig.minimap}
                    onChange={(e) =>
                      handleConfigChange("minimap", e.target.checked)
                    }
                    className="settings-checkbox"
                  />
                </div>

                <div className="settings-item">
                  <label htmlFor="line-numbers">行号显示：</label>
                  <select
                    id="line-numbers"
                    value={editorConfig.lineNumbers}
                    onChange={(e) =>
                      handleConfigChange(
                        "lineNumbers",
                        e.target.value as "on" | "off" | "relative"
                      )
                    }
                    className="settings-select"
                  >
                    <option value="on">显示</option>
                    <option value="off">隐藏</option>
                    <option value="relative">相对行号</option>
                  </select>
                </div>

                <div className="settings-item">
                  <label htmlFor="auto-indent">自动缩进：</label>
                  <input
                    id="auto-indent"
                    type="checkbox"
                    checked={editorConfig.autoIndent}
                    onChange={(e) =>
                      handleConfigChange("autoIndent", e.target.checked)
                    }
                    className="settings-checkbox"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
