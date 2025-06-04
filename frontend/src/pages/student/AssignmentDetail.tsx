import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, message, Space, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import type { Task } from '../../api/taskApi';
import { getTasksByLesson } from '../../api/taskApi';
import Editor from '../../views/coder/components/Editor';

const AssignmentDetail: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>('# 在这里编写你的代码\n\n');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        if (assignmentId) {
          // 这里我们需要先获取课程的所有作业，然后找到当前作业
          // 因为目前API不支持直接通过作业ID获取作业详情
          const tasks = await getTasksByLesson(Number(assignmentId));
          const currentTask = tasks.find(t => t.taskId === Number(assignmentId));
          if (currentTask) {
            setTask(currentTask);
          } else {
            message.error('未找到作业信息');
            navigate('/student/assignments');
          }
        }
      } catch (error) {
        message.error('获取作业信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [assignmentId, navigate]);

  if (!task) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* 作业信息 */}
      <Card className="shadow-md mb-6" loading={loading}>
        <Descriptions
          title={
            <Space>
              <FileTextOutlined />
              {task.taskName}
            </Space>
          }
          bordered
        >
          <Descriptions.Item label="作业ID">{task.taskId}</Descriptions.Item>
          <Descriptions.Item label="课程ID">{task.lessonId}</Descriptions.Item>
          <Descriptions.Item label="教师ID">{task.teacherId}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 作业内容和代码编辑器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="作业要求" className="shadow-md">
          <pre className="whitespace-pre-wrap">{task.taskContent}</pre>
        </Card>

        <Card
          title="代码编辑器"
          className="shadow-md"
        >
          <div className="h-[500px] border border-gray-200 rounded">
            <Editor
              value={code}
              onChange={(value) => setCode(value || '')}
              language="python"
              height="100%"
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentDetail;
