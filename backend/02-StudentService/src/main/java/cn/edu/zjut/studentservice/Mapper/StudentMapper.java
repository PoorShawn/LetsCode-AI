package cn.edu.zjut.studentservice.Mapper;
import cn.edu.zjut.studentservice.Model.Student;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StudentMapper {
    @Select("SELECT * FROM student WHERE email = #{email} AND password = #{password}")
    Student login(@Param("email") String email, @Param("password") String password);

    @Insert("INSERT INTO student(name, email, password, major, grade) " +
            "VALUES(#{name}, #{email}, #{password}, #{major}, #{grade})")
    boolean register(Student student);

    @Update("UPDATE student SET name=#{name}, email=#{email}, major=#{major}, grade=#{grade} WHERE id=#{id}")
    boolean updateInfo(Student student);

    @Update("UPDATE student SET password=#{newPwd} WHERE ID=#{id} AND password=#{oldPwd}")
    int updatePassword(@Param("id") int id, @Param("oldPwd") String oldPwd, @Param("newPwd") String newPwd);

    @Delete("DELETE FROM student WHERE id=#{id}")
    boolean delete(@Param("id") int id);

    @Select("SELECT * FROM student WHERE id=#{id}")
    Student getStudentById(@Param("id") int id);

    @Select("<script>" +
            "SELECT * FROM student" +
            "<where>" +
            "<if test='name != null'> AND name LIKE CONCAT('%', #{name}, '%')</if>" +
            "<if test='major != null'> AND major LIKE CONCAT('%', #{major}, '%')</if>" +
            "<if test='grade != null'> AND grade LIKE CONCAT('%', #{grade}, '%')</if>" +
            "</where>" +
            "</script>")
    List<Student> search(@Param("name") String name,
                         @Param("major") String major,
                         @Param("grade") String grade);


}

