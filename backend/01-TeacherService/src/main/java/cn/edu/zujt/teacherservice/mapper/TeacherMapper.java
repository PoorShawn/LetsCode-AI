package cn.edu.zujt.teacherservice.mapper;

import cn.edu.zujt.teacherservice.Model.Teacher;
import cn.edu.zujt.teacherservice.dto.TeacherDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TeacherMapper {
    // 注册/添加教师
    @Insert("INSERT INTO teacher(teacher_id, teacher_name, teacher_email, password, department, title) " +
            "VALUES (#{teacherId}, #{teacherName}, #{teacherEmail}, #{password}, #{department}, #{title})")
    @Options(useGeneratedKeys = true, keyProperty = "teacherId")
    int registerTeacher(Teacher teacher);

    // 根据ID获取教师完整信息
    @Select("SELECT teacher_id, teacher_name, teacher_email, department, title FROM teacher WHERE teacher_id = #{teacherId}")
    TeacherDto getTeacherById(int teacherId);

    // 获取所有教师信息
    @Select("SELECT teacher_id, teacher_name, teacher_email, department, title FROM teacher")
    List<TeacherDto> getAllTeachers();

    // 更新教师基本信息
    @Update("UPDATE teacher SET " +
            "teacher_name = #{teacherName}, " +
            "teacher_email = #{teacherEmail}, " +
            "department = #{department}, " +
            "title = #{title} " +
            "WHERE teacher_id = #{teacherId}")
    int updateTeacher(Teacher teacher);

    // 更新密码
    @Update("UPDATE teacher SET password = #{password} WHERE teacher_id = #{teacherId}")
    int updatePassword(@Param("teacherId") int teacherId, @Param("password") String password);

    // 删除教师
    @Delete("DELETE FROM teacher WHERE teacher_id = #{teacherId}")
    int deleteTeacher(int teacherId);

    // 获取密码(用于登录验证)
    //@Select("SELECT password FROM teacher WHERE teacher_id = #{teacherId}")
    //String getPasswordByID(int teacherId);
    @Select("SELECT * FROM teacher WHERE Teacher_Email = #{TeacherEmail} AND password = #{password}")
    Teacher login(@Param("TeacherEmail") String TeacherEmail, @Param("password") String password);

    // 搜索教师
    @Select("<script>" +
            "SELECT teacher_id, teacher_name, teacher_email, department, title FROM teacher " +
            "<where>" +
            "   <if test='name != null'>AND teacher_name LIKE CONCAT('%', #{name}, '%')</if>" +
            "   <if test='department != null'>AND department LIKE CONCAT('%', #{department}, '%')</if>" +
            "</where>" +
            "</script>")
    List<TeacherDto> searchTeachers(@Param("name") String name, @Param("department") String department);
}