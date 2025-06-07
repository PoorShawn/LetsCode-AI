// d:\Github\open-source\LetsCode-AI\frontend\src\pages\teacher\TeacherDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Tag, Row, Col, Button, List, Table, Space, message, Spin } from 'antd';
import type { CardProps } from 'antd';
import { Card } from 'antd';
import { UserOutlined, ReadOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getTeacherCourses } from '../../api/teacherApi';
import { getGradingTasks } from '../../api/gradingApi';

const { Title, Text } = Typography;

// 模拟课程数据
const mockCourses = [
  { id: 1, name: '人工智能基础', studentCount: 45 },
  { id: 2, name: '数据结构与算法', studentCount: 38 },
];

// 模拟需批改作业数据
const mockGradingTasks = [
  { id: 1, student: '王小明', title: '线性回归编程作业', submitted: '2025-06-08', status: '待批改' },
  { id: 2, student: '李晓红', title: '算法分析报告', submitted: '2025-06-09', status: '已批改' },
];

const gradingStatusColor: Record<string, string> = {
  '待批改': 'orange',
  '已批改': 'green',
};

interface Course {
  id: number;
  name: string;
  studentCount: number;
}

interface GradingTask {
  id: number;
  student: string;
  title: string;
  submitted: string;
  status: string;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.id ? parseInt(user.id) : undefined;
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [gradingTasks, setGradingTasks] = useState<GradingTask[]>(mockGradingTasks);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) {
        message.error('用户信息不完整');
        return;
      }

      try {
        const [fetchedCourses, fetchedTasks] = await Promise.all([
          getTeacherCourses(teacherId),
          getGradingTasks(teacherId)
        ]);

        // 如果API调用成功，使用API数据
        if (Array.isArray(fetchedCourses) && fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
        }
        if (Array.isArray(fetchedTasks) && fetchedTasks.length > 0) {
          setGradingTasks(fetchedTasks);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        message.warning('无法从服务器获取数据，将显示模拟数据');
        // 保持使用模拟数据
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6 text-green-700">教师仪表盘</Title>
      <Spin spinning={loading}>
      <Row gutter={[24, 24]}>
        {/* 左侧个人信息 */}
        <Col xs={24} md={8}>
          <Card className="shadow-lg mb-6">
            <div className="flex flex-col items-center">
              <Avatar size={80} icon={<UserOutlined />} className="bg-green-500 mb-4" />
              <Title level={4}>{user?.name}</Title>
              <Text type="secondary">{user?.email}</Text>
              <div className="mt-2">
                <Tag color="green">角色：教师</Tag>
              </div>
            </div>
            <div className="mt-6">
              <p><b>教工号/ID：</b>{user?.id}</p>
              <p><b>部门：</b>{user?.department || '暂无'}</p>
              <p><b>职称：</b>{user?.title || '暂无'}</p>
            </div>
          </Card>
        </Col>
        {/* 右侧课程和批改中心 */}
        <Col xs={24} md={16}>
          <Row gutter={[24, 24]}>
            {/* 我教授的课程 */}
            <Col xs={24}>
              <Card
                title={<Space><ReadOutlined /> 我教授的课程</Space>}
                extra={<Button type="link">管理课程</Button>}
                className="shadow-md mb-6"
              >
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={courses}
                  renderItem={course => (
                    <List.Item>
                      <Card hoverable>
                        <Title level={5}>{course.name}</Title>
                        <Text type="secondary">学生人数：{course.studentCount}</Text>
                        <Button type="primary" size="small" className="mt-2">进入课程</Button>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            {/* 批改中心 */}
            <Col xs={24}>
              <Card
                title={<Space><EditOutlined /> 批改中心</Space>}
                extra={<Button type="link">全部作业</Button>}
                className="shadow-md"
              >
                <Table
                  size="small"
                  dataSource={gradingTasks}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: '学生', dataIndex: 'student', key: 'student' },
                    { title: '作业标题', dataIndex: 'title', key: 'title' },
                    { title: '提交时间', dataIndex: 'submitted', key: 'submitted' },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => (
                        <Tag color={gradingStatusColor[status] || 'default'}>{status}</Tag>
                      ),
                    },
                    {
                      title: '操作',
                      key: 'action',
                      render: (_: unknown, record: GradingTask) => (
                        <Button type="link" size="small">批改</Button>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      </Spin>
    </div>
  );
};

export default TeacherDashboard;