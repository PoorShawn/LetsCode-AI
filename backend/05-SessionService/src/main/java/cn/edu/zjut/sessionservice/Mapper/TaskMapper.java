package cn.edu.zjut.sessionservice.Mapper;
import cn.edu.zjut.sessionservice.Model.Task;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TaskMapper {
    @Insert("INSERT INTO task (task_name, task_content, lesson_id, teacher_id, Student_has_Lesson_ID) VALUES (#{taskName}, #{taskContent}, #{lessonId}, #{teacherId}, #{Student_has_Lesson_ID})")
    boolean createTask(Task task);

    @Update("UPDATE task SET task_name = #{taskName}, task_content = #{taskContent} WHERE task_id = #{taskId} AND teacher_id = #{teacherId}")
    boolean updateTask(Task task, @Param("teacherId") int teacherId);

    @Delete("DELETE FROM task WHERE task_id = #{taskId} AND teacher_id = #{teacherId}")
    boolean deleteTask(@Param("taskId") int taskId, @Param("teacherId") int teacherId);

    @Select("SELECT * FROM task WHERE lesson_id = #{lessonId}")
    List<Task> getTasksByLesson(int lessonId);

    @Select("""
        SELECT DISTINCT t.*\s
        FROM task t
        JOIN lesson l ON t.lesson_id = l.lesson_id
        JOIN student_has_lesson shl ON l.lesson_id = shl.lesson_id
        WHERE shl.student_id = #{studentId}
    """)
    List<Task> getTasksByStudent(int studentId);

    @Select("SELECT * FROM task WHERE task_id = #{taskId}")
    Task getTaskById(@Param("taskId") int taskId);

}
