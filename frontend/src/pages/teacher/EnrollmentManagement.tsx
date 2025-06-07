import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal } from 'antd';
import Card from 'antd/lib/card';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollmentInfoByTeacher } from '../../api/enrollmentApi';
import type { EnrollmentInfo } from '../../api/enrollmentApi';

const EnrollmentManagement: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<EnrollmentInfo[]>([]);

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '学生邮箱',
      dataIndex: 'studentEmail',
      key: 'studentEmail',
    },
    {
      title: '课程名称',
      dataIndex: 'lessonName',
      key: 'lessonName',
    },
    {
      title: '学期',
      dataIndex: 'lessonTerm',
      key: 'lessonTerm',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnrollmentInfo) => (
        <Space>
          <Button
            onClick={() => handleViewStudentDetails(record.studentId)}
          >
            查看学生详情
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewStudentDetails = (studentId: number) => {
    Modal.info({
      title: '学生详情',
      content: (
        <div>
          <p>学生ID: {studentId}</p>
          <p>更多详细信息将从学生API获取...</p>
        </div>
      ),
    });
  };

  const fetchEnrollments = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      const data = await getEnrollmentInfoByTeacher(teacherId, teacherId, 'teacher');
      setEnrollments(data);
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      message.error('获取选课信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchEnrollments();
    }
  }, [teacherId]);

  return (
    <div style={{ padding: '24px' }}>
      <Card title="选课管理">
        <Table
          columns={columns}
          dataSource={enrollments}
          loading={loading}
          rowKey="enrollmentId"
        />
      </Card>
    </div>
  );
};

export default EnrollmentManagement;
