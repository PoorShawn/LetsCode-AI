import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, Alert, message } from 'antd';
import { getAllTeachers, Teacher } from '../../api/teacherApi';

const { Title, Text } = Typography;

const mockTeachers: Teacher[] = [
  {
    teacherId: 99901,
    teacherName: 'Dr. Mockson Placeholder',
    department: 'Unreal University',
    teacherEmail: 'dr.mockson@example.com',
    title: 'Professor of Mockology',
  },
  {
    teacherId: 99902,
    teacherName: 'Ms. Faux Data',
    department: 'Simulated Studies',
    teacherEmail: 'ms.faux@example.com',
    title: 'Lecturer in Test Data',
  },
];

const TeacherListPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const fetchedTeachers = await getAllTeachers();
        // Ensure fetchedTeachers is an array, as API might return unexpected structure
        const apiTeachers = Array.isArray(fetchedTeachers) ? fetchedTeachers : [];
        setTeachers([...apiTeachers, ...mockTeachers]);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch teachers:', err);
        setError('Failed to load teachers from the API. Displaying mock data only.');
        // In case of API error, still show mock data
        setTeachers([...mockTeachers]); 
        message.error('无法从API加载教师列表，将仅显示模拟数据。');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) {
    return <Spin tip="Loading teachers..." style={{ display: 'block', marginTop: '20px' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Teacher List</Title>
      {error && !loading && (
        <Alert message={error} type="warning" showIcon style={{ marginBottom: '20px' }} />
      )}
      {teachers.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={teachers}
          renderItem={teacher => (
            <List.Item>
              <Card title={teacher.teacherName} hoverable>
                <p><Text strong>ID:</Text> {teacher.teacherId}</p>
                <p><Text strong>Title:</Text> {teacher.title}</p>
                <p><Text strong>Department:</Text> {teacher.department}</p>
                <p><Text strong>Email:</Text> {teacher.teacherEmail}</p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        !loading && <Text>No teachers to display.</Text>
      )}
    </div>
  );
};

export default TeacherListPage;
