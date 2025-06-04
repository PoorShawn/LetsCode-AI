package cn.edu.zjut.curriculumservice.Service.Impl;
import cn.edu.zjut.curriculumservice.Mapper.CurriculumMapper;
import cn.edu.zjut.curriculumservice.Model.Curriculum;
import cn.edu.zjut.curriculumservice.Service.CurriculumServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CurriculumServiceImpl implements CurriculumServiceI {
    @Autowired
    private CurriculumMapper curriculumMapper;

    @Override
    public boolean createCurriculum(Curriculum curriculum) {
        return curriculumMapper.createCurriculum(curriculum);
    }

    @Override
    public boolean updateCurriculum(Curriculum curriculum) {
        return curriculumMapper.updateCurriculum(curriculum);
    }

    @Override
    public boolean deleteCurriculum(int lessonId) {
        return curriculumMapper.deleteCurriculum(lessonId);
    }

    @Override
    @Transactional // 报名方法开启事务
    public boolean enrollStudent(int studentId, int lessonId) {
        boolean inserted = curriculumMapper.enrollStudent(studentId, lessonId);
        boolean updated = curriculumMapper.incrementEnrolled(lessonId);
        return inserted && updated;
    }

    @Override
    @Transactional // 退课方法开启事务
    public boolean withdrawStudent(int studentId, int lessonId) {
        boolean deleted = curriculumMapper.withdrawStudent(studentId, lessonId);
        boolean updated = curriculumMapper.decrementEnrolled(lessonId);
        return deleted && updated;
    }

    @Override
    public List<Curriculum> getAllCurriculums() {
        return curriculumMapper.getAllCurriculums();
    }
}
