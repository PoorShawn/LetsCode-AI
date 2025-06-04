import { axiosRequest } from '../utils/request';

// 学生类型定义
export interface Student {
  id: number;
  name: string;
  email: string;
  password?: string;
  major: string;
  grade: string;
}

// API 路径前缀
const API_PREFIX = '/students';

// 学生登录
export const loginStudent = (email: string, password: string) => {
  return axiosRequest<Student>(
    `${API_PREFIX}/login`,
    'POST',
    { email, password } // 通过 JSON 格式发送
  );
};

// 学生注册
export const registerStudent = (student: Student) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/register`,
    'POST',
    student // 通过 JSON 格式发送
  );
};

// 更新学生信息
export const updateStudentInfo = (student: Student) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/update`,
    'PUT',
    student // 通过 JSON 格式发送
  );
};

// 更新学生密码
export const updateStudentPassword = (id: number, oldPwd: string, newPwd: string) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/update-password`,
    'PUT',
    { id, oldPwd, newPwd } // 通过 JSON 格式发送
  );
};

// 删除学生
export const deleteStudent = (id: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/delete`,
    'DELETE',
    { id } // 将 ID 包装为 JSON 格式发送
  );
};

// 根据ID获取学生信息
export const getStudentById = (id: number) => {
  return axiosRequest<Student>(
    `${API_PREFIX}/get-student`,
    'POST',
    { id } // 将 ID 包装为 JSON 格式发送
  );
};

// 搜索学生
export interface SearchStudentParams {
  name?: string;
  major?: string;
  grade?: string;
}

export const searchStudents = (params: SearchStudentParams) => {
  return axiosRequest<Student[]>(
    `${API_PREFIX}/search`,
    'POST',
    params // 通过 JSON 格式发送搜索参数
  );
};