package cn.edu.zjut.sessionservice.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class Task {
    private int taskId;
    private String taskName;
    private String taskContent;
    private int lessonId;      // 对应课程
    private int teacherId;
    private int Student_has_Lesson_ID;// 发布者

    // Getter and Setter for taskId
    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    // Getter and Setter for taskName
    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    // Getter and Setter for taskContent
    public String getTaskContent() {
        return taskContent;
    }

    public void setTaskContent(String taskContent) {
        this.taskContent = taskContent;
    }

    // Getter and Setter for lessonId
    public int getLessonId() {
        return lessonId;
    }

    public void setLessonId(int lessonId) {
        this.lessonId = lessonId;
    }

    // Getter and Setter for teacherId
    public int getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(int teacherId) {
        this.teacherId = teacherId;
    }

    public int getStudent_has_Lesson_ID() {
        return Student_has_Lesson_ID;
    }

    public void setStudent_has_Lesson_ID(int student_has_Lesson_ID) {
        Student_has_Lesson_ID = student_has_Lesson_ID;
    }
}
