import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Spin, Alert } from 'antd';
import { getTasksByLesson, updateTask, Task } from '../../api/taskApi';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

const TaskEdit: React.FC = () => {
  const { lessonId, taskId } = useParams<{ lessonId: string; taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTask, setInitialTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!lessonId || !taskId || !user || user.role !== 'teacher') {
      setError('无效的参数或权限不足。');
      return;
    }

    const fetchTask = async () => {
      setLoading(true);
      try {
        const tasks = await getTasksByLesson(parseInt(lessonId, 10));
        const taskToEdit = tasks.find(t => t.taskId === parseInt(taskId, 10));
        if (taskToEdit) {
          setInitialTask(taskToEdit);
          form.setFieldsValue({
            taskName: taskToEdit.taskName,
            taskContent: taskToEdit.taskContent,
          });
        } else {
          setError('未找到指定的作业。');
        }
      } catch (err) {
        console.error('Failed to fetch task:', err);
        setError('获取作业详情失败。');
      }
      setLoading(false);
    };

    fetchTask();
  }, [lessonId, taskId, user, form]);

  const handleSubmit = async (values: { taskName: string; taskContent: string }) => {
    if (!initialTask || !user || user.role !== 'teacher' || !taskId) {
      message.error('无法更新作业，缺少必要信息或权限。');
      return;
    }

    const updatedTaskData: Task = {
      ...initialTask, // Preserve other fields like teacherId, lessonId
      ...values,      // Overwrite with form values
      taskId: parseInt(taskId, 10), // Ensure taskId is a number
    };

    setLoading(true);
    try {
      await updateTask(updatedTaskData, Number(user.id));
      message.success('作业更新成功!');
      navigate(`/curriculum/${lessonId}`);
    } catch (err) {
      console.error('Failed to update task:', err);
      message.error('更新作业失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'teacher') {
    return <p>您没有权限访问此页面。</p>;
  }

  if (error) {
    return <Alert message="错误" description={error} type="error" showIcon />;
  }

  if (loading && !initialTask) {
    return <Spin tip="正在加载作业详情..." style={{ display: 'block', marginTop: '20px' }} />;
  }
  
  if (!initialTask && !loading) {
    // This case might be covered by error state, but as a fallback
    return <p>无法加载作业信息。</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card title={<Title level={3}>编辑作业 (课程 {lessonId} - 作业 {taskId})</Title>}>
        <Spin spinning={loading} tip="正在保存...">
          <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{
            taskName: initialTask?.taskName,
            taskContent: initialTask?.taskContent
          }}>
            <Form.Item
              name="taskName"
              label="作业名称"
              rules={[{ required: true, message: '请输入作业名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="taskContent"
              label="作业内容"
              rules={[{ required: true, message: '请输入作业内容!' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存更改
              </Button>
              <Button style={{ marginLeft: '10px' }} onClick={() => navigate(`/curriculum/${lessonId}`)}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default TaskEdit;
