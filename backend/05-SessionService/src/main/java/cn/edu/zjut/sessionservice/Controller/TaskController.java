package cn.edu.zjut.sessionservice.Controller;
import cn.edu.zjut.sessionservice.Model.Task;
import cn.edu.zjut.sessionservice.Service.TaskServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskServiceI taskService;

    @PostMapping("/create")
    public boolean createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/update/{teacherId}")
    public boolean updateTask(@RequestBody Task task, @PathVariable int teacherId) {
        return taskService.updateTask(task, teacherId);
    }

    @DeleteMapping("/delete")
    public boolean deleteTask(@PathVariable int taskId, @PathVariable int teacherId) {
        return taskService.deleteTask(taskId, teacherId);
    }

    @GetMapping("/byLesson/{lessonId}")
    public List<Task> getTasksByLesson(@PathVariable int lessonId) {
        return taskService.getTasksByLesson(lessonId);
    }

    @GetMapping("/byStudent/{studentId}")
    public List<Task> getTasksByStudent(@PathVariable int studentId) {
        return taskService.getTasksByStudent(studentId);
    }
}
