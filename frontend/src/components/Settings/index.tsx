import { useState, useEffect } from 'react';
import { themes, loadThemePreference, saveThemePreference } from '../../services/themeService';
import { EditorConfig, loadEditorConfig, updateEditorConfigItem } from '../../services/editorConfigService';
import './styles.css';

interface SettingsProps {
  onThemeChange: (themeId: string) => void;
  onConfigChange: (config: EditorConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Settings = ({ onThemeChange, onConfigChange, isOpen, onClose }: SettingsProps) => {
  const [currentTheme, setCurrentTheme] = useState<string>(loadThemePreference());
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(loadEditorConfig());

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
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h3>编辑器设置</h3>
          <button className="settings-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h4>主题</h4>
            <div className="settings-item">
              <label htmlFor="theme-select">选择主题：</label>
              <select
                id="theme-select"
                value={currentTheme}
                onChange={handleThemeChange}
                className="settings-select"
              >
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h4>编辑器</h4>
            <div className="settings-item">
              <label htmlFor="font-size">字体大小：</label>
              <input
                id="font-size"
                type="number"
                min="8"
                max="32"
                value={editorConfig.fontSize}
                onChange={(e) => handleConfigChange('fontSize', parseInt(e.target.value))}
                className="settings-input"
              />
            </div>

            <div className="settings-item">
              <label htmlFor="tab-size">缩进大小：</label>
              <input
                id="tab-size"
                type="number"
                min="1"
                max="8"
                value={editorConfig.tabSize}
                onChange={(e) => handleConfigChange('tabSize', parseInt(e.target.value))}
                className="settings-input"
              />
            </div>

            <div className="settings-item">
              <label htmlFor="word-wrap">自动换行：</label>
              <select
                id="word-wrap"
                value={editorConfig.wordWrap}
                onChange={(e) => handleConfigChange('wordWrap', e.target.value as 'on' | 'off')}
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
                onChange={(e) => handleConfigChange('minimap', e.target.checked)}
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
                    'lineNumbers',
                    e.target.value as 'on' | 'off' | 'relative'
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
                onChange={(e) => handleConfigChange('autoIndent', e.target.checked)}
                className="settings-checkbox"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;