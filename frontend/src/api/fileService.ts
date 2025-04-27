// 文件服务模块，用于处理文件加载、保存和管理功能

// 模拟文件系统的接口
interface FileSystem {
  [path: string]: string;
}

// 文件树节点接口
export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  path: string;
}

// 模拟的文件系统数据
const mockFileSystem: FileSystem = {
  '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`,
  '/src/App.tsx': `import { useState } from 'react';
import './App.css';
import CodeEditor from './components/Editor';
import FileTree from './components/FileTree';

function App() {
  const [code, setCode] = useState('// 在这里开始编写代码\n');

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleFileSelect = (filePath: string) => {
    // TODO: 实现文件加载逻辑
    console.log('Selected file:', filePath);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI 代码编辑器</h1>
      </header>
      <main className="app-main">
        <FileTree onFileSelect={handleFileSelect} />
        <div className="editor-section">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language="javascript"
          />
        </div>
      </main>
    </div>
  );
}

export default App;`,
  '/src/index.css': `/* 这里是index.css的内容 */
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}`
};

// 获取文件内容
export const getFileContent = (filePath: string): string => {
  if (filePath in mockFileSystem) {
    return mockFileSystem[filePath];
  }
  return '// 文件不存在或为空';
};

// 保存文件内容
export const saveFileContent = (filePath: string, content: string): void => {
  mockFileSystem[filePath] = content;
};

// 创建新文件
export const createFile = (filePath: string, content: string = ''): boolean => {
  if (filePath in mockFileSystem) {
    return false; // 文件已存在
  }
  mockFileSystem[filePath] = content;
  return true;
};

// 删除文件
export const deleteFile = (filePath: string): boolean => {
  if (!(filePath in mockFileSystem)) {
    return false; // 文件不存在
  }
  delete mockFileSystem[filePath];
  return true;
};

// 重命名文件
export const renameFile = (oldPath: string, newPath: string): boolean => {
  if (!(oldPath in mockFileSystem) || newPath in mockFileSystem) {
    return false; // 源文件不存在或目标文件已存在
  }
  mockFileSystem[newPath] = mockFileSystem[oldPath];
  delete mockFileSystem[oldPath];
  return true;
};

// 获取文件树
export const getFileTree = (): FileNode[] => {
  const rootNodes: { [key: string]: FileNode } = {};
  
  // 处理所有文件路径
  Object.keys(mockFileSystem).forEach(path => {
    const parts = path.split('/');
    let currentPath = '';
    
    // 遍历路径的每一部分
    parts.filter(part => part).forEach((part, index) => {
      const isLast = index === parts.length - 1;
      currentPath += '/' + part;
      
      // 如果是根目录的直接子节点
      if (index === 0) {
        if (!rootNodes[part]) {
          rootNodes[part] = {
            name: part,
            type: isLast ? 'file' : 'directory',
            path: currentPath,
            children: isLast ? undefined : []
          };
        }
        return;
      }
      
      // 查找父节点
      const parentPath = '/' + parts.slice(0, index).join('/');
      let parent = findNodeByPath(rootNodes, parentPath);
      
      if (parent && parent.type === 'directory') {
        // 检查当前节点是否已存在
        const existingNode = parent.children?.find(child => child.path === currentPath);
        
        if (!existingNode) {
          const newNode: FileNode = {
            name: part,
            type: isLast ? 'file' : 'directory',
            path: currentPath,
            children: isLast ? undefined : []
          };
          
          parent.children?.push(newNode);
        } else if (!isLast && existingNode.type === 'file') {
          // 如果现有节点是文件但应该是目录，则转换为目录
          existingNode.type = 'directory';
          existingNode.children = [];
        }
      }
    });
  });
  
  return Object.values(rootNodes);
};

// 辅助函数：根据路径查找节点
const findNodeByPath = (rootNodes: { [key: string]: FileNode } | FileNode[], path: string): FileNode | null => {
  if (path === '/') return null;
  
  const parts = path.split('/').filter(part => part);
  const rootName = parts[0];
  
  // 查找根节点
  let rootNode: FileNode | undefined;
  if (Array.isArray(rootNodes)) {
    rootNode = rootNodes.find(node => node.name === rootName);
  } else {
    rootNode = rootNodes[rootName];
  }
  
  if (!rootNode) return null;
  
  // 如果只有根节点，直接返回
  if (parts.length === 1) return rootNode;
  
  // 递归查找子节点
  let currentNode = rootNode;
  for (let i = 1; i < parts.length; i++) {
    const childName = parts[i];
    const child = currentNode.children?.find(node => node.name === childName);
    
    if (!child) return null;
    currentNode = child;
  }
  
  return currentNode;
};

// 获取文件语言类型
export const getFileLanguage = (filePath: string): string => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return 'typescript';
  } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    return 'javascript';
  } else if (filePath.endsWith('.html')) {
    return 'html';
  } else if (filePath.endsWith('.css')) {
    return 'css';
  } else if (filePath.endsWith('.json')) {
    return 'json';
  } else if (filePath.endsWith('.md')) {
    return 'markdown';
  }
  return 'plaintext';
};