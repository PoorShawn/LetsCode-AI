package cn.edu.zjut.sessionservice.Service.Impl;
import cn.edu.zjut.sessionservice.Service.AIServiceI;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;
@Service
public class AIServiceImpl implements AIServiceI {
    private static final String AI_API_URL = "https://your-ai-api.com/chat";
    private static final String API_KEY = "your-api-key";

    @Override
    public String chatWithAI(String prompt) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("prompt", prompt);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(AI_API_URL, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody(); // 或根据实际返回解析 JSON 提取 reply
        } else {
            return "AI服务调用失败：" + response.getStatusCode();
        }
    }
}
