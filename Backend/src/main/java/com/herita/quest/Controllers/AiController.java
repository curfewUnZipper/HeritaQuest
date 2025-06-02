package com.herita.quest.Controllers;

import com.herita.quest.Services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiController {
    @Autowired
    private AiService aiService;

    @PostMapping("/generateLocationQuiz")
    public ResponseEntity<?> generateLocationQuiz(@RequestBody String question){
        try{
            Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
            String username=authentication.getName();
            if(username.isEmpty()) return new ResponseEntity<>("User Not found",HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(aiService.getAnswere(question,username),HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Un-Expected error"+e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/generate-fill-Quiz")
    public ResponseEntity<?> generateFBQuiz(@RequestBody String question){
        try{
            Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
            String username=authentication.getName();
            if(username.isEmpty()) return new ResponseEntity<>("User Not found",HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(aiService.generateFBQuiz(question,username),HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Un-Expected error"+e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
