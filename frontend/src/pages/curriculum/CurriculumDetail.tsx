import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spin, Alert, Button, Descriptions, Typography, message, Modal, Space, List, Card, Table } from 'antd';
import { listAllCurriculums, enrollStudent, withdrawStudent, deleteCurriculum, Curriculum } from '../../api/curriculumApi';
import { getEnrollmentInfoByTeacher, EnrollmentInfo } from '../../api/enrollmentApi'; // Added enrollment API and type
import { getTasksByLesson, Task, deleteTask as deleteTaskApiCall } from '../../api/taskApi'; // Added task API and types
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;
const { confirm } = Modal;

const mockEnrolledStudents: EnrollmentInfo[] = [
  {
    enrollmentId: 9998,
    studentId: 77701,
    studentName: 'Eva Core (Mock Student)',
    studentEmail: 'eva.mock@example.com',
    lessonId: 0, // Will be overridden by current lessonId or ignored if not relevant for display
    lessonName: 'Current Course (Mock Enrollment)',
    lessonTerm: 'N/A',
  },
  {
    enrollmentId: 9999,
    studentId: 77702,
    studentName: 'Leo Placeholder (Mock Student)',
    studentEmail: 'leo.mock@example.com',
    lessonId: 0, // Will be overridden by current lessonId or ignored if not relevant for display
    lessonName: 'Current Course (Mock Enrollment)',
    lessonTerm: 'N/A',
  },
];

const CurriculumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const [enrolling, setEnrolling] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [enrolledStudentsList, setEnrolledStudentsList] = useState<EnrollmentInfo[]>([]);
  const [loadingEnrolledStudents, setLoadingEnrolledStudents] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);

  // 检查学生是否已选该课程（模拟：实际应从后端获取学生已选课程列表）
  useEffect(() => {
    setLoading(true);
    setError(null);
    listAllCurriculums()
      .then((data) => {
        const found = data.find((item) => String(item.lessonId) === String(id));
        if (found) {
          setCurriculum(found);
        } else {
          setError('未找到对应课程');
        }
      })
      .catch((err) => {
        setError('获取课程详情失败');
        console.error(err);
      })
      .finally(() => setLoading(false));

    // Fetch enrolled students if the user is the teacher of this course
    if (user?.role === 'teacher' && curriculum && user.id === curriculum.teacherId) {
      setLoadingEnrolledStudents(true);
      getEnrollmentInfoByTeacher(Number(curriculum.teacherId), Number(user.id), user.role)
        .then(enrollments => {
          // Filter enrollments for the current lessonId, as the API might return all for the teacher
          let currentLessonEnrollments = enrollments.filter(e => e.lessonId === curriculum.lessonId);
          // Ensure mock students have the current lessonId if we want to be strict, or adjust display
          const displayMockStudents = mockEnrolledStudents.map(ms => ({ ...ms, lessonId: curriculum.lessonId, lessonName: curriculum.lessonName, lessonTerm: curriculum.lessonTerm }));
          setEnrolledStudentsList([...currentLessonEnrollments, ...displayMockStudents]);
        })
        .catch(err => {
          console.error('Failed to fetch enrolled students:', err);
          message.error('无法从API加载已选学生列表，将仅显示模拟数据。');
          // Fallback to mock data, ensuring they appear relevant to the current course context
          const displayMockStudents = mockEnrolledStudents.map(ms => ({ ...ms, lessonId: curriculum.lessonId, lessonName: curriculum.lessonName, lessonTerm: curriculum.lessonTerm }));
          setEnrolledStudentsList(displayMockStudents);
        })
        .finally(() => setLoadingEnrolledStudents(false));
    }

    // Fetch tasks if the user is the teacher of this course
    if (user?.role === 'teacher' && curriculum && String(user.id) === String(curriculum.teacherId)) {
      setLoadingTasks(true);
      getTasksByLesson(curriculum.lessonId)
        .then(data => {
          setTasks(data);
        })
        .catch(err => {
          console.error('Failed to fetch tasks:', err);
          message.error('无法加载作业列表');
        })
        .finally(() => setLoadingTasks(false));
    }
  }, [id, user, curriculum?.lessonId]); // Depend on curriculum.lessonId to ensure re-fetch if curriculum object changes but ID remains (less likely but safer)

  const handleEnroll = async () => {
    if (!user?.id || !curriculum) return;
    setEnrolling(true);
    try {
      await enrollStudent(Number(user.id), Number(curriculum.lessonId));
      message.success('报名成功！');
      setEnrolled(true);
    } catch (e) {
      message.error('报名失败');
    } finally {
      setEnrolling(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user?.id || !curriculum) return;
    setEnrolling(true);
    try {
      await withdrawStudent(Number(user.id), Number(curriculum.lessonId));
      message.success('退选成功！');
      setEnrolled(false);
    } catch (e) {
      message.error('退选失败');
    } finally {
      setEnrolling(false);
    }
  };

  const handleDeleteCourse = () => {
    if (!curriculum?.lessonId || !user?.id || !user.role) return;

    confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        setDeleteLoading(true);
        try {
          await deleteCurriculum(curriculum.lessonId); // API expects number ID
          message.success('Course deleted successfully!');
          navigate('/curriculum');
        } catch (err) {
          message.error('Failed to delete course. Please try again.');
          console.error('Delete course error:', err);
        }
        setDeleteLoading(false);
      },
    });
  };

  const handleEditCourse = () => {
    if (!curriculum?.lessonId) return;
    navigate(`/curriculum/edit/${curriculum.lessonId}`);
  };

  const handleCreateTask = () => {
    if (!curriculum?.lessonId) return;
    // Navigate to a new route for creating tasks, passing lessonId
    navigate(`/curriculum/${curriculum.lessonId}/tasks/new`);
  };

  const handleDeleteTask = (taskId: number) => {
    if (!user?.id || user.role !== 'teacher') return;
    Modal.confirm({
      title: '您确定要删除此作业吗?',
      content: '此操作无法撤销。',
      okText: '是的，删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteTaskApiCall(taskId, Number(user.id));
          message.success('作业删除成功!');
          // Refresh tasks list
          setTasks(prevTasks => prevTasks.filter(task => task.taskId !== taskId));
        } catch (err) {
          message.error('删除作业失败，请重试。');
          console.error('Delete task error:', err);
        }
      },
    });
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  if (!curriculum) {
    return <Alert message="未找到课程信息" type="warning" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button onClick={() => navigate('/curriculum')}>返回课程列表</Button>
        <Card title={curriculum?.lessonName || '课程详情'}>
          <Title level={3}>{curriculum.lessonName}</Title>
          <Descriptions>
            <Descriptions.Item label="课程ID">{curriculum.lessonId}</Descriptions.Item>
            <Descriptions.Item label="授课教师ID">{curriculum.teacherId}</Descriptions.Item>
            <Descriptions.Item label="学期">{curriculum.lessonTerm}</Descriptions.Item>
            <Descriptions.Item label="容量">{curriculum.capacity}</Descriptions.Item>
            <Descriptions.Item label="已选人数">{curriculum.enrolledCount}</Descriptions.Item>
          </Descriptions>
          {/* 学生角色显示报名/退选按钮 */}
          {user?.role === 'student' && (
            <Space style={{ marginTop: '20px' }}>
              <Button 
                type={enrolled ? "default" : "primary"} 
                onClick={enrolled ? handleWithdraw : handleEnroll}
                loading={enrolling}
              >
                {enrolled ? '退选课程' : '报名课程'}
              </Button>
            </Space>
          )}
          {user?.role === 'teacher' && curriculum?.teacherId === user.id && (
            <div style={{ marginTop: '10px' }}>
              <Button 
                type="primary" 
                onClick={handleEditCourse} 
                style={{ marginRight: '10px' }}
              >
                Edit Course
              </Button>
              <Button 
                danger 
                onClick={handleDeleteCourse} 
                loading={deleteLoading}
              >
                Delete Course
              </Button>
            </div>
          )}
        </Card>

        <Button type="primary" onClick={() => navigate('/curriculum')} style={{ marginTop: '20px' }}>
          返回课程列表
        </Button>

        {user?.role === 'teacher' && curriculum?.teacherId === user.id && (
          <Card title="Enrolled Students" style={{ marginTop: '20px' }}>
            {loadingEnrolledStudents ? (
              <Spin tip="Loading students..." />
            ) : enrolledStudentsList.length > 0 ? (
              <Table
                dataSource={enrolledStudentsList}
                columns={[
                  { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
                  { title: 'Name', dataIndex: 'studentName', key: 'studentName' },
                  { title: 'Email', dataIndex: 'studentEmail', key: 'studentEmail' },
                ]}
                rowKey="enrollmentId"
                pagination={false}
              />
            ) : (
              <p>No students enrolled in this course yet.</p>
            )}
          </Card>
        )}

        {/* Tasks Section for Teacher */}
        {user?.role === 'teacher' && curriculum?.teacherId === user.id && (
          <Card 
            title="Course Tasks"
            style={{ marginTop: '20px' }} 
            extra={<Button type="primary" onClick={handleCreateTask}>创建新作业</Button>}
          >
            {loadingTasks ? (
              <Spin tip="Loading tasks..." />
            ) : tasks.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={tasks}
                renderItem={(task: Task) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => navigate(`/curriculum/${curriculum.lessonId}/tasks/edit/${task.taskId}`)}>编辑</Button>,
                      <Button type="link" danger onClick={() => handleDeleteTask(task.taskId)}>删除</Button>,
                      <Button type="link" onClick={() => navigate(`/task/${task.taskId}/history/${curriculum.teacherId}`)}>查看记录</Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<Link to={`#`}>{task.taskName}</Link>} // Link to task detail page in future if needed
                      description={task.description.substring(0, 100) + (task.description.length > 100 ? '...' : '')}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <p>此课程还没有作业。</p>
            )}
          </Card>
        )}
      </Space>
    </div>
  );
};

export default CurriculumDetail;
