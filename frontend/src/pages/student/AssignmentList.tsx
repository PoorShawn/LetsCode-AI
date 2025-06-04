import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Input, Space, Select } from 'antd';
import { SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTasksByStudent } from '../../api/taskApi';
import type { Task } from '../../api/taskApi';

const { Search } = Input;
const { Option } = Select;

interface Assignment {
  id: number;
  title: string;
  courseName: string;
  deadline: string;
  status: string;
  score?: number;
}

const AssignmentList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const taskList = await getTasksByStudent(user.id);
          setTasks(taskList);
        }
      } catch (error) {
        console.error('获取作业列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  const columns = [
    {
      title: '作业标题',
      dataIndex: 'taskName',
      key: 'taskName',
      render: (text: string) => (
        <Space>
          <ClockCircleOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '作业内容',
      dataIndex: 'taskContent',
      key: 'taskContent',
      ellipsis: true,
    },
    {
      title: '课程ID',
      dataIndex: 'lessonId',
      key: 'lessonId',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/student/assignment/${record.taskId}`)}
          >
            查看作业
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card
        title="作业列表"
        className="shadow-md"
        extra={
          <Space>
            <Search
              placeholder="搜索作业"
              allowClear
              onSearch={value => setSearchText(value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="taskId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 个作业`,
          }}
        />
      </Card>
    </div>
  );
};

export default AssignmentList;
