package cn.edu.zjut.enrollmentservice.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class Enrollment {
    private int studentId;
    private int lessonId;
    private int studentHasLessonId;

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public int getLessonId() {
        return lessonId;
    }

    public void setLessonId(int lessonId) {
        this.lessonId = lessonId;
    }

    public int getStudentHasLessonId() {
        return studentHasLessonId;
    }

    public void setStudentHasLessonId(int studentHasLessonId) {
        this.studentHasLessonId = studentHasLessonId;
    }
}
