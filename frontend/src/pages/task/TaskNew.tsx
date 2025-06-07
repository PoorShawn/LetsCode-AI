import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { createTask, Task } from '../../api/taskApi';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

const TaskNew: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { taskName: string; taskContent: string }) => {
    if (!lessonId || !user || user.role !== 'teacher') {
      message.error('无效的操作或权限不足');
      return;
    }

    // For now, we assume it's nullable or handled by the backend if not provided.
    // Since Student_has_Lesson_ID is required in Task interface and we cannot change API,
    // we provide a placeholder value like 0. This needs backend awareness.
    const newTaskPayload: Omit<Task, 'taskId'> = { // taskId is auto-generated
      taskName: values.taskName,
      taskContent: values.taskContent,
      lessonId: parseInt(lessonId, 10), // Ensure lessonId is number
      teacherId: Number(user.id),       // Ensure teacherId is number
      Student_has_Lesson_ID: 0,         // Provide placeholder for required field
    };

    setLoading(true);
    try {
      // newTaskPayload should now more closely match the Task interface
      await createTask(newTaskPayload as Task); 
      message.success('作业创建成功!');
      navigate(`/curriculum/${lessonId}`); 
    } catch (error) {
      console.error('Failed to create task:', error);
      message.error('创建作业失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'teacher') {
    return <p>您没有权限访问此页面。</p>;
  }
  
  if (!lessonId) {
    return <p>未指定课程ID。</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card title={<Title level={3}>为课程 {lessonId} 创建新作业</Title>}>
        <Spin spinning={loading} tip="正在提交...">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                创建作业
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

export default TaskNew;
