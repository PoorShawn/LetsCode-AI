import { axiosRequest } from "../utils/request";

// Session 类型定义
export interface Session {
  sessionId: number;
  studentId: number;
  taskId: number;
  startTime: string; // 使用 ISO 格式的时间字符串
}

// API 路径前缀
const API_PREFIX = "/session";

// 创建会话
export const createSession = (session: Session) => {
  return axiosRequest<boolean>(`${API_PREFIX}/create`, "POST", session);
};

// 删除会话
export const deleteSession = (sessionId: number, studentId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/delete/${sessionId}/${studentId}`,
    "DELETE"
  );
};

// 获取学生的所有会话
export const getStudentSessions = (studentId: number) => {
  return axiosRequest<Session[]>(`${API_PREFIX}/student/${studentId}`, "GET");
};

// 根据任务获取会话
export const getSessionsByTask = (taskId: number) => {
  return axiosRequest<Session[]>(`${API_PREFIX}/task/${taskId}`, "GET");
};

// 与 AI 聊天
export const chatWithAI = (
  sessionId: number,
  studentId: number,
  message: string
) => {
  return axiosRequest<string>(
    `${API_PREFIX}/chatWithAI/${sessionId}/${studentId}`,
    "POST",
    { message }
  );
};