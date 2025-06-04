// d:\Github\open-source\LetsCode-AI\frontend\src\pages\teacher\TeacherDashboard.tsx
import React from 'react';
import { Card, Typography, Avatar, Tag, Row, Col, Button, List, Table, Space } from 'antd';
import { UserOutlined, ReadOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

// 模拟课程数据
const courses = [
  { id: 1, name: '人工智能基础', studentCount: 45 },
  { id: 2, name: '数据结构与算法', studentCount: 38 },
];

// 模拟需批改作业数据
const gradingTasks = [
  { id: 1, student: '王小明', title: '线性回归编程作业', submitted: '2025-06-08', status: '待批改' },
  { id: 2, student: '李晓红', title: '算法分析报告', submitted: '2025-06-09', status: '已批改' },
];

const gradingStatusColor: Record<string, string> = {
  '待批改': 'orange',
  '已批改': 'green',
};

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6 text-green-700">教师仪表盘</Title>
      <Row gutter={[24, 24]}>
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
        {/* 其余代码保持不变 */}
      </Row>
    </div>
  );
};

export default TeacherDashboard;