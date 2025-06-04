package cn.edu.zjut.curriculumservice.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class Curriculum {
    private int LessonId;
    private String LessonName;
    private String teacherId;
    private String LessonTerm;
    private int capacity;       // 总容量
    private int enrolledCount;  // 当前报名人数

    public Curriculum() {
        // 无参构造函数，Jackson 要求
    }
    // LessonID 的 getter 和 setter
    public int getLessonId() {
        return LessonId;
    }

    public void setLessonId(int LessonID) {
        this.LessonId = LessonId;
    }

    // LessonName 的 getter 和 setter
    public String getLessonName() {
        return LessonName;
    }

    public void setLessonName(String lessonName) {
        this.LessonName = lessonName;
    }

    // Teacher_TeacherID 的 getter 和 setter
    public String getteacherId() {
        return teacherId;
    }

    public void setteacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    // LessonTerm 的 getter 和 setter
    public String getLessonTerm() {
        return LessonTerm;
    }

    public void setLessonTerm(String lessonTerm) {
        this.LessonTerm = lessonTerm;
    }

    // capacity 的 getter 和 setter
    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    // enrolledCount 的 getter 和 setter
    public int getEnrolledCount() {
        return enrolledCount;
    }

    public void setEnrolledCount(int enrolledCount) {
        this.enrolledCount = enrolledCount;
    }

}


