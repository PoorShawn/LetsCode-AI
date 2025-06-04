package cn.edu.zjut.sessionservice.Service;

import cn.edu.zjut.sessionservice.Model.Task;
import java.util.List;

public interface TaskServiceI {
    boolean createTask(Task task);
    boolean updateTask(Task task, int teacherId);
    boolean deleteTask(int taskId, int teacherId);
    List<Task> getTasksByLesson(int lessonId);
    List<Task> getTasksByStudent(int studentId);
}