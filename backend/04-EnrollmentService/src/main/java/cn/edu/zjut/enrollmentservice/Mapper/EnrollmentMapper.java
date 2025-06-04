package cn.edu.zjut.enrollmentservice.Mapper;
import cn.edu.zjut.enrollmentservice.Model.Enrollment;
import cn.edu.zjut.enrollmentservice.Model.EnrollmentInfo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface EnrollmentMapper {
    @Insert("INSERT INTO student_has_lesson (student_id, lesson_id) VALUES (#{studentId}, #{lessonId})")
    boolean enrollStudent(Enrollment enrollment);

    @Delete("DELETE FROM student_has_lesson WHERE student_id = #{studentId} AND lesson_id = #{lessonId}")
    boolean cancelEnrollment(int studentId, int lessonId);

    @Select("SELECT * FROM student_has_lesson WHERE student_id = #{studentId}")
    List<Enrollment> getEnrollmentsByStudent(@Param("studentId") int studentId);

    // 👇 教师查看课程报名详情（包含学生和课程信息）
    @Select("""
        SELECT 
            e.student_has_lesson_id AS enrollmentId,
            s.id AS studentId,
            s.name AS studentName,
            s.email AS studentEmail,
            c.lesson_id AS lessonId,
            c.lesson_name AS lessonName,
            c.lesson_term AS lessonTerm
        FROM student_has_lesson e
        JOIN student s ON e.student_id = s.id
        JOIN lesson c ON e.lesson_id = c.lesson_id
        WHERE c.teacher_id = #{teacherId}
    """)
    List<EnrollmentInfo> getEnrollmentInfoByTeacher(@Param("teacherId") int teacherId);
}