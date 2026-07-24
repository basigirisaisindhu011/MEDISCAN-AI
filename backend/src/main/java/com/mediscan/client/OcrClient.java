package com.mediscan.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class OcrClient {

    @Value("${ocr.service.url:https://mediscan-ai-3-6yw4.onrender.com}")
    private String ocrServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> processImage(byte[] imageBytes) {
        // ✅ Ensures /process is properly appended to the base URL
        String endpoint = ocrServiceUrl.endsWith("/process") 
                ? ocrServiceUrl 
                : ocrServiceUrl.replaceAll("/+$", "") + "/process";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource contentsAsResource = new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return "prescription.jpg";
            }
        };
        body.add("file", contentsAsResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, requestEntity, Map.class);
        return response.getBody();
    }
}
