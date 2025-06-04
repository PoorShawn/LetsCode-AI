package cn.edu.zjut.studentservice.Service;
import cn.edu.zjut.studentservice.Model.Student;

import java.util.List;
public interface StudentServiceI {
    Student login(String email, String password);
    boolean register(Student student);
    boolean updateInfo(Student student);
    boolean updatePassword(int id, String oldPwd, String newPwd);
    boolean delete(int id);
    Student getStudentById(int id);
    List<Student> search(String name, String major, String grade);
}
