package cn.edu.zjut.learninganalyticsservice.Controller;

import cn.edu.zjut.learninganalyticsservice.Model.LearningAnalytics;
import cn.edu.zjut.learninganalyticsservice.Service.LearningAnalyticsServiceI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/learningAnalytics")
public class LearningAnalyticsController {

    @Autowired
    private LearningAnalyticsServiceI service;

    @PostMapping("/submit")
    public boolean submitCoding(@RequestBody LearningAnalytics coding) {
        return service.submitCoding(coding);
    }

    @PutMapping("/update")
    public boolean updateCoding(@RequestBody LearningAnalytics coding) {
        return service.updateCoding(coding);
    }

    @DeleteMapping("/delete/{codingId}/{studentId}")
    public boolean deleteCoding(@PathVariable int codingId, @PathVariable int studentId) {
        return service.deleteCoding(codingId, studentId);
    }

    @GetMapping("/getBySession/{sessionId}/{userId}/{role}")
    public List<LearningAnalytics> getCodingBySession(@PathVariable int sessionId,
                                                      @PathVariable int userId,
                                                      @PathVariable String role) {
        return service.getCodingBySession(sessionId, userId, role);
    }

    @PostMapping("/evaluate")
    public boolean evaluateCoding(@RequestParam int codingId,
                                  @RequestParam int teacherId,
                                  @RequestParam(required = false) Integer score,
                                  @RequestParam(required = false) String comment) {
        return service.evaluateCoding(codingId, teacherId, score, comment);
    }
}
