import { axiosRequest } from '../utils/request';

// 教师相关接口

// 1. 注册/添加教师
export const registerTeacher = async (teacherData: {
  name: string;
  department: string;
  email: string;
  password: string;
}) => {
  return axiosRequest('/teacher/register', 'POST', teacherData); // 通过 JSON 格式发送
};

// 2. 根据ID获取教师信息
export const getTeacherById = async (teacherId: number) => {
  return axiosRequest('/teacher/get-teacher', 'POST', { teacherId }); // 将 ID 包装为 JSON 格式发送
};

// 3. 获取所有教师列表
export const getAllTeachers = async () => {
  return axiosRequest('/teacher/get-all', 'POST', {}); // 空对象作为 JSON 格式发送
};

// 4. 更新教师信息
export const updateTeacher = async (teacherId: number, teacherData: { name?: string; department?: string }) => {
  return axiosRequest('/teacher/update', 'PUT', { teacherId, ...teacherData }); // 包装为 JSON 格式发送
};

// 5. 更新教师密码
export const updatePassword = async (teacherId: number, newPassword: string) => {
  return axiosRequest('/teacher/update-password', 'PUT', { teacherId, newPassword }); // 包装为 JSON 格式发送
};

// 6. 删除教师
export const deleteTeacher = async (teacherId: number) => {
  return axiosRequest('/teacher/delete', 'DELETE', { teacherId }); // 包装为 JSON 格式发送
};

// 7. 教师登录
export const loginTeacher = async (email: string, password: string) => {
  return axiosRequest('/teacher/login', 'POST', { email, password }); // 包装为 JSON 格式发送
};

// 8. 搜索教师（按姓名或其他条件）
export const searchTeachers = async (params: { name?: string; department?: string }) => {
  return axiosRequest('/teacher/search', 'POST', params); // 通过 JSON 格式发送搜索参数
};