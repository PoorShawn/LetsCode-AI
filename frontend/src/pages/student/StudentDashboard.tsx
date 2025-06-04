// d:\Github\open-source\LetsCode-AI\frontend\src\pages\student\StudentDashboard.tsx
import React, { useState } from 'react';
import { Card, Typography, Avatar, Tag, Row, Col, Button, List, Table, Space, Modal, Spin, message } from 'antd';
import { UserOutlined, BookOutlined, ExperimentOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LearningReport from './LearningReport';

// 模拟课程数据
const courses = [
  { id: 1, name: '人工智能基础', teacher: '张老师', progress: 0.7 },
  { id: 2, name: '数据结构与算法', teacher: '李老师', progress: 0.4 },
];

// 模拟作业数据
const assignments = [
  { id: 1, title: '线性回归编程作业', due: '2025-06-10', status: '待完成' },
  { id: 2, title: '算法分析报告', due: '2025-06-12', status: '已提交' },
  { id: 3, title: 'AI课程小测', due: '2025-06-15', status: '已批改' },
];

const assignmentStatusColor: Record<string, string> = {
  '待完成': 'orange',
  '已提交': 'blue',
  '已批改': 'green',
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reportVisible, setReportVisible] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAnalytics = async () => {
    setLoading(true);
    setReportVisible(true); // 立即显示Modal，但显示loading状态
    
    try {
      const response = await fetch('http://localhost:5005/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `基于数据库所有内容，生成分析结果` })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      // 解析API返回的Markdown格式文本，提取各个部分的内容
      const sections = data.message.split('####').filter(Boolean);
      
      const reportData = {
        codeQualityScore: parseInt(data.message.match(/代码质量处于中等水平.*?(\d+)\s*分/)?.[1] || '0'),
        staticAnalysis: {
          syntaxErrors: extractListItems(sections.find(s => s.includes('语法错误')) || ''),
          codeLogic: extractListItems(sections.find(s => s.includes('代码逻辑')) || '')
        },
        knowledgePoints: extractListItems(sections.find(s => s.includes('知识点掌握情况')) || ''),
        aiDialogue: sections.find(s => s.includes('AI 对话情况'))?.replace('AI 对话情况', '').trim() || '',
        codeCompletion: {
          frequency: sections.find(s => s.includes('使用频率'))?.replace('使用频率', '').trim() || '',
          adoption: sections.find(s => s.includes('采纳情况'))?.replace('采纳情况', '').trim() || ''
        },
        learningAdvice: extractListItems(sections.find(s => s.includes('个性化未来学习建议')) || ''),
        trends: {
          timeRange: sections.find(s => s.includes('行为时段'))?.match(/行为时段：(.*?)(?=\n|$)/)?.[1] || '',
          lastCode: sections.find(s => s.includes('最后一次'))?.match(/最后一次.*?代码内容：(.*?)(?=\n|$)/)?.[1] || '',
          tabSuggestions: sections.find(s => s.includes('tab 提示内容'))?.match(/tab 提示内容：(.*?)(?=\n|$)/)?.[1] || '',
          userBehavior: sections.find(s => s.includes('用户采纳行为'))?.match(/用户采纳行为：(.*?)(?=\n|$)/)?.[1] || ''
        }
      };
      
      setReportData(reportData);
    } catch (error) {
      console.error("Error fetching analytics report: ", error);
      message.error('获取分析报告失败，请稍后重试');
      setReportVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // 辅助函数：从文本中提取列表项
  const extractListItems = (text: string): string[] => {
    const items = text.match(/[-•]\s*(.*?)(?=\n|$)/g) || [];
    return items.map(item => item.replace(/^[-•]\s*/, '').trim());
  };

  const { Title, Text } = Typography;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6 text-blue-700">学生仪表盘</Title>
      <Row gutter={[24, 24]}>
        {/* 左侧个人信息 */}
        <Col xs={24} md={8}>
          <Card className="shadow-lg mb-6">
            <div className="flex flex-col items-center">
              <Avatar size={80} icon={<UserOutlined />} className="bg-blue-500 mb-4" />
              <Title level={4}>{user?.name}</Title>
              <Text type="secondary">{user?.email}</Text>
              <div className="mt-2">
                <Tag color="blue">角色：学生</Tag>
              </div>
            </div>
            <div className="mt-6">
              <p><b>学号/ID：</b>{user?.id}</p>
              <p><b>专业：</b>{user?.major || '暂无'}</p>
              <p><b>年级：</b>{user?.grade || '暂无'}</p>
            </div>
          </Card>
        </Col>
        {/* 右侧课程和作业 */}
        <Col xs={24} md={16}>
          <Row gutter={[24, 24]}>
            {/* 我的课程 */}
            <Col xs={24}>
              <Card
                title={<Space><BookOutlined /> 我的课程</Space>}
                extra={<Button type="link" onClick={() => navigate('/student/courses')}>全部课程</Button>}
                className="shadow-md mb-6"
              >
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={courses}
                  renderItem={course => (
                    <List.Item>
                      <Card hoverable>
                        <Title level={5}>{course.name}</Title>
                        <Text type="secondary">授课教师：{course.teacher}</Text>
                        <div className="mt-2">
                          <Tag color="blue">{Math.round(course.progress * 100)}% 已完成</Tag>
                        </div>
                        <Button 
                          type="primary" 
                          size="small" 
                          className="mt-2"
                          onClick={() => navigate(`/student/course/${course.id}`)}
                        >
                          进入课程
                        </Button>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            {/* 我的作业 */}
            <Col xs={24}>
              <Card
                title={<Space><ExperimentOutlined /> 我的作业</Space>}
                extra={<Button type="link" onClick={() => navigate('/student/assignments')}>全部作业</Button>}
                className="shadow-md"
              >
                <Table
                  size="small"
                  dataSource={assignments}
                  rowKey="id"
                  pagination={false}
                  columns={[
                    { title: '标题', dataIndex: 'title', key: 'title' },
                    { title: '截止日期', dataIndex: 'due', key: 'due' },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => (
                        <Tag color={assignmentStatusColor[status] || 'default'}>{status}</Tag>
                      ),
                    },
                    {
                      title: '操作',
                      key: 'action',
                      render: (_, record) => (
                        <>
                        <Button 
                          type="link" 
                          size="small" 
                          // onClick={() => navigate(`/student/assignment/${record.id}`)}
                          onClick={() => navigate('/student/coder')}
                        >
                          进入作业
                        </Button>
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => checkAnalytics()}
                          loading={loading}
                          disabled={loading}
                        >
                          {loading ? '生成报告中' : '查看分析报告'}
                        </Button>
                        </>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 学情报告弹窗 */}
      <Modal
        title={
          <Space>
            学情报告
            {loading && <LoadingOutlined style={{ marginLeft: 8 }} />}
          </Space>
        }
        open={reportVisible}
        onCancel={() => {
          if (!loading) {
            setReportVisible(false);
            setReportData(null);
          }
        }}
        width={1200}
        footer={null}
        maskClosable={!loading}
        closable={!loading}
      >
        {loading ? (
          <div className="py-32 text-center">
            <Spin size="large" />
            <div className="mt-4 text-gray-600">
              正在生成分析报告，请稍候...
              <br />
              <span className="text-sm">这可能需要一些时间</span>
            </div>
          </div>
        ) : (
          reportData && <LearningReport report={reportData} />
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;