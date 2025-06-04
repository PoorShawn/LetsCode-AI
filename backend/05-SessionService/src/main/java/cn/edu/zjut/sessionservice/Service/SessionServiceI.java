package cn.edu.zjut.sessionservice.Service;
import cn.edu.zjut.sessionservice.Model.Session;

import java.util.List;
public interface SessionServiceI {
    boolean createSession(Session session);
    boolean deleteSession(int sessionId, int studentId);
    List<Session> getSessionsByStudent(int studentId);
    List<Session> getSessionsByTask(int taskId);

}
