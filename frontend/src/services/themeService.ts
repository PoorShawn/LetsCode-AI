// 主题服务模块，用于管理编辑器主题

// 定义主题类型
export interface Theme {
  id: string;
  name: string;
  type: 'dark' | 'light';
}

// 预定义的主题列表
export const themes: Theme[] = [
  { id: 'vs-dark', name: '深色 (默认)', type: 'dark' },
  { id: 'vs', name: '浅色', type: 'light' },
  { id: 'hc-black', name: '高对比度黑', type: 'dark' },
  { id: 'hc-light', name: '高对比度亮', type: 'light' }
];

// 获取默认主题
export const getDefaultTheme = (): Theme => {
  return themes[0]; // 默认使用第一个主题 (vs-dark)
};

// 根据ID获取主题
export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

// 保存用户主题偏好到本地存储
export const saveThemePreference = (themeId: string): void => {
  try {
    localStorage.setItem('editor-theme', themeId);
  } catch (error) {
    console.error('保存主题偏好失败:', error);
  }
};

// 从本地存储获取用户主题偏好
export const loadThemePreference = (): string => {
  try {
    const savedTheme = localStorage.getItem('editor-theme');
    return savedTheme || getDefaultTheme().id;
  } catch (error) {
    console.error('加载主题偏好失败:', error);
    return getDefaultTheme().id;
  }
};