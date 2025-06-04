import { axiosRequest } from "../utils/request";

// LearningAnalytics 类型定义
export interface LearningAnalytics {
  CodingID: number;
  CodingContent: string;
  SubmitTime: string;
  SessionID: number;
  score?: number;
  feedback?: string;
}

// API 路径前缀
const API_PREFIX = "/learningAnalytics";

// 提交代码
export const submitCoding = (coding: LearningAnalytics) => {
  return axiosRequest<boolean>(`${API_PREFIX}/submit`, "POST", coding);
};

// 更新代码
export const updateCoding = (coding: LearningAnalytics) => {
  return axiosRequest<boolean>(`${API_PREFIX}/update`, "PUT", coding);
};

// 删除代码
export const deleteCoding = (codingId: number, studentId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/delete/${codingId}/${studentId}`,
    "DELETE"
  );
};

// 根据会话获取代码记录
export const getCodingBySession = (
  sessionId: number,
  userId: number,
  role: string
) => {
  return axiosRequest<LearningAnalytics[]>(
    `${API_PREFIX}/getBySession/${sessionId}/${userId}/${role}`,
    "GET"
  );
};

// 评价代码
export const evaluateCoding = (
  codingId: number,
  teacherId: number,
  score?: number,
  comment?: string
) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/evaluate`,
    "POST",
    null,
    {
      params: {
        codingId,
        teacherId,
        score,
        comment,
      },
    }
  );
};