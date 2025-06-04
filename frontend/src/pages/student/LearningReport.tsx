import React from 'react';
import { Card, Progress, Typography, Divider, List, Timeline } from 'antd';
import { BookOutlined, CodeOutlined, RobotOutlined, BulbOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface LearningReportProps {
  report: {
    codeQualityScore: number;
    staticAnalysis: {
      syntaxErrors: string[];
      codeLogic: string[];
    };
    knowledgePoints: string[];
    aiDialogue: string;
    codeCompletion: {
      frequency: string;
      adoption: string;
    };
    learningAdvice: string[];
    trends: {
      timeRange: string;
      lastCode: string;
      tabSuggestions: string;
      userBehavior: string;
    };
  };
}

const LearningReport: React.FC<LearningReportProps> = ({ report }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Title level={2} className="text-center mb-8">
        <BookOutlined className="mr-2" />
        学情报告
      </Title>

      {/* 代码质量评分卡片 */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Title level={4}>
              <CodeOutlined className="mr-2" />
              代码质量综合评分
            </Title>
            <Paragraph>
              从目前的代码记录来看，你的代码质量处于中等水平。随着对代码规范和逻辑的进一步掌握，代码质量有望得到提升。
            </Paragraph>
          </div>
          <Progress
            type="circle"
            percent={report.codeQualityScore}
            format={(percent) => `${percent}分`}
            className="ml-4"
          />
        </div>
      </Card>

      {/* 代码静态分析结果 */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <Title level={4}>
          <LineChartOutlined className="mr-2" />
          代码静态分析结果
        </Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text strong>语法错误：</Text>
            <List
              size="small"
              dataSource={report.staticAnalysis.syntaxErrors}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
          <div>
            <Text strong>代码逻辑：</Text>
            <List
              size="small"
              dataSource={report.staticAnalysis.codeLogic}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </div>
        </div>
      </Card>

      {/* 知识点掌握情况 */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <Title level={4}>
          <BulbOutlined className="mr-2" />
          知识点掌握情况
        </Title>
        <Timeline
          items={report.knowledgePoints.map((point, index) => ({
            color: index % 2 ? 'blue' : 'green',
            children: point,
          }))}
        />
      </Card>

      {/* AI 对话情况 */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <Title level={4}>
          <RobotOutlined className="mr-2" />
          AI 对话情况
        </Title>
        <Paragraph>{report.aiDialogue}</Paragraph>
      </Card>

      {/* 个性化学习建议 */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <Title level={4}>
          <BulbOutlined className="mr-2" />
          个性化未来学习建议
        </Title>
        <List
          dataSource={report.learningAdvice}
          renderItem={(item) => (
            <List.Item>
              <Text>{item}</Text>
            </List.Item>
          )}
        />
      </Card>

      {/* 关键信息关联与趋势 */}
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <Title level={4}>关键信息关联与趋势</Title>
        <div className="space-y-4">
          <div>
            <Text strong>行为时段：</Text>
            <Paragraph>{report.trends.timeRange}</Paragraph>
          </div>
          <Divider />
          <div>
            <Text strong>最后一次代码内容：</Text>
            <pre className="bg-gray-50 p-3 rounded-md mt-2">
              {report.trends.lastCode}
            </pre>
          </div>
          <Divider />
          <div>
            <Text strong>Tab 提示内容：</Text>
            <Paragraph>{report.trends.tabSuggestions}</Paragraph>
          </div>
          <Divider />
          <div>
            <Text strong>用户采纳行为：</Text>
            <Paragraph>{report.trends.userBehavior}</Paragraph>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LearningReport;
