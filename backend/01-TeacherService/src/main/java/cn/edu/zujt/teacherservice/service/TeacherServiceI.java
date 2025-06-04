package cn.edu.zujt.teacherservice.service;

import cn.edu.zujt.teacherservice.Model.Teacher;
import cn.edu.zujt.teacherservice.dto.TeacherDto;

import java.util.List;

public interface TeacherServiceI {

    List<TeacherDto> getAllTeachers();

    TeacherDto getTeacherById(int teacherId);

    TeacherDto updateTeacher(int teacherId, Teacher teacher);

    void deleteTeacher(int teacherId);

    //String getPasswordByID(int teacherId);

    List<TeacherDto> searchTeachers(String name, String department);

    Teacher registerTeacher(Teacher teacherRegistForm);

    boolean updatePassword(int teacherId, String newPassword);

    Teacher login(String TeacherEmail, String password);
}
