import { axiosRequest } from '../utils/request';

// 模拟数据
const mockTeacherData = {
  teacherId: 1,
  teacherName: '张三',
  teacherEmail: 'zhangsan@example.com',
  department: '软件工程',
  title: '副教授'
};

const mockCourses = [
  {
    courseId: 1,
    courseName: '软件工程导论',
    courseCode: 'SE101',
    semester: '2025春季',
    studentCount: 45
  },
  {
    courseId: 2,
    courseName: '数据结构',
    courseCode: 'CS102',
    semester: '2025春季',
    studentCount: 60
  }
];

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
  try {
    return await axiosRequest(`/teacher/${teacherId}`, 'GET');
  } catch (error) {
    console.error('Failed to fetch teacher:', error);
    console.log('Using mock data for teacher...');
    return mockTeacherData;
  }
};

// 3. 获取所有教师列表
export const getAllTeachers = async () => {
  try {
    return await axiosRequest('/teacher', 'GET');
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    console.log('Using mock data for teachers...');
    return [mockTeacherData];
  }
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

// 9. 获取教师的课程列表
export const getTeacherCourses = async (teacherId: number) => {
  try {
    const response = await axiosRequest(`/teacher/${teacherId}/courses`, 'GET');
    return response;
  } catch (error) {
    console.error('Failed to fetch teacher courses:', error);
    console.log('Using mock data for courses...');
    return mockCourses;
  }
};