import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message, Spin, Alert, Card, Space, Typography } from 'antd';
import { listAllCurriculums, updateCurriculum, Curriculum } from '../../api/curriculumApi';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

interface CurriculumEditFormValues {
  lessonName: string;
  teacherId: string; // Assuming teacherId might be updatable by an authorized user
  lessonTerm: string;
  capacity: number;
}

const CurriculumEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form] = Form.useForm<CurriculumEditFormValues>();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalCurriculum, setOriginalCurriculum] = useState<Curriculum | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Course ID is missing.');
      setLoading(false);
      return;
    }
    setLoading(true);
    listAllCurriculums()
      .then((data) => {
        const found = data.find((item) => String(item.lessonId) === String(id));
        if (found) {
          if (user?.role !== 'teacher' || user?.id !== found.teacherId) {
            setError('You are not authorized to edit this course.');
            setOriginalCurriculum(null);
          } else {
            setOriginalCurriculum(found);
            form.setFieldsValue({
              lessonName: found.lessonName,
              teacherId: found.teacherId,
              lessonTerm: found.lessonTerm,
              capacity: found.capacity,
            });
          }
        } else {
          setError('Course not found.');
        }
      })
      .catch((err) => {
        setError('Failed to fetch course details.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id, form, user]);

  const onFinish = async (values: CurriculumEditFormValues) => {
    if (!originalCurriculum) {
      message.error('Original course data is not available.');
      return;
    }
    setSubmitting(true);
    const updatedCurriculumData: Curriculum = {
      ...originalCurriculum, // Retain lessonId and enrolledCount
      lessonName: values.lessonName,
      teacherId: values.teacherId,
      lessonTerm: values.lessonTerm,
      capacity: values.capacity,
    };

    try {
      await updateCurriculum(updatedCurriculumData);
      message.success('Course updated successfully!');
      navigate(`/curriculum/${originalCurriculum.lessonId}`);
    } catch (err) {
      message.error('Failed to update course. Please try again.');
      console.error('Update course error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin tip="Loading course details..." style={{ display: 'block', marginTop: '20px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon style={{ margin: '20px' }} />;
  }

  if (!originalCurriculum) {
    // This case should ideally be covered by the error state if not found or unauthorized
    return <Alert message="Course data could not be loaded." type="warning" showIcon style={{ margin: '20px' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Edit Course: {originalCurriculum.lessonName}</Title>
          <Button onClick={() => navigate(`/curriculum/${id}`)}>Cancel</Button>
        </div>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              lessonName: originalCurriculum.lessonName,
              teacherId: originalCurriculum.teacherId,
              lessonTerm: originalCurriculum.lessonTerm,
              capacity: originalCurriculum.capacity,
            }}
          >
            <Form.Item label="Lesson ID">
              <Input value={originalCurriculum.lessonId} disabled />
            </Form.Item>
            <Form.Item
              name="lessonName"
              label="Lesson Name"
              rules={[{ required: true, message: 'Please input the lesson name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teacherId"
              label="Teacher ID"
              rules={[{ required: true, message: 'Please input the teacher ID!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lessonTerm"
              label="Lesson Term"
              rules={[{ required: true, message: 'Please input the lesson term!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[{ required: true, message: 'Please input the capacity!' }, { type: 'number', min: 1, message: 'Capacity must be at least 1' }]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Save Changes
                </Button>
                <Button onClick={() => navigate(`/curriculum/${id}`)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CurriculumEdit;
