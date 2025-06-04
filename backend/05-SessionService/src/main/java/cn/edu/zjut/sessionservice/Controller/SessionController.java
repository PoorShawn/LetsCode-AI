package cn.edu.zjut.sessionservice.Controller;

import cn.edu.zjut.sessionservice.Model.History;
import cn.edu.zjut.sessionservice.Model.Session;
import cn.edu.zjut.sessionservice.Service.AIServiceI;
import cn.edu.zjut.sessionservice.Service.HistoryServiceI;
import cn.edu.zjut.sessionservice.Service.SessionServiceI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionServiceI sessionService;

    @Autowired
    private HistoryServiceI historyService;

    @Autowired
    private AIServiceI aiService;

    @PostMapping("/create")
    public boolean createSession(@RequestBody Session session) {
        return sessionService.createSession(session);
    }

    @DeleteMapping("/delete/{sessionId}/{studentId}")
    public boolean deleteSession(@PathVariable int sessionId, @PathVariable int studentId) {
        return sessionService.deleteSession(sessionId, studentId); // 权限控制
    }

    @GetMapping("/student/{studentId}")
    public List<Session> getStudentSessions(@PathVariable int studentId) {
        return sessionService.getSessionsByStudent(studentId);
    }

    @GetMapping("/task/{taskId}")
    public List<Session> getSessionsByTask(@PathVariable int taskId) {
        return sessionService.getSessionsByTask(taskId); // 教师用
    }

    @PostMapping("/chatWithAI/{sessionId}/{studentId}")
    public String chatWithAI(@PathVariable int sessionId, @PathVariable int studentId, @RequestParam String message) {

        // Step 1: 保存学生消息
        History studentMsg = new History();
        studentMsg.setSessionId(sessionId);
        studentMsg.setSenderId(studentId);
        studentMsg.setSenderType("student");
        studentMsg.setContent(message);
        studentMsg.setTime(LocalDateTime.now());
        historyService.addHistory(studentMsg);

        // Step 2: 调用 AI 获取回复
        String aiReply = aiService.chatWithAI(message);

        // Step 3: 保存 AI 回复
        History aiMsg = new History();
        aiMsg.setSessionId(sessionId);
        aiMsg.setSenderId(0); // AI 可用 0 或 -1 表示
        aiMsg.setSenderType("ai");
        aiMsg.setContent(aiReply);
        aiMsg.setTime(LocalDateTime.now());
        historyService.addHistory(aiMsg);

        // Step 4: 返回 AI 回复
        return aiReply;
    }

}