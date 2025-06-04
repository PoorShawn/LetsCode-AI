package cn.edu.zjut.studentservice.Model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class Student {
    private int id;
    private String name;
    private String email;
    private String password;
    private String major; // 专业
    private String grade; // 年级

    public Student() {
        // 无参构造函数，Jackson 要求
    }
    // id的getter和setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // name的getter和setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // email的getter和setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // password的getter和setter
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // major的getter和setter
    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    // grade的getter和setter
    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}