package cn.edu.zjut.sessionservice.Controller;

import cn.edu.zjut.sessionservice.Model.History;
import cn.edu.zjut.sessionservice.Service.HistoryServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/history")
public class HistoryController {

    @Autowired
    private HistoryServiceI historyService;

    @PostMapping("/add")
    public boolean addHistory(@RequestBody History history) {
        return historyService.addHistory(history);
    }

    @GetMapping("/bySession/{sessionId}/{userId}/{role}")
    public List<History> getHistoryBySession(@PathVariable int sessionId, @PathVariable int userId, @PathVariable String role) {
        return historyService.getHistoryBySession(sessionId, userId, role);
    }

    @GetMapping("/byTask/{taskId}/{teacherId}")
    public List<History> getHistoryByTask(@PathVariable int taskId, @PathVariable int teacherId) {
        return historyService.getHistoryByTask(taskId, teacherId);
    }
}
