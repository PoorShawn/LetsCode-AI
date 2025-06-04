package cn.edu.zjut.sessionservice.Service.Impl;
import cn.edu.zjut.sessionservice.Mapper.SessionMapper;
import cn.edu.zjut.sessionservice.Model.Session;
import cn.edu.zjut.sessionservice.Service.SessionServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionServiceImpl implements SessionServiceI {

    @Autowired
    private SessionMapper sessionMapper;

    @Override
    public boolean createSession(Session session) {
        return sessionMapper.createSession(session);
    }

    @Override
    public boolean deleteSession(int sessionId, int studentId) {
        return sessionMapper.deleteSession(sessionId, studentId);
    }

    @Override
    public List<Session> getSessionsByStudent(int studentId) {
        return sessionMapper.getSessionsByStudent(studentId);
    }

    @Override
    public List<Session> getSessionsByTask(int taskId) {
        return sessionMapper.getSessionsByTask(taskId);
    }
}
