package cn.edu.zjut.sessionservice.Service.Impl;

import cn.edu.zjut.sessionservice.Mapper.TaskMapper;
import cn.edu.zjut.sessionservice.Model.Task;
import cn.edu.zjut.sessionservice.Service.TaskServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskServiceI {

    @Autowired
    private TaskMapper taskMapper;

    @Override
    public boolean createTask(Task task) {
        return taskMapper.createTask(task);
    }

    @Override
    public boolean updateTask(Task task, int teacherId) {
        return taskMapper.updateTask(task, teacherId);
    }

    @Override
    public boolean deleteTask(int taskId, int teacherId) {
        return taskMapper.deleteTask(taskId, teacherId);
    }

    @Override
    public List<Task> getTasksByLesson(int lessonId) {
        return taskMapper.getTasksByLesson(lessonId);
    }

    @Override
    public List<Task> getTasksByStudent(int studentId) {
        return taskMapper.getTasksByStudent(studentId);
    }
}
