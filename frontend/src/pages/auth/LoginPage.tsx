// d:\Github\open-source\LetsCode-AI\frontend\src\pages\auth\LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Form, Input, Button, Alert, Typography, Card, Row, Col, Radio } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
// import { useAuth } from '../../contexts/AuthContext';
import { loginStudent } from '../../api/studentApi';
import { loginTeacher } from '../../api/teacherApi'; // 导入教师登录API

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  // const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');

  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values: any) => {
    setIsLoading(true);
    setError(null);
    try {
      let user;
      let token;

      if (userType === 'student') {
        // 调用学生登录API
        const studentData = await loginStudent(values.email, values.password);
        token = studentData?.token; // 从后端获取的 token
        user = {
          id: studentData.id.toString(),
          name: studentData.name,
          email: studentData.email,
          role: 'student',
          major: studentData.major,
          grade: studentData.grade,
        };

        navigate('/student/dashboard', { replace: true });
      } else {
        // 调用教师登录API
        const teacherData = await loginTeacher(values.email, values.password);
        token = teacherData?.token; // 从后端获取的 token
        // user = {
        //   id: teacherData.teacherId.toString(),
        //   name: teacherData.name,
        //   email: teacherData.email,
        //   role: 'teacher',
        //   department: teacherData.department,
        //   title: teacherData.title,
        // };

        navigate('/teacher/dashboard', { replace: true });
      }

      // await login(user, token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || '登录失败，请检查您的邮箱和密码。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="min-h-screen bg-gray-100 p-4">
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card className="shadow-xl">
          <div className="text-center mb-8">
            <Title level={2} className="text-blue-600">LetsCode AI</Title>
            <p className="text-gray-500">欢迎回来！请登录您的账号。</p>
          </div>
          
          {error && (
            <Alert message={error} type="error" showIcon closable className="mb-4" />
          )}

          <Form
            form={form}
            name="login_form"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item className="text-center mb-4">
              <Radio.Group 
                value={userType} 
                onChange={e => setUserType(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="student">学生</Radio.Button>
                <Radio.Button value="teacher">教师</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱！' },
                { type: 'email', message: '请输入有效的邮箱地址！' },
              ]}
            >
              <Input 
                prefix={<MailOutlined className="site-form-item-icon text-gray-400" />} 
                placeholder="邮箱地址"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon text-gray-400" />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                loading={isLoading}
                size="large"
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center text-sm text-gray-500">
            还没有账号？ <Link to="/register" className="text-blue-600 hover:underline">立即注册</Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;