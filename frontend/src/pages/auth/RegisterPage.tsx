// d:\Github\open-source\LetsCode-AI\frontend\src\pages\auth\RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography, Card, Row, Col, Radio, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser, StudentRegisterRequest, TeacherRegisterRequest } from '../../api/authApi';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');

  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values: any) => {
    setIsLoading(true);
    setError(null);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      let registrationData: StudentRegisterRequest | TeacherRegisterRequest;

      if (selectedRole === 'student') {
        registrationData = {
          name: values.name,
          email: values.email,
          password: values.password,
          role: 'student',
          major: values.major,
          grade: values.grade,
        };
      } else {
        registrationData = {
          name: values.name, // Assuming 'name' for teacher as well, adjust if backend expects TeacherName
          email: values.email,
          password: values.password,
          role: 'teacher',
          department: values.department,
          title: values.title,
        };
      }
      
      const { user, token } = await registerUser(registrationData);
      await login(user, token); // Auto-login after successful registration
      
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="min-h-screen bg-gray-100 p-4">
      <Col xs={24} sm={20} md={16} lg={12} xl={8}>
        <Card className="shadow-xl">
          <div className="text-center mb-8">
            <Title level={2} className="text-blue-600">Create Account</Title>
            <p className="text-gray-500">Join LetsCode AI and start your journey!</p>
          </div>
          
          {error && (
            <Alert message={error} type="error" showIcon closable className="mb-6" onClose={() => setError(null)} />
          )}

          <Form
            form={form}
            name="register_form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            initialValues={{ role: 'student' }}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your Full Name!' }]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon text-gray-400" />} 
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'The input is not valid E-mail!' },
              ]}
            >
              <Input 
                prefix={<MailOutlined className="site-form-item-icon text-gray-400" />} 
                placeholder="Email Address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon text-gray-400" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your Password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon text-gray-400" />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            <Form.Item name="role" label="I am a:" rules={[{ required: true, message: 'Please select your role!' }]}>
              <Radio.Group onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole} optionType="button" buttonStyle="solid">
                <Radio.Button value="student">Student</Radio.Button>
                <Radio.Button value="teacher">Teacher</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {selectedRole === 'student' && (
              <>
                <Form.Item name="major" label="Major" rules={[{ required: true, message: 'Please input your major!' }]}>
                  <Input prefix={<SolutionOutlined className="site-form-item-icon text-gray-400" />} placeholder="e.g., Computer Science" size="large" />
                </Form.Item>
                <Form.Item name="grade" label="Grade/Year" rules={[{ required: true, message: 'Please input your grade or year!' }]}>
                  <Input prefix={<SolutionOutlined className="site-form-item-icon text-gray-400" />} placeholder="e.g., Year 3, Sophomore" size="large" />
                </Form.Item>
              </>
            )}

            {selectedRole === 'teacher' && (
              <>
                <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please input your department!' }]}>
                  <Input prefix={<TeamOutlined className="site-form-item-icon text-gray-400" />} placeholder="e.g., Faculty of Engineering" size="large" />
                </Form.Item>
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input your title!' }]}>
                  <Input prefix={<TeamOutlined className="site-form-item-icon text-gray-400" />} placeholder="e.g., Professor, Lecturer" size="large" />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                loading={isLoading}
                size="large"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterPage;