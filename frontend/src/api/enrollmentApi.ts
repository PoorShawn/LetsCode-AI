import { axiosRequest } from "../utils/request";

// Enrollment 类型定义
export interface Enrollment {
  studentId: number;
  lessonId: number;
  studentHasLessonId: number;
}

// EnrollmentInfo 类型定义
export interface EnrollmentInfo {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  lessonId: number;
  lessonName: string;
  lessonTerm: string;
}

// Course 类型定义
export interface Course {
  courseId: number;
  courseName: string;
  description: string;
  teacherId: number;
  studentCount: number;
}

// API 路径前缀
const API_PREFIX = "/enrollment";

// 学生选课
export const enrollStudent = (enrollment: Enrollment, userId: number) => {
  return axiosRequest<boolean>(`${API_PREFIX}/register/${userId}`, "POST", enrollment);
};

// 学生退课
export const cancelEnrollment = (studentId: number, lessonId: number, userId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/cancel/${studentId}/${lessonId}/${userId}`,
    "DELETE"
  );
};

// 学生查看自己的选课信息
export const getEnrollmentsByStudent = (studentId: number, userId: number, role: string) => {
  return axiosRequest<Enrollment[]>(
    `${API_PREFIX}/student/${studentId}/${userId}/${role}`,
    "GET"
  );
};

// 教师查看自己课程的学生选课信息
export const getEnrollmentInfoByTeacher = (teacherId: number, userId: number, role: string) => {
  return axiosRequest<EnrollmentInfo[]>(
    `${API_PREFIX}/teacher/${teacherId}/${userId}/${role}`,
    "GET"
  );
};

// 获取教师的所有课程
export const getCoursesByTeacher = (teacherId: number) => {
  return axiosRequest<Course[]>(
    `${API_PREFIX}/courses/teacher/${teacherId}`,
    "GET"
  );
};

// 获取课程的所有学生
export const getStudentsByCourse = (courseId: number) => {
  return axiosRequest<EnrollmentInfo[]>(
    `${API_PREFIX}/courses/${courseId}/students`,
    "GET"
  );
};