package com.herita.quest.Entity;

import lombok.Data;

import java.util.Map;

@Data
public class QuizResponse {
    private Long id;
    private int marks;
    Map<Long,String> response;
}
