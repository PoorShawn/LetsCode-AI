import { useState, useEffect } from 'react';
import { getFileTree, FileNode, createFile, deleteFile, renameFile } from '../../api/fileService';

interface FileTreeProps {
  onFileSelect?: (filePath: string) => void;
  className?: string;
}

const FileTreeItem = ({ node, onSelect, onContextMenu }: { 
  node: FileNode; 
  onSelect?: (path: string) => void; 
  onContextMenu?: (e: React.MouseEvent, node: FileNode) => void 
}) => {
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
    <div className="py-0.5">
      <div
        className={`flex items-center px-2 py-1 cursor-pointer rounded hover:bg-[#2a2d2e] ${
          node.type === 'directory' ? 'font-medium' : 'font-normal'
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span className="mr-1.5 text-sm">
          {node.type === 'directory' ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === 'directory' && isExpanded && node.children && (
        <div className="ml-4">
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

const FileTree = ({ onFileSelect, className }: FileTreeProps) => {
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
    <div className={`w-[250px] h-full bg-[#252526] text-white overflow-y-auto py-2.5 border-r border-[#3d3d3d] select-none ${className}`} 
         onClick={handleCloseContextMenu}>
      <div className="flex justify-between items-center px-4 pb-2.5 border-b border-[#3d3d3d] mb-2.5">
        <h3 className="m-0 text-sm font-normal">文件浏览器</h3>
        <button 
          className="bg-[#0e639c] text-white border-none px-2 py-1 rounded text-xs cursor-pointer hover:bg-[#1177bb]"
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[#252526] border border-[#3d3d3d] rounded p-5 w-[400px] max-w-[90%]">
            <h3 className="mt-0 mb-4 text-base">创建新文件</h3>
            <p>在 {newFileParentPath} 下创建:</p>
            <input 
              type="text" 
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="输入文件名..."
              className="w-full p-2 mb-4 bg-[#3c3c3c] border border-[#3d3d3d] text-white rounded"
            />
            <div className="flex justify-end gap-2.5">
              <button 
                onClick={handleCreateFile}
                className="bg-[#0e639c] text-white px-3 py-1.5 rounded border-none cursor-pointer hover:opacity-90"
              >
                创建
              </button>
              <button 
                onClick={() => setShowNewFileDialog(false)}
                className="bg-[#3c3c3c] text-[#cccccc] px-3 py-1.5 rounded border-none cursor-pointer hover:opacity-90"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showContextMenu && selectedNode && (
        <div 
          className="fixed bg-[#252526] border border-[#3d3d3d] rounded shadow-lg z-50 min-w-[150px]"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          {selectedNode.type === 'directory' && (
            <button 
              className="w-full text-left bg-transparent border-none text-[#cccccc] px-3 py-2 cursor-pointer text-sm hover:bg-[#2a2d2e]"
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
            className="w-full text-left bg-transparent border-none text-[#cccccc] px-3 py-2 cursor-pointer text-sm hover:bg-[#2a2d2e]"
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
            className="w-full text-left bg-transparent border-none text-[#cccccc] px-3 py-2 cursor-pointer text-sm hover:bg-[#2a2d2e]"
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