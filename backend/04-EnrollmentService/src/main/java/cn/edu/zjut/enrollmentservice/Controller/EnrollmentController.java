package cn.edu.zjut.enrollmentservice.Controller;
import cn.edu.zjut.enrollmentservice.Model.Enrollment;
import cn.edu.zjut.enrollmentservice.Model.EnrollmentInfo;
import cn.edu.zjut.enrollmentservice.Service.EnrollmentServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollment")
public class EnrollmentController {

    @Autowired
    private EnrollmentServiceI enrollmentService;

    // ✅ 学生选课，必须是本人
    @PostMapping("/register/{userId}")
    public boolean enrollStudent(@RequestBody Enrollment enrollment,
                                 @PathVariable int userId) {
        System.out.println("userId = " + userId);
        System.out.println("enrollment = " + enrollment);

        if (enrollment.getStudentId() != userId) {
            throw new RuntimeException("学生ID和当前登录用户不匹配");
        }
        return enrollmentService.enrollStudent(enrollment);
    }

    // ✅ 学生退课，必须是本人
    @DeleteMapping("/cancel/{studentId}/{lessonId}/{userId}")
    public boolean cancelEnrollment(@PathVariable int studentId,
                                    @PathVariable int lessonId,
                                    @PathVariable int userId) {
        if (studentId != userId) {
            throw new RuntimeException("无权限取消他人课程");
        }
        return enrollmentService.cancelEnrollment(studentId, lessonId);
    }

    // ✅ 学生查看自己选课信息
    @GetMapping("/student/{studentId}/{userId}/{role}")
    public List<Enrollment> getEnrollmentsByStudent(@PathVariable int studentId,
                                                    @PathVariable int userId,
                                                    @PathVariable String role) {
        if (!"student".equalsIgnoreCase(role) || studentId != userId) {
            throw new RuntimeException("无权限查看他人选课信息");
        }
        return enrollmentService.getEnrollmentsByStudent(studentId);
    }

    // ✅ 教师查看自己课程的学生选课信息
    @GetMapping("/teacher/{teacherId}/{userId}/{role}")
    public List<EnrollmentInfo> getEnrollmentInfoByTeacher(@PathVariable int teacherId,
                                                           @PathVariable int userId,
                                                           @PathVariable String role) {
        if (!"teacher".equalsIgnoreCase(role) || teacherId != userId) {
            throw new RuntimeException("无权限查看其他教师的选课信息");
        }
        return enrollmentService.getEnrollmentInfoByTeacher(teacherId);
    }
}