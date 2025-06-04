// d:\Github\open-source\LetsCode-AI\frontend\src\pages\student\StudentDashboard.tsx
import React from 'react';
import { Card, Typography, Avatar, Tag, Row, Col, Button, List, Table, Space } from 'antd';
import { UserOutlined, BookOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

// 模拟课程数据
const courses = [
  { id: 1, name: '人工智能基础', teacher: '张老师', progress: 0.7 },
  { id: 2, name: '数据结构与算法', teacher: '李老师', progress: 0.4 },
];

// 模拟作业数据
const assignments = [
  { id: 1, title: '线性回归编程作业', due: '2025-06-10', status: '待完成' },
  { id: 2, title: '算法分析报告', due: '2025-06-12', status: '已提交' },
  { id: 3, title: 'AI课程小测', due: '2025-06-15', status: '已批改' },
];

const assignmentStatusColor: Record<string, string> = {
  '待完成': 'orange',
  '已提交': 'blue',
  '已批改': 'green',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6 text-blue-700">学生仪表盘</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="shadow-lg mb-6">
            <div className="flex flex-col items-center">
              <Avatar size={80} icon={<UserOutlined />} className="bg-blue-500 mb-4" />
              <Title level={4}>{user?.name}</Title>
              <Text type="secondary">{user?.email}</Text>
              <div className="mt-2">
                <Tag color="blue">角色：学生</Tag>
              </div>
            </div>
            <div className="mt-6">
              <p><b>学号/ID：</b>{user?.id}</p>
              <p><b>专业：</b>{user?.major || '暂无'}</p>
              <p><b>年级：</b>{user?.grade || '暂无'}</p>
            </div>
          </Card>
        </Col>
        {/* 其余代码保持不变 */}
      </Row>
    </div>
  );
};

export default StudentDashboard;