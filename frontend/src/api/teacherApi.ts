import { axiosRequest } from '../utils/request';

// 教师相关接口
export interface Teacher {
  title: string;
  department: string;
  teacherEmail: string;
  password?: string;
  teacherName: string;
  teacherId: number;
}

// 1. 注册/添加教师
export const registerTeacher = async (teacherData: {
  name: string;
  department: string;
  email: string;
  password: string;
}) => {
  return axiosRequest('/teacher', 'POST', teacherData);
};

// 2. 根据ID获取教师信息
export const getTeacherById = async (teacherId: number) => {
  return axiosRequest(`/teacher/${teacherId}`, 'GET');
};

// 3. 获取所有教师列表
export const getAllTeachers = async () => {
  return axiosRequest('/teacher', 'GET');
};

// 4. 更新教师信息
export const updateTeacher = async (teacherId: number, teacherData: { name?: string; department?: string }) => {
  return axiosRequest(`/teacher/${teacherId}`, 'PUT', teacherData);
};

// 5. 更新教师密码
export const updatePassword = async (teacherId: number, newPassword: string) => {
  return axiosRequest(`/teacher/UpdatePassword/${teacherId}`, 'PUT', { newPassword });
};

// 6. 删除教师
export const deleteTeacher = async (teacherId: number) => {
  return axiosRequest(`/teacher/${teacherId}`, 'DELETE');
};

// 7. 教师登录
export const loginTeacher = async (email: string, password: string) => {
  return axiosRequest<Teacher>('/teacher/login', 'POST', null, {
    params: { TeacherEmail: email, password }
  }); // 修改为表单参数
};

// 8. 搜索教师（按姓名或其他条件）
export const searchTeachers = async (params: { name?: string; department?: string }) => {
  const query = new URLSearchParams(params).toString();
  return axiosRequest(`/teacher/search?${query}`, 'GET');
};