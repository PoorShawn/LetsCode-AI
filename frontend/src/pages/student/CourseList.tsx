import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message, Input, Space } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { listAllCurriculums } from '../../api/curriculumApi';
import { enrollStudent as enrollInCourse, cancelEnrollment } from '../../api/enrollmentApi';
import type { Curriculum } from '../../api/curriculumApi';

const { Search } = Input;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await listAllCurriculums();
      setCourses(data);
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (lessonId: number) => {
    try {
      setLoading(true);
      // 创建选课记录
      const enrollment = {
        studentId: user?.id as number,
        lessonId: lessonId,
        studentHasLessonId: 0 // 这个值会由后端生成
      };
      await enrollInCourse(enrollment, user?.id as number);
      message.success('课程报名成功');
      fetchCourses(); // 刷新课程列表
    } catch (error) {
      message.error('课程报名失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (lessonId: number) => {
    try {
      setLoading(true);
      await cancelEnrollment(user?.id as number, lessonId, user?.id as number);
      message.success('退选课程成功');
      fetchCourses(); // 刷新课程列表
    } catch (error) {
      message.error('退选课程失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.lessonName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'lessonName',
      key: 'lessonName',
      render: (text: string) => (
        <Space>
          <BookOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '学期',
      dataIndex: 'lessonTerm',
      key: 'lessonTerm',
    },
    {
      title: '容量',
      key: 'capacity',
      render: (text: string, record: Curriculum) => (
        <Tag color={record.enrolledCount >= record.capacity ? 'red' : 'green'}>
          {record.enrolledCount}/{record.capacity}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: Curriculum) => (
        <Space size="middle">
          <Button 
            type="primary"
            size="small"
            onClick={() => navigate(`/student/course/${record.lessonId}`)}
          >
            查看详情
          </Button>
          {record.enrolledCount < record.capacity ? (
            <Button
              type="primary"
              size="small"
              onClick={() => handleEnroll(record.lessonId)}
            >
              报名
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              danger
              onClick={() => handleWithdraw(record.lessonId)}
            >
              退选
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card 
        title="课程列表" 
        className="shadow-md"
        extra={
          <Search
            placeholder="搜索课程"
            allowClear
            onSearch={value => setSearchText(value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="lessonId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 门课程`,
          }}
        />
      </Card>
    </div>
  );
};

export default CourseList;
