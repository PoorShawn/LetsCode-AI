package cn.edu.zjut.curriculumservice.Controller;
import cn.edu.zjut.curriculumservice.Model.Curriculum;
import cn.edu.zjut.curriculumservice.Service.CurriculumServiceI;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/curriculum")
@AllArgsConstructor
@ComponentScan("cn.edu.zjut.curriculumservice")
public class CurriculumController {
    @Autowired
    private CurriculumServiceI curriculumService;

    @PostMapping("/create")
    public boolean create(@RequestBody Curriculum curriculum) {
        return curriculumService.createCurriculum(curriculum);
    }

    @PutMapping("/update")
    public boolean update(@RequestBody Curriculum curriculum) {
        return curriculumService.updateCurriculum(curriculum);
    }

    @DeleteMapping("/delete/{lessonId}")
    public boolean delete(@PathVariable int lessonId) {
        return curriculumService.deleteCurriculum(lessonId);
    }

    @PostMapping("/enroll/{studentId}/{lessonId}")
    public boolean enroll(@PathVariable int studentId, @PathVariable int lessonId) {
        return curriculumService.enrollStudent(studentId, lessonId);
    }

    @DeleteMapping("/withdraw/{studentId}/{lessonId}")
    public boolean withdraw(@PathVariable int studentId, @PathVariable int lessonId) {
        return curriculumService.withdrawStudent(studentId, lessonId);
    }

    @GetMapping
    public List<Curriculum> listAll() {
        return curriculumService.getAllCurriculums();
    }
}
