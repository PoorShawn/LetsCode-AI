package cn.edu.zjut.learninganalyticsservice.Service.Impl;

import cn.edu.zjut.learninganalyticsservice.Mapper.LearningAnalyticsMapper;
import cn.edu.zjut.learninganalyticsservice.Model.LearningAnalytics;
import cn.edu.zjut.learninganalyticsservice.Service.LearningAnalyticsServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningAnalyticsServiceImpl implements LearningAnalyticsServiceI {

    @Autowired
    private LearningAnalyticsMapper codingMapper;

    @Override
    public boolean submitCoding(LearningAnalytics coding) {
        return codingMapper.submitCoding(coding);
    }

    @Override
    public boolean updateCoding(LearningAnalytics coding) {
        return codingMapper.updateCoding(coding);
    }

    @Override
    public boolean deleteCoding(int codingId, int studentId) {
        return codingMapper.deleteCoding(codingId, studentId);
    }

    @Override
    public List<LearningAnalytics> getCodingBySession(int sessionId, int userId, String role) {
        Integer ownerId = codingMapper.getStudentIdBySession(sessionId);
        if (ownerId == null) return null;

        if (role.equals("student") && !ownerId.equals(userId)) {
            return null;
        }

        if (role.equals("teacher")) {
            List<Integer> teacherSessions = codingMapper.getSessionIdsByTeacher(userId);
            if (!teacherSessions.contains(sessionId)) return null;
        }

        return codingMapper.getCodingBySession(sessionId);
    }

    @Override
    public boolean evaluateCoding(int codingId, int teacherId, int score, String comment) {
        // 可加入 teacher 验证逻辑
        return codingMapper.evaluateCoding(codingId, teacherId, score, comment);
    }
}
