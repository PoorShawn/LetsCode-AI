import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Card, Typography, Spin, Alert, message, Button } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { getEnrollmentsByStudent, Enrollment } from '../../api/enrollmentApi';
import { listAllCurriculums, Curriculum } from '../../api/curriculumApi';
import { getTasksByStudent, Task } from '../../api/taskApi'; // Added task API and type

const { Title, Text } = Typography;

interface EnrolledCourseDetail extends Curriculum {
  enrollmentDetails: Enrollment;
}

const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseDetail[]>([]);
  const [studentTasks, setStudentTasks] = useState<Task[]>([]); // Added state for student tasks
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'student') {
      setLoading(true);
      Promise.all([
        getEnrollmentsByStudent(Number(user.id), Number(user.id), user.role),
        listAllCurriculums(),
        getTasksByStudent(Number(user.id)), // Fetch student tasks
      ])
        .then(([enrollments, allCourses, tasks]) => { // Destructure tasks
          setStudentTasks(tasks); // Set student tasks state
          const enrichedEnrollments = enrollments
            .map(enrollment => {
              const courseDetail = allCourses.find(course => course.lessonId === enrollment.lessonId);
              if (courseDetail) {
                return { ...courseDetail, enrollmentDetails: enrollment };
              }
              return null;
            })
            .filter(Boolean) as EnrolledCourseDetail[];
          setEnrolledCourses(enrichedEnrollments);
        })
        .catch(err => {
          console.error('Failed to fetch enrolled courses:', err);
          setError('Failed to load your courses. Please try again.');
          message.error('无法加载您的课程列表');
        })
        .finally(() => setLoading(false));
    } else if (user && user.role !== 'student'){
      setError('This page is for students only.');
      setLoading(false);
    } else {
      setLoading(false); // Should be handled by ProtectedRoute, but as a fallback
    }
  }, [user]);

  if (loading) {
    return <Spin tip="Loading your courses..." style={{ display: 'block', marginTop: '20px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon style={{ margin: '20px' }} />;
  }

  if (!user || user.role !== 'student') {
    return <Alert message="You must be logged in as a student to view this page." type="warning" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>My Enrolled Courses</Title>
      {enrolledCourses.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={enrolledCourses}
          renderItem={course => (
            <List.Item>
              <Card
                title={course.lessonName}
                hoverable
                actions={[
                  <Link to={`/curriculum/${course.lessonId}`}>
                    <Button type="link">View Details</Button>
                  </Link>
                ]}
              >
                <Text strong>Term:</Text> {course.lessonTerm}<br />
                <Text strong>Teacher ID:</Text> {course.teacherId} <br />
                {/* Add more details if needed, e.g., from course.enrollmentDetails */}
                <div style={{ marginTop: '10px' }}>
                  <Text strong>Tasks for this course:</Text>
                  {(() => {
                    const courseTasks = studentTasks.filter(task => task.lessonId === course.lessonId);
                    if (courseTasks.length > 0) {
                      return (
                        <List
                          size="small"
                          dataSource={courseTasks}
                          renderItem={task => (
                            <List.Item
                              actions={[
                                <Link to={`/task/${task.taskId}/chat`}>
                                  <Button type="link" size="small">Chat with AI</Button>
                                </Link>
                              ]}
                            >
                              <Text>{task.taskName}</Text>
                            </List.Item>
                          )}
                        />
                      );
                    } else {
                      return <Text> No tasks assigned for this course yet.</Text>;
                    }
                  })()}
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Text>You are not currently enrolled in any courses.</Text>
      )}
    </div>
  );
};

export default MyCourses;
