import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import '@ant-design/cssinjs';
import '@ant-design/pro-components/dist/components.css';
import { getCoursesByTeacher } from '../../api/enrollmentApi';
import type { Course } from '../../api/enrollmentApi';

const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space>
          <Button 
            type="primary"
            onClick={() => window.location.href = `/teacher/courses/${record.courseId}/students`}
          >
            查看学生
          </Button>
        </Space>
      ),
    },
  ];

  const fetchCourses = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      const data = await getCoursesByTeacher(teacherId);
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);

  return (
    <div style={{ padding: '24px' }}>
      <div className="ant-card">
        <div className="ant-card-head">
          <div className="ant-card-head-title">选课管理</div>
        </div>
        <div className="ant-card-body">
          <Table
            columns={columns}
            dataSource={courses}
            loading={loading}
            rowKey="courseId"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
