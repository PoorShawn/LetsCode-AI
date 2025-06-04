package cn.edu.zjut.enrollmentservice.Service.Impl;

import cn.edu.zjut.enrollmentservice.Mapper.EnrollmentMapper;
import cn.edu.zjut.enrollmentservice.Model.Enrollment;
import cn.edu.zjut.enrollmentservice.Model.EnrollmentInfo;
import cn.edu.zjut.enrollmentservice.Service.EnrollmentServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentServiceI {

    @Autowired
    private EnrollmentMapper enrollmentMapper;

    @Override
    public boolean enrollStudent(Enrollment enrollment) {
        return enrollmentMapper.enrollStudent(enrollment);
    }

    @Override
    public boolean cancelEnrollment(int studentId, int lessonId) {
        return enrollmentMapper.cancelEnrollment(studentId, lessonId);
    }

    @Override
    public List<Enrollment> getEnrollmentsByStudent(int studentId) {
        return enrollmentMapper.getEnrollmentsByStudent(studentId);
    }

    @Override
    public List<EnrollmentInfo> getEnrollmentInfoByTeacher(int teacherId) {
        return enrollmentMapper.getEnrollmentInfoByTeacher (teacherId);
    }
}