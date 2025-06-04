package cn.edu.zujt.teacherservice.service.Impl;

import cn.edu.zujt.teacherservice.Model.Teacher;
import cn.edu.zujt.teacherservice.dto.TeacherDto;
import cn.edu.zujt.teacherservice.mapper.TeacherMapper;
import cn.edu.zujt.teacherservice.service.TeacherServiceI;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherServiceI{

    @Autowired
    private TeacherMapper teacherMapper;

    @Override
    @Transactional
    public Teacher registerTeacher(Teacher teacher) {
        teacherMapper.registerTeacher(teacher);
        return teacher;
    }

    @Override
    public TeacherDto getTeacherById(int teacherId) {
        return teacherMapper.getTeacherById(teacherId);
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        return teacherMapper.getAllTeachers();
    }

    @Override
    @Transactional
    public TeacherDto updateTeacher(int teacherId, Teacher teacher) {
        teacher.setTeacherId(teacherId);
        int affectedRows = teacherMapper.updateTeacher(teacher);
        if (affectedRows > 0) {
            return teacherMapper.getTeacherById(teacherId);
        }
        throw new RuntimeException("更新教师信息失败");
    }

    @Override
    @Transactional
    public boolean updatePassword(int teacherId, String newPassword) {
        int affectedRows = teacherMapper.updatePassword(teacherId, newPassword);
        return affectedRows > 0;
    }

    @Override
    @Transactional
    public void deleteTeacher(int teacherId) {
        int affectedRows = teacherMapper.deleteTeacher(teacherId);
    }

    @Override
    public String getPasswordByID(int teacherId) {
        return teacherMapper.getPasswordByID(teacherId);
    }

    @Override
    public List<TeacherDto> searchTeachers(String name, String department) {
        return teacherMapper.searchTeachers(name, department);
    }
}

