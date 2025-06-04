package cn.edu.zjut.sessionservice.Mapper;

import cn.edu.zjut.sessionservice.Model.History;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface HistoryMapper {

    @Insert("INSERT INTO history (session_id, sender_id, sender_type, content, time) VALUES (#{sessionId}, #{senderId}, #{senderType}, #{content}, #{time})")
    boolean addHistory(History history);

    @Select("SELECT * FROM history WHERE session_id = #{sessionId}")
    List<History> getHistoryBySession(int sessionId);

    @Select("""
        SELECT h.* FROM history h
        JOIN session s ON h.session_id = s.session_id
        WHERE s.task_id = #{taskId}
    """)
    List<History> getHistoryByTask(int taskId);

    @Insert("INSERT INTO history (session_id, sender_id, sender_type, content, time) " +
            "VALUES (#{sessionId}, #{senderId}, #{senderType}, #{content}, #{time})")
    void saveHistory(History history);
}
