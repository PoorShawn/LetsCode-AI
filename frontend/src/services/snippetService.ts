// 代码片段服务模块，用于管理和提供常用的代码模板

// 定义代码片段接口
export interface CodeSnippet {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  tags?: string[];
}

// 预定义的代码片段
const predefinedSnippets: CodeSnippet[] = [
  {
    id: 'react-component',
    name: 'React 函数组件',
    description: '创建一个基本的 React 函数组件',
    language: 'typescript',
    code: `import React from 'react';
import './styles.css';

interface Props {
  // 在这里定义组件属性
}

const Component: React.FC<Props> = (props) => {
  return (
    <div className="component">
      {/* 组件内容 */}
    </div>
  );
};

export default Component;`,
    tags: ['react', 'component', 'typescript']
  },
  {
    id: 'react-useState',
    name: 'React useState Hook',
    description: '使用 useState Hook 管理组件状态',
    language: 'typescript',
    code: `import { useState } from 'react';

// 在组件内部使用
const [state, setState] = useState<type>(initialValue);

// 更新状态
setState(newValue);

// 基于之前的状态更新
setState(prevState => prevState + 1);`,
    tags: ['react', 'hooks', 'state']
  },
  {
    id: 'react-useEffect',
    name: 'React useEffect Hook',
    description: '使用 useEffect Hook 处理副作用',
    language: 'typescript',
    code: `import { useEffect, useState } from 'react';

// 在组件内部使用
useEffect(() => {
  // 执行副作用
  console.log('组件已挂载或依赖项已更新');
  
  // 可选的清理函数
  return () => {
    console.log('组件将卸载或依赖项将更新');
  };
}, [/* 依赖项数组 */]);`,
    tags: ['react', 'hooks', 'effect']
  },
  {
    id: 'js-fetch',
    name: 'Fetch API 请求',
    description: '使用 Fetch API 发送网络请求',
    language: 'javascript',
    code: `// GET 请求
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('网络响应不正常');
    }
    return response.json();
  })
  .then(data => {
    console.log('获取的数据:', data);
  })
  .catch(error => {
    console.error('获取数据失败:', error);
  });

// POST 请求
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: 'value'
  })
})
  .then(response => response.json())
  .then(data => console.log('响应:', data))
  .catch(error => console.error('错误:', error));`,
    tags: ['javascript', 'api', 'network']
  },
  {
    id: 'css-flexbox',
    name: 'CSS Flexbox 布局',
    description: '使用 Flexbox 创建灵活的布局',
    language: 'css',
    code: `.container {
  display: flex;
  flex-direction: row; /* 或 column */
  justify-content: space-between; /* 主轴对齐方式 */
  align-items: center; /* 交叉轴对齐方式 */
  flex-wrap: wrap; /* 允许项目换行 */
  gap: 10px; /* 项目之间的间距 */
}

.item {
  flex: 1; /* 项目占据剩余空间 */
  /* 或使用具体值 */
  flex-grow: 1; /* 增长系数 */
  flex-shrink: 0; /* 收缩系数 */
  flex-basis: auto; /* 初始大小 */
}`,
    tags: ['css', 'layout', 'flexbox']
  },
  {
    id: 'html-template',
    name: 'HTML 基本模板',
    description: '基本的 HTML5 文档结构',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文档标题</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>网站标题</h1>
    <nav>
      <ul>
        <li><a href="#">首页</a></li>
        <li><a href="#">关于</a></li>
        <li><a href="#">联系</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section>
      <h2>第一部分</h2>
      <p>这里是内容...</p>
    </section>
  </main>
  
  <footer>
    <p>&copy; 2023 网站名称</p>
  </footer>
  
  <script src="script.js"></script>
</body>
</html>`,
    tags: ['html', 'template']
  }
];

// 用户自定义代码片段存储
let userSnippets: CodeSnippet[] = [];

// 从本地存储加载用户代码片段
const loadUserSnippets = (): void => {
  try {
    const savedSnippets = localStorage.getItem('user-snippets');
    if (savedSnippets) {
      userSnippets = JSON.parse(savedSnippets);
    }
  } catch (error) {
    console.error('加载用户代码片段失败:', error);
  }
};

// 初始化加载
loadUserSnippets();

// 保存用户代码片段到本地存储
export const saveUserSnippets = (): void => {
  try {
    localStorage.setItem('user-snippets', JSON.stringify(userSnippets));
  } catch (error) {
    console.error('保存用户代码片段失败:', error);
  }
};

// 获取所有代码片段
export const getAllSnippets = (): CodeSnippet[] => {
  return [...predefinedSnippets, ...userSnippets];
};

// 根据语言筛选代码片段
export const getSnippetsByLanguage = (language: string): CodeSnippet[] => {
  return getAllSnippets().filter(snippet => 
    snippet.language === language || snippet.language === 'all'
  );
};

// 根据ID获取代码片段
export const getSnippetById = (id: string): CodeSnippet | undefined => {
  return getAllSnippets().find(snippet => snippet.id === id);
};

// 添加用户自定义代码片段
export const addUserSnippet = (snippet: Omit<CodeSnippet, 'id'>): CodeSnippet => {
  const id = `user-${Date.now()}`;
  const newSnippet = { ...snippet, id };
  userSnippets.push(newSnippet);
  saveUserSnippets();
  return newSnippet;
};

// 更新用户自定义代码片段
export const updateUserSnippet = (id: string, updates: Partial<CodeSnippet>): boolean => {
  const index = userSnippets.findIndex(snippet => snippet.id === id);
  if (index === -1) return false;
  
  userSnippets[index] = { ...userSnippets[index], ...updates };
  saveUserSnippets();
  return true;
};

// 删除用户自定义代码片段
export const deleteUserSnippet = (id: string): boolean => {
  const initialLength = userSnippets.length;
  userSnippets = userSnippets.filter(snippet => snippet.id !== id);
  
  if (userSnippets.length !== initialLength) {
    saveUserSnippets();
    return true;
  }
  return false;
};