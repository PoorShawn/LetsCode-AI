package cn.edu.zjut.curriculumservice.Mapper;
import cn.edu.zjut.curriculumservice.Model.Curriculum;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CurriculumMapper {
    @Insert("INSERT INTO lesson (lesson_name, teacher_id, lesson_term, capacity, enrolled_count) " +
            "VALUES (#{lessonName}, #{teacherId}, #{lessonTerm}, #{capacity}, 0)")
    boolean createCurriculum(Curriculum curriculum);

    @Update("UPDATE lesson SET lesson_name=#{lessonName}, teacher_id=#{teacherId}, " +
            "lesson_term=#{lessonTerm}, capacity=#{capacity} WHERE lesson_id=#{lessonId}")
    boolean updateCurriculum(Curriculum curriculum);

    @Delete("DELETE FROM lesson WHERE lesson_id=#{lessonId}")
    boolean deleteCurriculum(int lessonId);

    @Select("SELECT * FROM lesson")
    List<Curriculum> getAllCurriculums();

    // 学生报名课程
    @Insert("INSERT INTO student_has_lesson(Student_ID, Lesson_ID) VALUES (#{studentId}, #{lessonId})")
    boolean enrollStudent(@Param("studentId") int studentId, @Param("lessonId") int lessonId);

    // 课程报名人数增加
    @Update("UPDATE lesson SET enrolled_count = enrolled_count + 1 WHERE lesson_id=#{lessonId} AND enrolled_count < capacity")
    boolean incrementEnrolled(int lessonId);

    // 取消报名
    @Delete("DELETE FROM student_has_lesson WHERE student_id=#{studentId} AND lesson_id=#{lessonId}")
    boolean withdrawStudent(@Param("studentId") int studentId, @Param("lessonId") int lessonId);

    // 报名人数减少
    @Update("UPDATE lesson SET enrolled_count = enrolled_count - 1 WHERE lesson_id=#{lessonId} AND enrolled_count > 0")
    boolean decrementEnrolled(int lessonId);
}
