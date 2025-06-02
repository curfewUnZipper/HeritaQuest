package com.herita.quest.Controllers;

import com.herita.quest.Entity.QuizResponse;
import com.herita.quest.Services.FbQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("FB-quiz")
public class FbQuizController {

    @Autowired
    private FbQuizService fbQuizService;
    @GetMapping("/getLeaderboard")
    public ResponseEntity<?> LocationQuizLeaderBoard(){
        return fbQuizService.LocationQuizLeaderBoard();
    }

    @GetMapping("/getHistory")
    public ResponseEntity<?> getHistory(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String username=authentication.getName();
        return fbQuizService.fbHistory(username);
    }


    @PutMapping("/updateFbQuizResponse")
    public ResponseEntity<?> updateQuizResponse(@RequestBody QuizResponse quizResponse){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String username=authentication.getName();
        return fbQuizService.updatefbQuizResponse(quizResponse,username);
    }
}
