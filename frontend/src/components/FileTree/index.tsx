import { useState, useEffect } from 'react';
import './styles.css';
import { getFileTree, FileNode, createFile, deleteFile, renameFile } from '../../services/fileService';

interface FileTreeProps {
  onFileSelect?: (filePath: string) => void;
}

const FileTreeItem = ({ node, onSelect, onContextMenu }: { node: FileNode; onSelect?: (path: string) => void; onContextMenu?: (e: React.MouseEvent, node: FileNode) => void }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else if (onSelect) {
      onSelect(node.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContextMenu) {
      onContextMenu(e, node);
    }
  };

  return (
    <div className="file-tree-item">
      <div
        className={`file-tree-item-header ${node.type}`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span className="file-tree-item-icon">
          {node.type === 'directory' ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>
        <span className="file-tree-item-name">{node.name}</span>
      </div>
      {node.type === 'directory' && isExpanded && node.children && (
        <div className="file-tree-item-children">
          {node.children.map((child, index) => (
            <FileTreeItem
              key={index}
              node={child}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ onFileSelect }: FileTreeProps) => {
  const [fileNodes, setFileNodes] = useState<FileNode[]>([]);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileParentPath, setNewFileParentPath] = useState('/');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  
  // 加载文件树
  useEffect(() => {
    const loadFileTree = () => {
      const tree = getFileTree();
      setFileNodes(tree);
    };
    
    loadFileTree();
  }, []);
  
  // 创建新文件
  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    
    const filePath = `${newFileParentPath}/${newFileName}`;
    const success = createFile(filePath);
    
    if (success) {
      // 重新加载文件树
      setFileNodes(getFileTree());
      setShowNewFileDialog(false);
      setNewFileName('');
    } else {
      alert('文件已存在或路径无效');
    }
  };
  
  // 删除文件
  const handleDeleteFile = (filePath: string) => {
    if (confirm(`确定要删除 ${filePath} 吗？`)) {
      const success = deleteFile(filePath);
      if (success) {
        // 重新加载文件树
        setFileNodes(getFileTree());
      } else {
        alert('删除文件失败');
      }
    }
  };
  
  // 重命名文件
  const handleRenameFile = (oldPath: string, newName: string) => {
    const pathParts = oldPath.split('/');
    pathParts.pop(); // 移除文件名
    const parentPath = pathParts.join('/');
    const newPath = `${parentPath}/${newName}`;
    
    const success = renameFile(oldPath, newPath);
    if (success) {
      // 重新加载文件树
      setFileNodes(getFileTree());
    } else {
      alert('重命名文件失败');
    }
  };
  
  // 显示上下文菜单
  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    setSelectedNode(node);
  };
  
  // 关闭上下文菜单
  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };
  
  return (
    <div className="file-tree" onClick={handleCloseContextMenu}>
      <div className="file-tree-header">
        <h3>文件浏览器</h3>
        <button 
          className="file-tree-add-button" 
          onClick={() => {
            setNewFileParentPath('/');
            setShowNewFileDialog(true);
          }}
          title="创建新文件"
        >
          + 新建文件
        </button>
      </div>
      
      {fileNodes.map((node, index) => (
        <FileTreeItem
          key={index}
          node={node}
          onSelect={onFileSelect}
          onContextMenu={handleContextMenu}
        />
      ))}
      
      {showNewFileDialog && (
        <div className="file-dialog-overlay">
          <div className="file-dialog">
            <h3>创建新文件</h3>
            <p>在 {newFileParentPath} 下创建:</p>
            <input 
              type="text" 
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="输入文件名..."
            />
            <div className="file-dialog-buttons">
              <button onClick={handleCreateFile}>创建</button>
              <button onClick={() => setShowNewFileDialog(false)}>取消</button>
            </div>
          </div>
        </div>
      )}
      
      {showContextMenu && selectedNode && (
        <div 
          className="context-menu"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          {selectedNode.type === 'directory' && (
            <button 
              onClick={() => {
                setNewFileParentPath(selectedNode.path);
                setShowNewFileDialog(true);
                setShowContextMenu(false);
              }}
            >
              在此创建文件
            </button>
          )}
          <button 
            onClick={() => {
              const newName = prompt('输入新名称:', selectedNode.name);
              if (newName && newName !== selectedNode.name) {
                handleRenameFile(selectedNode.path, newName);
              }
              setShowContextMenu(false);
            }}
          >
            重命名
          </button>
          <button 
            onClick={() => {
              handleDeleteFile(selectedNode.path);
              setShowContextMenu(false);
            }}
          >
            删除
          </button>
        </div>
      )}
    </div>
  );
};

export default FileTree;