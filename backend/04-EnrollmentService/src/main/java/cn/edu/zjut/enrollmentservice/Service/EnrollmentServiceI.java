package cn.edu.zjut.enrollmentservice.Service;

import cn.edu.zjut.enrollmentservice.Model.Enrollment;
import cn.edu.zjut.enrollmentservice.Model.EnrollmentInfo;

import java.util.List;
public interface EnrollmentServiceI {
    boolean enrollStudent(Enrollment enrollment);
    boolean cancelEnrollment(int studentId, int lessonId);
    List<Enrollment> getEnrollmentsByStudent(int studentId);
    List<EnrollmentInfo> getEnrollmentInfoByTeacher(int teacherId);
}