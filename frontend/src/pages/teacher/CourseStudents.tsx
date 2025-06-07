import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, message, Select } from 'antd';
import '@ant-design/cssinjs';
import '@ant-design/pro-components/dist/components.css';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollmentInfoByTeacher } from '../../api/enrollmentApi';
import { searchStudents } from '../../api/studentApi';
import type { EnrollmentInfo } from '../../api/enrollmentApi';
import type { SearchStudentParams } from '../../api/studentApi';

const { Search } = Input;

const CourseStudents: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState<EnrollmentInfo[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [courses, setCourses] = useState<{[key: string]: string}>({}); // lessonId -> lessonName

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '专业',
      dataIndex: ['studentInfo', 'major'],
      key: 'major',
    },
    {
      title: '年级',
      dataIndex: ['studentInfo', 'grade'],
      key: 'grade',
    },
    {
      title: '邮箱',
      dataIndex: 'studentEmail',
      key: 'studentEmail',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: EnrollmentInfo) => (
        <Space>
          <Button type="link" onClick={() => handleViewPerformance(record.studentId)}>
            查看表现
          </Button>
        </Space>
      ),
    },
  ];

  const handleSearch = async (value: string) => {
    if (!value) return;

    try {
      const params: SearchStudentParams = {
        name: value,
      };
      await searchStudents(params);
      message.info('搜索功能待完善');
    } catch (error) {
      console.error('Failed to search students:', error);
      message.error('搜索学生失败');
    }
  };

  const handleViewPerformance = (studentId: number) => {
    message.info(`查看学生${studentId}的表现（待实现）`);
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    // 根据选中的课程过滤学生列表
    // 实际实现中可能需要重新请求该课程的学生数据
  };

  const fetchEnrollments = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      const data = await getEnrollmentInfoByTeacher(teacherId, teacherId, 'teacher');
      setEnrollments(data);
      
      // 提取课程信息
      const courseMap: {[key: string]: string} = {};
      data.forEach(item => {
        courseMap[item.lessonId] = item.lessonName;
      });
      setCourses(courseMap);
      
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
      <div className="ant-card">
        <div className="ant-card-head">
          <div className="ant-card-head-title">课程学生管理</div>
        </div>
        <div className="ant-card-body">
        <Space direction="vertical" style={{ width: '100%', marginBottom: '20px' }}>
          <Space>
            <Select
              style={{ width: 200 }}
              placeholder="选择课程"
              onChange={handleCourseChange}
              value={selectedCourse}
            >
              options={Object.entries(courses).map(([id, name]) => ({
                label: name,
                value: id,
                key: id
              }))}
            </Select>
            <Search
              placeholder="搜索学生姓名"
              onSearch={handleSearch}
              style={{ width: 200 }}
            />
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={enrollments}
          loading={loading}
          rowKey="enrollmentId"
        />
        </div>
      </div>
    </div>
  );
};

export default CourseStudents;
