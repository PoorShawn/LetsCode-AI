package cn.edu.zjut.sessionservice.Service;

import cn.edu.zjut.sessionservice.Model.History;

import java.util.List;

public interface HistoryServiceI {
    boolean addHistory(History history);
    List<History> getHistoryBySession(int sessionId, int userId, String role);
    List<History> getHistoryByTask(int taskId, int teacherId);
    void saveHistory(History history);
}
