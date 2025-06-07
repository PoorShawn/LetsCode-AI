import { axiosRequest } from '../utils/request';

// 模拟批改任务数据
const mockGradingTasks = [
  { id: 1, student: '王小明', title: '线性回归编程作业', submitted: '2025-06-08', status: '待批改' },
  { id: 2, student: '李晓红', title: '算法分析报告', submitted: '2025-06-09', status: '已批改' },
  { id: 3, student: '张三', title: '数据结构实验报告', submitted: '2025-06-10', status: '待批改' },
];

// 获取教师的批改任务列表
export const getGradingTasks = async (teacherId: number) => {
  try {
    const response = await axiosRequest(`/teacher/${teacherId}/grading-tasks`, 'GET');
    return response;
  } catch (error) {
    console.error('Failed to fetch grading tasks:', error);
    console.log('Using mock data for grading tasks...');
    return mockGradingTasks;
  }
};
