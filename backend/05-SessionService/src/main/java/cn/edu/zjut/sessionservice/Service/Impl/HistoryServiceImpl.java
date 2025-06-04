package cn.edu.zjut.sessionservice.Service.Impl;

import cn.edu.zjut.sessionservice.Mapper.HistoryMapper;
import cn.edu.zjut.sessionservice.Mapper.SessionMapper;
import cn.edu.zjut.sessionservice.Mapper.TaskMapper;
import cn.edu.zjut.sessionservice.Model.History;
import cn.edu.zjut.sessionservice.Model.Session;
import cn.edu.zjut.sessionservice.Model.Task;
import cn.edu.zjut.sessionservice.Service.HistoryServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryServiceImpl implements HistoryServiceI {

    @Autowired
    private HistoryMapper historyMapper;

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private TaskMapper taskMapper;

    @Override
    public boolean addHistory(History history) {
        return historyMapper.addHistory(history);
    }

    @Override
    public List<History> getHistoryBySession(int sessionId, int userId, String role) {
        Session session = sessionMapper.getSessionById(sessionId);
        if (session == null) return null;

        // 学生只能查看自己的 session
        if ("student".equalsIgnoreCase(role) && session.getStudentId() != userId) {
            return null;
        }

        return historyMapper.getHistoryBySession(sessionId);
    }

    @Override
    public List<History> getHistoryByTask(int taskId, int teacherId) {
        Task task = taskMapper.getTaskById(taskId);
        if (task == null || task.getTeacherId() != teacherId) {
            return null; // 无权限
        }
        return historyMapper.getHistoryByTask(taskId);
    }

    @Override
    public void saveHistory(History history) {
        historyMapper.addHistory(history); // 与 addHistory 等价调用
    }
}
