import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { List, Card, Typography, Spin, Alert, message, Button, Form, InputNumber, Input, Modal } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { LearningAnalytics, getCodingBySession, evaluateCoding } from '../../api/analyticsApi';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const mockSessionAnalytics: LearningAnalytics[] = [
  {
    CodingID: 66601,
    CodingContent: `function mockExample(num) {
  return num * 2;
}
console.log(mockExample(5)); // Mock submission 1`,
    SubmitTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    SessionID: 0, // Placeholder, will be dynamic
    score: 70,
    feedback: 'This is a decent attempt for a mock submission. Keep practicing! (Mock)',
  },
  {
    CodingID: 66602,
    CodingContent: `const anotherMock = () => {
  alert("Mock code submission 2!");
};
anotherMock();`,
    SubmitTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    SessionID: 0, // Placeholder
    // No score or feedback yet for this mock
  },
];

interface EvaluateFormValues {
  score: number;
  comment: string;
}

const SessionAnalyticsPage: React.FC = () => {
  const { sessionId: sessionIdFromParams, teacherId: teacherIdFromParams } = useParams<{ sessionId: string; teacherId: string }>();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<LearningAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<LearningAnalytics | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [viewCodeModalVisible, setViewCodeModalVisible] = useState<boolean>(false);
  const [currentCodeView, setCurrentCodeView] = useState<string>('');

  const [form] = Form.useForm<EvaluateFormValues>();

  const sessionId = Number(sessionIdFromParams);
  const teacherId = Number(teacherIdFromParams);

  const fetchSubmissions = useCallback(async () => {
    if (!user || isNaN(sessionId) || isNaN(teacherId)) {
      setError('User not authenticated or Session/Teacher ID is invalid.');
      setLoading(false);
      setSubmissions(mockSessionAnalytics.map(s => ({...s, SessionID: sessionId})));
      return;
    }
    setLoading(true);
    try {
      // Assuming teacher role is implicit or handled by backend based on teacherId
      const fetchedSubmissions = await getCodingBySession(sessionId, user.id, 'teacher'); 
      const apiSubmissions = Array.isArray(fetchedSubmissions) ? fetchedSubmissions : [];
      const combined = [...apiSubmissions, ...mockSessionAnalytics.filter(ms => !apiSubmissions.find(as => as.CodingID === ms.CodingID)).map(s => ({...s, SessionID: sessionId}))];
      setSubmissions(combined.sort((a,b) => new Date(b.SubmitTime).getTime() - new Date(a.SubmitTime).getTime()));
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch coding submissions:', err);
      setError(`Failed to load submissions: ${err.message}. Displaying mock data.`);
      setSubmissions(mockSessionAnalytics.map(s => ({...s, SessionID: sessionId})).sort((a,b) => new Date(b.SubmitTime).getTime() - new Date(a.SubmitTime).getTime()));
      message.error('加载代码提交记录失败，将显示模拟数据。');
    } finally {
      setLoading(false);
    }
  }, [user, sessionId, teacherId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleOpenModal = (submission: LearningAnalytics) => {
    setSelectedSubmission(submission);
    form.setFieldsValue({
      score: submission.score,
      comment: submission.feedback,
    });
    setIsModalVisible(true);
  };

  const handleFormSubmit = async (values: EvaluateFormValues) => {
    if (!selectedSubmission || !user || user.role !== 'teacher' || user.id !== teacherId) {
      message.error('You are not authorized to evaluate this submission or data is missing.');
      return;
    }
    try {
      await evaluateCoding(selectedSubmission.CodingID, teacherId, values.score, values.comment);
      message.success('Evaluation submitted successfully!');
      setIsModalVisible(false);
      fetchSubmissions(); // Refresh the list
    } catch (err: any) {
      message.error(`Evaluation failed: ${err.message}`);
    }
  };
  
  const handleViewCode = (code: string) => {
    setCurrentCodeView(code);
    setViewCodeModalVisible(true);
  };

  if (loading) {
    return <Spin tip="Loading submissions..." style={{ display: 'block', marginTop: '20px' }} />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon style={{ margin: '20px' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Code Submissions for Session ID: {sessionId}</Title>
      <Paragraph>Teacher ID: {teacherId}</Paragraph>
      <Link to={`/teachers`}> 
        <Button type="default" style={{ marginBottom: '20px' }}>Back to Teacher List (Placeholder)</Button>
      </Link>
      {submissions.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
          dataSource={submissions}
          renderItem={item => (
            <List.Item key={item.CodingID}>
              <Card 
                title={`Submission ID: ${item.CodingID} ${item.CodingID >= 66601 && item.CodingID <= 66605 ? '(Mock)' : ''}`}
                actions={user && user.role === 'teacher' && user.id === teacherId ? [<Button type="link" onClick={() => handleOpenModal(item)}>Evaluate</Button>] : []}
              >
                <Paragraph><Text strong>Submitted:</Text> {new Date(item.SubmitTime).toLocaleString()}</Paragraph>
                <Button type="link" onClick={() => handleViewCode(item.CodingContent)} style={{paddingLeft:0, marginBottom: '8px'}}>View Submitted Code</Button>
                {item.score !== undefined && <Paragraph><Text strong>Score:</Text> {item.score}</Paragraph>}
                {item.feedback && <Paragraph><Text strong>Feedback:</Text> {item.feedback}</Paragraph>}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Text>No code submissions found for this session.</Text>
      )}

      {selectedSubmission && (
        <Modal
          title={`Evaluate Submission ID: ${selectedSubmission.CodingID}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null} // Footer handled by Form
        >
          <Paragraph strong>Submitted Code:</Paragraph>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
            {selectedSubmission.CodingContent}
          </pre>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="score" label="Score (0-100)" rules={[{ type: 'number', min: 0, max: 100 }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="comment" label="Feedback/Comment">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit Evaluation</Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Modal title="View Code Submission" open={viewCodeModalVisible} onCancel={() => setViewCodeModalVisible(false)} footer={null} width={800}>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '60vh', overflowY: 'auto' }}>{currentCodeView}</pre>
      </Modal>
    </div>
  );
};

export default SessionAnalyticsPage;