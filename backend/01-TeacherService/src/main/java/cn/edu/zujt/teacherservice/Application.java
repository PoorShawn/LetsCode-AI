package cn.edu.zujt.teacherservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("cn.edu.zujt")
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
