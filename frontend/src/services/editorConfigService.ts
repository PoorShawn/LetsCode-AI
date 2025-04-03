// 编辑器配置服务模块，用于管理编辑器的配置选项

// 定义编辑器配置类型
export interface EditorConfig {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  fontFamily: string;
  autoIndent: boolean;
}

// 默认编辑器配置
export const defaultEditorConfig: EditorConfig = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'off',
  minimap: true,
  lineNumbers: 'on',
  fontFamily: 'Consolas, "Courier New", monospace',
  autoIndent: true
};

// 保存编辑器配置到本地存储
export const saveEditorConfig = (config: EditorConfig): void => {
  try {
    localStorage.setItem('editor-config', JSON.stringify(config));
  } catch (error) {
    console.error('保存编辑器配置失败:', error);
  }
};

// 从本地存储加载编辑器配置
export const loadEditorConfig = (): EditorConfig => {
  try {
    const savedConfig = localStorage.getItem('editor-config');
    if (savedConfig) {
      return { ...defaultEditorConfig, ...JSON.parse(savedConfig) };
    }
  } catch (error) {
    console.error('加载编辑器配置失败:', error);
  }
  return defaultEditorConfig;
};

// 更新单个配置项
export const updateEditorConfigItem = <K extends keyof EditorConfig>(
  key: K, 
  value: EditorConfig[K]
): EditorConfig => {
  const currentConfig = loadEditorConfig();
  const newConfig = { ...currentConfig, [key]: value };
  saveEditorConfig(newConfig);
  return newConfig;
};