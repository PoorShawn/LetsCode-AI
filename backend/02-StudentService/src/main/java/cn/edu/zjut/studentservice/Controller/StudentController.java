package cn.edu.zjut.studentservice.Controller;
import cn.edu.zjut.studentservice.Model.Student;
import cn.edu.zjut.studentservice.Service.StudentServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentServiceI studentService;

    @PostMapping("/login")
    public Student login(@RequestParam String email, @RequestParam String password) {
        return studentService.login(email, password);
    }

    @PostMapping("/register")
    public boolean register(@RequestBody Student student) {
        return studentService.register(student);
    }

    @PutMapping("/update")
    public boolean updateInfo(@RequestBody Student student) {
        return studentService.updateInfo(student);
    }

    @PutMapping("/update-password")
    public boolean updatePassword(@RequestParam int id, @RequestParam String oldPwd, @RequestParam String newPwd) {
        System.out.println("id: " + id);
        System.out.println("oldPwd: '" + oldPwd + "'");
        System.out.println("newPwd: '" + newPwd + "'");
        return studentService.updatePassword(id, oldPwd, newPwd);
    }

    @DeleteMapping("/delete/{id}")
    public boolean delete(@PathVariable int id) {
        return studentService.delete(id);
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable int id) {
        return studentService.getStudentById(id);
    }

    @GetMapping("/search")
    public List<Student> search(@RequestParam(required = false) String name,
                                @RequestParam(required = false) String major,
                                @RequestParam(required = false) String grade) {
        return studentService.search(name, major, grade);
    }
}
