import React, { useState, useEffect } from 'react';
import { Table, Tabs, Timeline, message } from 'antd';
import '@ant-design/cssinjs';
import '@ant-design/pro-components/dist/components.css';
import { useAuth } from '../../contexts/AuthContext';
import { getHistoryBySession } from '../../api/historyApi';
import { getCodingBySession } from '../../api/analyticsApi';
import type { History } from '../../api/historyApi';
import type { LearningAnalytics } from '../../api/analyticsApi';

const { TabPane } = Tabs;

const LearningHistory: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics[]>([]);

  const analyticsColumns = [
    {
      title: '代码ID',
      dataIndex: 'CodingID',
      key: 'codingId',
    },
    {
      title: '提交时间',
      dataIndex: 'SubmitTime',
      key: 'submitTime',
    },
    {
      title: '代码内容',
      dataIndex: 'CodingContent',
      key: 'codingContent',
      ellipsis: true,
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score || '待批改',
    },
    {
      title: '教师反馈',
      dataIndex: 'feedback',
      key: 'feedback',
      ellipsis: true,
    },
  ];

  const fetchHistory = async (sessionId: number) => {
    if (!studentId) return;

    setLoading(true);
    try {
      const [historyData, analyticsData] = await Promise.all([
        getHistoryBySession(sessionId, studentId, 'student'),
        getCodingBySession(sessionId, studentId, 'student')
      ]);

      setHistory(historyData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      message.error('获取历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      // 这里使用模拟的sessionId，实际应该从路由参数或状态管理中获取
      fetchHistory(1);
    }
  }, [studentId]);

  return (
    <div style={{ padding: '24px' }}>
      <div className="ant-card">
        <div className="ant-card-head">
          <div className="ant-card-head-title">学习历史</div>
        </div>
        <div className="ant-card-body">
        <Tabs defaultActiveKey="1">
          <TabPane tab="对话历史" key="1">
            <Timeline style={{ margin: '20px' }}>
              {history.map(item => (
                <Timeline.Item key={item.historyId}>
                  <p><strong>{item.senderType === 'student' ? '我' : 'AI助手'}</strong></p>
                  <p>{item.content}</p>
                  <p style={{ color: '#999' }}>{item.time}</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>
          <TabPane tab="代码提交记录" key="2">
            <Table
              columns={analyticsColumns}
              dataSource={analytics}
              loading={loading}
              rowKey="CodingID"
            />
          </TabPane>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LearningHistory;
