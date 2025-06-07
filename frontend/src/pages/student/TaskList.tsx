import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message } from 'antd';
import '@ant-design/cssinjs';
import '@ant-design/pro-components/dist/components.css';
import { useAuth } from '../../contexts/AuthContext';
import { getTasksByStudent } from '../../api/taskApi';
import type { Task } from '../../api/taskApi';

interface TaskInfo extends Task {
  taskId: number;
}

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskInfo[]>([]);

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TaskInfo) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleStartTask(record.taskId)}
          >
            开始任务
          </Button>
          <Button
            onClick={() => handleViewHistory(record.taskId)}
          >
            查看历史
          </Button>
        </Space>
      ),
    },
  ];

  const handleStartTask = (taskId: number) => {
    message.info(`开始任务 ${taskId}（待实现）`);
  };

  const handleViewHistory = (taskId: number) => {
    message.info(`查看任务 ${taskId} 的历史（待实现）`);
  };

  const fetchTasks = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const data = await getTasksByStudent(studentId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      message.error('获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchTasks();
    }
  }, [studentId]);

  return (
    <div style={{ padding: '24px' }}>
      <div className="ant-card">
        <div className="ant-card-head">
          <div className="ant-card-head-title">我的任务</div>
        </div>
        <div className="ant-card-body">
        <Table
          columns={columns}
          dataSource={tasks}
          loading={loading}
          rowKey="taskId"
        />
        </div>
      </div>
    </div>
  );
};

export default TaskList;
