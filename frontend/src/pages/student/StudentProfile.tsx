import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { UserOutlined, MailOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { updateStudentInfo, updateStudentPassword } from '../../api/studentApi';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        major: user.major,
        grade: user.grade,
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values: any) => {
    try {
      setLoading(true);
      await updateStudentInfo({
        ...values,
        id: user?.id as number,
      });
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (values: any) => {
    try {
      setLoading(true);
      await updateStudentPassword(
        user?.id as number,
        values.oldPassword,
        values.newPassword
      );
      message.success('密码修改成功');
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Card title="个人信息" className="mb-6 shadow-md">
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
              </Form.Item>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>
              <Form.Item
                name="major"
                label="专业"
                rules={[{ required: true, message: '请输入专业' }]}
              >
                <Input prefix={<BookOutlined />} placeholder="请输入专业" />
              </Form.Item>
              <Form.Item
                name="grade"
                label="年级"
                rules={[{ required: true, message: '请输入年级' }]}
              >
                <Input prefix={<TeamOutlined />} placeholder="请输入年级" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  更新信息
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>

        <Card title="修改密码" className="shadow-md">
          <Spin spinning={loading}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item
                name="oldPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password placeholder="请输入当前密码" />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能小于6位' }
                ]}
              >
                <Input.Password placeholder="请输入新密码" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="确认新密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请确认新密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
