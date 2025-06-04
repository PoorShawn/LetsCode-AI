package cn.edu.zjut.learninganalyticsservice.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class LearningAnalytics {
    private int CodingID;
    private String CodingContent;
    private String SubmitTime;
    private int SessionID;
    private int score;
    private String feedback;

    public int getCodingID() {
        return CodingID;
    }

    public void setCodingID(int codingID) {
        this.CodingID = codingID;
    }

    public String getCodingContent() {
        return CodingContent;
    }

    public void setCodingContent(String codingContent) {
        this.CodingContent = codingContent;
    }

    public String getSubmitTime() {
        return SubmitTime;
    }

    public void setSubmitTime(String submitTime) {
        this.SubmitTime = submitTime;
    }

    public int getSessionID() {
        return SessionID;
    }

    public void setSessionID(int sessionID) {
        this.SessionID = sessionID;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
