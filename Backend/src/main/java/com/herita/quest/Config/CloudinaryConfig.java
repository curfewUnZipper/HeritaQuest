package com.herita.quest.Config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloud.name}")
    private String cloudName;

    @Value("${api.key}")
    private String apiKey;

    @Value("${api.secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> mp = new HashMap<>();
        mp.put("cloud_name", cloudName);
        mp.put("api_key", apiKey);
        mp.put("api_secret", apiSecret);
        return new Cloudinary(mp);
    }
}