package cn.edu.zjut.learninganalyticsservice.Service;

import cn.edu.zjut.learninganalyticsservice.Model.LearningAnalytics;
import java.util.List;

public interface LearningAnalyticsServiceI {
    boolean submitCoding(LearningAnalytics coding);
    boolean updateCoding(LearningAnalytics coding);
    boolean deleteCoding(int codingId, int studentId);
    List<LearningAnalytics> getCodingBySession(int sessionId, int userId, String role);
    boolean evaluateCoding(int codingId, int teacherId, int score, String comment);
}
