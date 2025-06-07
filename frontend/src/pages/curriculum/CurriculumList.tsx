import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Spin, Alert, Space } from 'antd';
import { Link } from 'react-router-dom';
import { listAllCurriculums, Curriculum } from '../../api/curriculumApi'; // 请确保API路径和导出正确

const { Title } = Typography;

const mockCurriculaData: ExtendedCurriculum[] = [
  {
    lessonId: 99901,
    lessonName: 'Introduction to Mocking (Mock)',
    teacherId: 'T007',
    teacherName: 'Dr. Mock A. Lot (Mock)',
    lessonTerm: 'Spring 2077',
    capacity: 50,
    enrolledCount: 5,
    description: 'Learn the art and science of creating effective mock data for frontend development.',
    credits: 3,
  },
  {
    lessonId: 99902,
    lessonName: 'Advanced API Integration (Mock)',
    teacherId: 'T008',
    teacherName: 'Prof. Faux Data (Mock)',
    lessonTerm: 'Fall 2077',
    capacity: 30,
    enrolledCount: 2,
    description: 'Deep dive into integrating various APIs with mock fallbacks and error handling.',
    credits: 4,
  },
];

// 扩展后端API的Curriculum类型，添加前端显示所需的额外字段
interface ExtendedCurriculum extends Curriculum {
  // Mock data can also include these optional fields
  teacherName?: string; // For displaying teacher name if API provides ID only

  description?: string;
  credits?: number;
}




const CurriculumList: React.FC = () => {
  const [curricula, setCurricula] = useState<ExtendedCurriculum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurricula = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiData = await listAllCurriculums(); // 调用API获取课程数据
        const combinedData = Array.isArray(apiData) 
          ? [...apiData, ...mockCurriculaData] 
          : [...mockCurriculaData];
        setCurricula(combinedData);
      } catch (err) {
        console.error('获取课程列表失败:', err);
        setError('获取课程列表失败，将仅显示模拟数据。');
        setCurricula(mockCurriculaData); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadCurricula();
  }, []);

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'lessonId',
      key: 'id',
    },
    {
      title: '课程名称',
      dataIndex: 'lessonName',
      key: 'name',
    },
    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '学分',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: '授课教师',
      dataIndex: 'teacherName', // Display teacherName from mock or potentially resolved later
      key: 'teacherName',
      render: (text: string, record: ExtendedCurriculum) => text || record.teacherId, // text is record.teacherName, fallback to teacherId
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Curriculum) => (
        <Space size="middle">
          <Link to={`/curriculum/${record.lessonId}`}>
            <Button type="link">查看详情</Button>
          </Link>
          {/* 未来可以添加编辑和删除按钮 */}
          {/* <Link to={`/curriculum/edit/${record.id}`}>
            <Button type="link">编辑</Button>
          </Link>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button> */}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="错误" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>课程列表</Title>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/curriculum/new">
          <Button type="primary">添加新课程</Button>
        </Link>
      </div>
      <Table columns={columns} dataSource={curricula} rowKey="lessonId" />
    </div>
  );
};

export default CurriculumList;
