import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Tabs, Modal, Input, Rate } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import '@ant-design/cssinjs';
import '@ant-design/pro-components/dist/components.css';
import { getCodingBySession, evaluateCoding } from '../../api/analyticsApi';

import type { LearningAnalytics } from '../../api/analyticsApi';
import type { History } from '../../api/historyApi';
import { getHistoryByTask } from '../../api/historyApi';

const { TabPane } = Tabs;

const GradingCenter: React.FC = () => {
  const { user } = useAuth();
  const teacherId = user?.id ? parseInt(user.id) : undefined;
  const [loading, setLoading] = useState(false);
  const [codingRecords, setCodingRecords] = useState<LearningAnalytics[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [evaluateModalVisible, setEvaluateModalVisible] = useState(false);
  const [currentCodingId, setCurrentCodingId] = useState<number | null>(null);
  const [score, setScore] = useState<number>(80);
  const [feedback, setFeedback] = useState('');

  const columns = [
    {
      title: '学生ID',
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
      title: '分数',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: '反馈',
      dataIndex: 'feedback',
      key: 'feedback',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: LearningAnalytics) => (
        <Space>
          <Button 
            type="primary"
            onClick={() => showEvaluateModal(record.CodingID)}
          >
            评分
          </Button>
          <Button
            onClick={() => handleViewHistory(record.SessionID)}
          >
            查看历史
          </Button>
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: '发送者',
      dataIndex: 'senderType',
      key: 'senderType',
      render: (type: string) => type === 'student' ? '学生' : 'AI',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const showEvaluateModal = (codingId: number) => {
    setCurrentCodingId(codingId);
    setEvaluateModalVisible(true);
  };

  const handleEvaluate = async () => {
    if (!teacherId || !currentCodingId) {
      message.error('教师信息不完整');
      return;
    }

    try {
      await evaluateCoding(currentCodingId, teacherId, score, feedback);
      message.success('评分成功');
      setEvaluateModalVisible(false);
      setScore(80);
      setFeedback('');
      
      // 刷新列表
      fetchCodingRecords();
    } catch (error) {
      console.error('Failed to evaluate:', error);
      message.error('评分失败');
    }
  };

  const handleViewHistory = async (sessionId: number) => {
    if (!teacherId) {
      message.error('教师信息不完整');
      return;
    }

    try {
      const historyData = await getHistoryByTask(sessionId, teacherId);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      message.error('获取历史记录失败');
    }
  };

  const fetchCodingRecords = async () => {
    if (!teacherId) return;
    
    setLoading(true);
    try {
      // 这里使用模拟的sessionId，实际应该从任务或课程中获取
      const sessionId = 1;
      const records = await getCodingBySession(sessionId, teacherId, 'teacher');
      setCodingRecords(records);
    } catch (error) {
      console.error('Failed to fetch coding records:', error);
      message.error('获取代码记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchCodingRecords();
    }
  }, [teacherId]);

  return (
    <div style={{ padding: '24px' }}>
      <div className="ant-card">
        <div className="ant-card-head">
          <div className="ant-card-head-title">批改中心</div>
        </div>
        <div className="ant-card-body">
        <Tabs defaultActiveKey="1">
          <TabPane tab="待批改代码" key="1">
            <Table
              columns={columns}
              dataSource={codingRecords}
              loading={loading}
              rowKey="CodingID"
            />
          </TabPane>
          <TabPane tab="历史记录" key="2">
            <Table
              columns={historyColumns}
              dataSource={history}
              rowKey="historyId"
            />
          </TabPane>
        </Tabs>
        </div>
      </div>

      <Modal
        title="评分反馈"
        open={evaluateModalVisible}
        onOk={handleEvaluate}
        onCancel={() => setEvaluateModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>分数：</div>
          <Rate
            count={10}
            value={score / 10}
            onChange={(value: number) => setScore(value * 10)}
          />
          <span style={{ marginLeft: 8 }}>{score}分</span>
        </div>
        <div>
          <div style={{ marginBottom: 8 }}>反馈意见：</div>
          <Input.TextArea
            rows={4}
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
            placeholder="请输入对学生代码的具体反馈意见..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default GradingCenter;
