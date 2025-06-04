package cn.edu.zjut.curriculumservice.Service;
import cn.edu.zjut.curriculumservice.Model.Curriculum;

import java.util.List;

public interface CurriculumServiceI {
    boolean createCurriculum(Curriculum curriculum);
    boolean updateCurriculum(Curriculum curriculum);
    boolean deleteCurriculum(int lessonId);
    boolean enrollStudent(int studentId, int lessonId);
    boolean withdrawStudent(int studentId, int lessonId);
    List<Curriculum> getAllCurriculums();
}
