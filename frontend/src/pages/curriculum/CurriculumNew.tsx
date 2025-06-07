import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message, Space } from 'antd';
import { Card } from 'antd';
import { Typography } from 'antd';
import { createCurriculum, Curriculum } from '../../api/curriculumApi';

const { Title } = Typography;

interface CurriculumForm {
  lessonName: string;
  teacherId: string;
  lessonTerm: string;
  capacity: number;
}



const CurriculumNew: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: CurriculumForm) => {
    setSubmitting(true);
    try {
      // 构造完整的 Curriculum 类型
      const curriculum: Curriculum = {
        lessonId: 0, // 后端生成
        lessonName: values.lessonName,
        teacherId: values.teacherId,
        lessonTerm: values.lessonTerm,
        capacity: values.capacity,
        enrolledCount: 0 // 新课程默认0
      };
      await createCurriculum(curriculum);
      message.success('课程创建成功！');
      navigate('/curriculum');
    } catch (error) {
      console.error('创建课程失败:', error);
      message.error('创建课程失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/curriculum');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>创建新课程</Title>
          <Button onClick={handleCancel}>返回列表</Button>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              capacity: 100,
            }}
          >
            <Form.Item
              name="lessonName"
              label="课程名称"
              rules={[{ required: true, message: '请输入课程名称' }]}
            >
              <Input placeholder="请输入课程名称" />
            </Form.Item>

            <Form.Item
              name="teacherId"
              label="授课教师ID"
              rules={[{ required: true, message: '请输入授课教师ID' }]}
            >
              <Input placeholder="请输入授课教师ID" />
            </Form.Item>

            <Form.Item
              name="lessonTerm"
              label="学期"
              rules={[{ required: true, message: '请输入学期' }]}
            >
              <Input placeholder="例如：2025-2026-1" />
            </Form.Item>

            <Form.Item
              name="capacity"
              label="课程容量"
              rules={[{ required: true, message: '请输入课程容量' }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  创建课程
                </Button>
                <Button onClick={handleCancel}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CurriculumNew;
