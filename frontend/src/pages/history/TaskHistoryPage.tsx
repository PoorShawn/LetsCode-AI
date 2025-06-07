import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { List, Card, Typography, Spin, Alert, message, Button, Divider } from 'antd';
import { getHistoryByTask, History } from '../../api/historyApi';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;

const mockTaskHistory: History[] = [
  {
    historyId: 99901,
    sessionId: 55501, // Mock session 1
    senderId: 101,
    senderType: 'student',
    content: 'This is a mock student message for this task. (Mock)',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    historyId: 99902,
    sessionId: 55501, // Mock session 1
    senderId: -1,
    senderType: 'ai',
    content: 'This is a mock AI response to the student. (Mock)',
    time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    historyId: 99903,
    sessionId: 55502, // Mock session 2
    senderId: 102,
    senderType: 'student',
    content: 'Another student asking a question in a different session. (Mock)',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

const TaskHistoryPage: React.FC = () => {
  const { taskId: taskIdFromParams, teacherId: teacherIdFromParams } = useParams<{ taskId: string; teacherId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const taskId = Number(taskIdFromParams);
  const teacherId = Number(teacherIdFromParams);

  useEffect(() => {
    if (!user || !taskId || !teacherIdFromParams) {
      setError('Task ID or Teacher ID is missing, or user not authenticated.');
      setLoading(false);
      setHistory(mockTaskHistory);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const fetchedHistory = await getHistoryByTask(taskId, teacherId);
        const apiHistory = Array.isArray(fetchedHistory) ? fetchedHistory : [];
        
        const combinedSortedHistory = [...apiHistory, ...mockTaskHistory.filter(mh => !apiHistory.find(h => h.historyId === mh.historyId))]
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        setHistory(combinedSortedHistory);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch task history:', err);
        setError(`Failed to load task history from API: ${err.message || 'Unknown error'}. Displaying mock data only.`);
        setHistory(mockTaskHistory.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()));
        message.error('无法从API加载任务历史记录，将仅显示模拟数据。');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [taskId, teacherId, user]);

  const uniqueSessionIds = useMemo(() => {
    const ids = new Set(history.map(item => item.sessionId));
    return Array.from(ids);
  }, [history]);

  if (loading) {
    return <Spin tip="Loading task history..." style={{ display: 'block', marginTop: '20px' }} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Task Interaction History</Title>
      <Paragraph>
        Displaying history for Task ID: <Text strong>{taskId || 'N/A'}</Text>, Teacher ID: <Text strong>{teacherId || 'N/A'}</Text>
      </Paragraph>
      <Link to={`/curriculum`}> 
        <Button type="default" style={{ marginBottom: '20px' }}>Back to Curriculum List</Button>
      </Link>
      
      {error && (
        <Alert message={error} type="warning" showIcon style={{ marginBottom: '20px' }} />
      )}

      {uniqueSessionIds.length > 0 && (
        <>
          <Divider>Code Submissions by Session</Divider>
          <List
            header={<Title level={4}>View Code Submissions</Title>}
            bordered
            dataSource={uniqueSessionIds}
            renderItem={sessionId => (
              <List.Item>
                <Button 
                  type="link" 
                  onClick={() => navigate(`/session/${sessionId}/analytics/${teacherId}`)}
                >
                  View Submissions for Session ID: {sessionId}
                </Button>
              </List.Item>
            )}
            style={{ marginBottom: '20px'}}
          />
        </>
      )}

      <Divider>Chat History Details</Divider>
      {history.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={history}
          renderItem={item => (
            <List.Item key={item.historyId}>
              <Card 
                title={`${item.senderType === 'student' ? 'Student (ID: ' + item.senderId + ')' : 'AI Assistant'} - Session: ${item.sessionId}`}
                extra={<Text type="secondary">{new Date(item.time).toLocaleString()}</Text>}
              >
                <Paragraph>{item.content}</Paragraph>
                {item.historyId >= 99901 && item.historyId <= 99905 && <Text type="secondary" italic> (Mock Data)</Text>} 
              </Card>
            </List.Item>
          )}
        />
      ) : (
        !loading && <Text>No history found for this task.</Text>
      )}
    </div>
  );
};

export default TaskHistoryPage;