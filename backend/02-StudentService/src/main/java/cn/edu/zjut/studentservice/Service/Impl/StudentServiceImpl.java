package cn.edu.zjut.studentservice.Service.Impl;
import cn.edu.zjut.studentservice.Mapper.StudentMapper;
import cn.edu.zjut.studentservice.Model.Student;
import cn.edu.zjut.studentservice.Service.StudentServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class StudentServiceImpl implements StudentServiceI {
    @Autowired
    private StudentMapper studentMapper;

    @Override
    public Student login(String email, String password) {
        return studentMapper.login(email, password);
    }

    @Override
    public boolean register(Student student) {
        return studentMapper.register(student);
    }

    @Override
    public boolean updateInfo(Student student) {
        return studentMapper.updateInfo(student);
    }

    @Override
    public boolean updatePassword(int id, String oldPwd, String newPwd) {
        int rows = studentMapper.updatePassword(id, oldPwd, newPwd);
        return rows > 0;  // 有更新到才返回true，否则false
    }

    @Override
    public boolean delete(int id) {
        return studentMapper.delete(id);
    }

    @Override
    public Student getStudentById(int id) {
        return studentMapper.getStudentById(id);
    }

    @Override
    public List<Student> search(String name, String major, String grade) {
        return studentMapper.search(name, major, grade);
    }

}
