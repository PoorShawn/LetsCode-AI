package cn.edu.zjut.curriculumservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement // 通常 Spring Boot 自动开启事务管理，但加上更稳妥
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
