package cn.edu.zjut.learninganalyticsservice.Mapper;

import cn.edu.zjut.learninganalyticsservice.Model.LearningAnalytics;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface LearningAnalyticsMapper {

    @Insert("INSERT INTO coding (coding_content, submit_time, session_id) " +
            "VALUES (#{codingContent}, #{submitTime}, #{sessionId})")
    boolean submitCoding(LearningAnalytics coding);

    @Update("UPDATE coding SET coding_content = #{codingContent}, submit_time = #{submitTime} " +
            "WHERE coding_id = #{codingId}")
    boolean updateCoding(LearningAnalytics coding);

    @Delete("""
            DELETE FROM coding 
            WHERE coding_id = #{codingId} 
            AND session_id IN (
                SELECT session_id FROM session 
                WHERE student_id = #{studentId}
            )
            """)
    boolean deleteCoding(@Param("codingId") int codingId, @Param("studentId") int studentId);

    @Select("""
            SELECT * FROM coding 
            WHERE session_id = #{sessionId}
            """)
    List<LearningAnalytics> getCodingBySession(@Param("sessionId") int sessionId);

    @Update("UPDATE coding SET score = #{score}, comment = #{comment} WHERE coding_id = #{codingId}")
    boolean evaluateCoding(@Param("codingId") int codingId,
                           @Param("score") Integer score,
                           int i, @Param("comment") String comment);

    @Select("SELECT student_id FROM session WHERE session_id = #{sessionId}")
    Integer getStudentIdBySession(@Param("sessionId") int sessionId);

    @Select("""
        SELECT s.session_id FROM session s
        JOIN task t ON s.session_id = t.session_id
        JOIN lesson c ON c.lesson_id = t.lesson_id
        WHERE c.teacher_id = #{teacherId}
        """)
    List<Integer> getSessionIdsByTeacher(@Param("teacherId") int teacherId);
}
