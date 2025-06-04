package cn.edu.zujt.teacherservice.controller;

import cn.edu.zujt.teacherservice.Model.Teacher;
import cn.edu.zujt.teacherservice.dto.TeacherDto;
import cn.edu.zujt.teacherservice.service.TeacherServiceI;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@ComponentScan
@RequestMapping("/teacher")
@AllArgsConstructor
public class TeacherController {
    @Autowired
    private TeacherServiceI teacherService;

    // 注册/添加教师
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Teacher registerTeacher(@RequestBody Teacher teacherRegistForm) {
        return teacherService.registerTeacher(teacherRegistForm);
    }

    // 根据ID获取教师信息
    @GetMapping("/{teacherId}")
    public TeacherDto getTeacherById(@PathVariable("teacherId") int teacherId) {
        return teacherService.getTeacherById(teacherId);
    }

    // 获取所有教师列表
    @GetMapping
    public List<TeacherDto> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    // 更新教师信息
    @PutMapping("/{teacherId}")
    public TeacherDto updateTeacher(@PathVariable("teacherId") int teacherId,
                                    @RequestBody Teacher teacher) {
        return teacherService.updateTeacher(teacherId, teacher);
    }

    // 更新教师密码
    @PutMapping("/UpdatePassword/{teacherId}")
    public String updatePassword(@PathVariable("teacherId") int teacherId,
                                    @RequestBody Map<String, String> passwordData) {
        String newPassword = passwordData.get("newPassword");
        if (newPassword == null || newPassword.isEmpty()) {
            return "Invalid password data";
        }
        boolean success = teacherService.updatePassword(teacherId, newPassword);
        return success ? "Password updated successfully" : "Failed to update password";
    }

    // 删除教师
    @DeleteMapping("/{teacherId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable("teacherId") int teacherId) {
        teacherService.deleteTeacher(teacherId);
    }

    // 教师登录
    //@GetMapping("/login/{teacherId}")
    //public String teacherLogin(@PathVariable("teacherId") int teacherId) {
    //    return teacherService.getPasswordByID(teacherId);
    //}
    @PostMapping("/login")
    public Teacher login(@RequestParam String TeacherEmail, @RequestParam String password) {
        return teacherService.login(TeacherEmail, password);
    }

    // 搜索教师（按姓名或其他条件）
    @GetMapping("/search")
    public List<TeacherDto> searchTeachers(@RequestParam(required = false) String name,
                                           @RequestParam(required = false) String department) {
        return teacherService.searchTeachers(name, department);
    }
}