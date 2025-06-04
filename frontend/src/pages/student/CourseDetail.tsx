import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, message, Tabs, List, Tag, Space, Progress } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import type { Curriculum } from '../../api/curriculumApi';
import type { Task } from '../../api/taskApi';
import { listAllCurriculums } from '../../api/curriculumApi';
import { getTasksByLesson } from '../../api/taskApi';

const { TabPane } = Tabs;

const CourseDetail: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [course, setCourse] = useState<Curriculum | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const courses = await listAllCurriculums();
        const currentCourse = courses.find(c => c.lessonId === Number(lessonId));
        if (currentCourse) {
          setCourse(currentCourse);
          // 获取课程作业列表
          const taskList = await getTasksByLesson(Number(lessonId));
          setTasks(taskList);
        } else {
          message.error('未找到课程信息');
          navigate('/student/courses');
        }
      } catch (error) {
        message.error('获取课程信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchCourseDetail();
    }
  }, [lessonId, navigate]);

  if (!course) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card loading={loading} className="shadow-md mb-6">
        <Descriptions title={
          <Space>
            <BookOutlined />
            {course.lessonName}
          </Space>
        } bordered>
          <Descriptions.Item label="课程ID">{course.lessonId}</Descriptions.Item>
          <Descriptions.Item label="学期">{course.lessonTerm}</Descriptions.Item>
          <Descriptions.Item label="教师ID">{course.teacherId}</Descriptions.Item>
          <Descriptions.Item label="课程容量">
            <Progress
              percent={Math.round((course.enrolledCount / course.capacity) * 100)}
              size="small"
              format={() => `${course.enrolledCount}/${course.capacity}`}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="shadow-md">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <ClockCircleOutlined />
                作业列表
              </span>
            }
            key="1"
          >
            <List
              itemLayout="horizontal"
              dataSource={tasks}
              renderItem={task => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      key="view"
                      onClick={() => navigate(`/student/assignment/${task.taskId}`)}
                    >
                      查看作业
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={task.taskName}
                    description={task.taskContent}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CourseDetail;
