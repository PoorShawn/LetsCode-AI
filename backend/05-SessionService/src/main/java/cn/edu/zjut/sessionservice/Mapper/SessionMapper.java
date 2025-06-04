package cn.edu.zjut.sessionservice.Mapper;

import cn.edu.zjut.sessionservice.Model.Session;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SessionMapper {

    @Insert("INSERT INTO session (student_id, task_id, start_time, end_time) VALUES (#{studentId}, #{taskId}, #{startTime}, #{endTime})")
    boolean createSession(Session session);

    @Delete("DELETE FROM session WHERE session_id = #{sessionId} AND student_id = #{studentId}")
    boolean deleteSession(@Param("sessionId") int sessionId, @Param("studentId") int studentId);

    @Select("SELECT * FROM session WHERE session_id = #{sessionId}")
    Session getSessionById(@Param("sessionId") int sessionId);

    @Select("SELECT * FROM session WHERE student_id = #{studentId}")
    List<Session> getSessionsByStudent(int studentId);

    @Select("SELECT * FROM session WHERE task_id = #{taskId}")
    List<Session> getSessionsByTask(int taskId);
}
