import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, Alert, message } from 'antd';
import { searchStudents, Student } from '../../api/studentApi';

const { Title, Text } = Typography;

const mockStudents: Student[] = [
  {
    id: 88801,
    name: 'Alice Wonderland (Mock)',
    email: 'alice.mock@example.com',
    major: 'Imaginative Studies',
    grade: 'Year 3',
  },
  {
    id: 88802,
    name: 'Bob The Builder (Mock)',
    email: 'bob.mock@example.com',
    major: 'Constructive Engineering',
    grade: 'Year 2',
  },
];

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // Pass empty object to searchStudents to fetch all students
        const fetchedStudents = await searchStudents({}); 
        const apiStudents = Array.isArray(fetchedStudents) ? fetchedStudents : [];
        setStudents([...apiStudents, ...mockStudents]);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to load students from the API. Displaying mock data only.');
        setStudents([...mockStudents]); 
        message.error('无法从API加载学生列表，将仅显示模拟数据。');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <Spin tip="Loading students..." style={{ display: 'block', marginTop: '20px' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Student List</Title>
      {error && !loading && (
        <Alert message={error} type="warning" showIcon style={{ marginBottom: '20px' }} />
      )}
      {students.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={students}
          renderItem={student => (
            <List.Item>
              <Card title={student.name} hoverable>
                <p><Text strong>ID:</Text> {student.id}</p>
                <p><Text strong>Email:</Text> {student.email}</p>
                <p><Text strong>Major:</Text> {student.major}</p>
                <p><Text strong>Grade:</Text> {student.grade}</p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        !loading && <Text>No students to display.</Text>
      )}
    </div>
  );
};

export default StudentListPage;
