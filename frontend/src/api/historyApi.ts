import { axiosRequest } from "../utils/request";

// History 类型定义
export interface History {
  historyId: number;
  sessionId: number;
  senderId: number; // 学生ID或AI标识符（如-1）
  senderType: string; // "student" / "ai"
  content: string;
  time: string; // ISO 格式的时间字符串
}

// API 路径前缀
const API_PREFIX = "/history";

// 添加历史记录
export const addHistory = (history: History) => {
  return axiosRequest<boolean>(`${API_PREFIX}/add`, "POST", history);
};

// 根据会话ID获取历史记录
export const getHistoryBySession = (
  sessionId: number,
  userId: number,
  role: string
) => {
  return axiosRequest<History[]>(
    `${API_PREFIX}/bySession/${sessionId}/${userId}/${role}`,
    "GET"
  );
};

// 根据任务ID获取历史记录
export const getHistoryByTask = (taskId: number, teacherId: number) => {
  return axiosRequest<History[]>(
    `${API_PREFIX}/byTask/${taskId}/${teacherId}`,
    "GET"
  );
};