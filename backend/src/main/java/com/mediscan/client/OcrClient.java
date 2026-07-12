package com.mediscan.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class OcrClient {
  private final RestTemplate restTemplate = new RestTemplate();

  @Value("${OCR_SERVICE_URL}")
  private String ocrServiceUrl;

  public Map<String, Object> processImage(byte[] imageBytes) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.MULTIPART_FORM_DATA);

    MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
    body.add("file", new org.springframework.core.io.ByteArrayResource(imageBytes) {
      @Override
      public String getFilename() {
        return "prescription.png";
      }
    });

    HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
    return restTemplate.postForObject(ocrServiceUrl + "/process", requestEntity, Map.class);
  }
}
