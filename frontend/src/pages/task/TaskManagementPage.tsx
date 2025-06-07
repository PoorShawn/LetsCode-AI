import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal, Form, Input } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import '@ant-design/cssinjs';
import '@ant-design/pro-components/dist/components.css';
import { getTasksByTeacher, createTask, updateTask, deleteTask } from '../../api/taskApi';
import type { Task } from '../../api/taskApi';

const TaskManagementPage: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
      key: 'taskId',
    },
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
      render: (_: any, record: Task) => (
        <Space>
          <Button 
            type="primary"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            danger
            onClick={() => handleDelete(record.taskId)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchTasks = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      const data = await getTasksByTeacher(teacherId);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      message.error('获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setModalVisible(true);
  };

  const handleDelete = async (taskId: number) => {
    if (!teacherId) return;

    try {
      await deleteTask(taskId, teacherId);
      message.success('删除任务成功');
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      message.error('删除任务失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!teacherId) return;

      if (editingTask) {
        await updateTask({ ...editingTask, ...values }, teacherId);
        message.success('更新任务成功');
      } else {
        await createTask({ ...values, teacherId });
        message.success('创建任务成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to submit task:', error);
      message.error('提交任务失败');
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchTasks();
    }
  }, [teacherId]);

  return (
    <div style={{ padding: '24px' }}>
      <div className="ant-card">
        <div className="ant-card-head">
          <div className="ant-card-head-title">任务管理</div>
        </div>
        <div className="ant-card-body">
          <div style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              onClick={() => {
                setEditingTask(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              创建任务
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={tasks}
            loading={loading}
            rowKey="taskId"
          />

          <Modal
            title={editingTask ? '编辑任务' : '创建任务'}
            open={modalVisible}
            onOk={handleSubmit}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
              setEditingTask(null);
            }}
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="taskName"
                label="任务名称"
                rules={[{ required: true, message: '请输入任务名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="任务描述"
                rules={[{ required: true, message: '请输入任务描述' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="deadline"
                label="截止时间"
                rules={[{ required: true, message: '请输入截止时间' }]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementPage;
