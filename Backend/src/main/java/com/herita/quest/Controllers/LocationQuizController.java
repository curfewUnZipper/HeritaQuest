package com.herita.quest.Controllers;

import com.herita.quest.Entity.QuizResponse;
import com.herita.quest.Services.LocationQuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/LocationQuiz")
public class LocationQuizController {

    @Autowired
    private LocationQuizService loactionQuizService;

//    @GetMapping("/getLeaderBoard")
//    public ResponseEntity<?> LeaderBoard(){
//        return loactionQuizService.leaderboard();
//    }

    @GetMapping("/getLeaderboard")
    public ResponseEntity<?> LocationQuizLeaderBoard(){
        return loactionQuizService.LocationQuizLeaderBoard();
    }

    @GetMapping("/getHistory")
    public ResponseEntity<?> getHistory(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String username=authentication.getName();
        return loactionQuizService.LocationHistory(username);
    }

    @PutMapping("/updateLocationQuizResponse")
    public ResponseEntity<?> updateQuizResponse(QuizResponse quizResponse){
        Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
        String username=authentication.getName();
         return loactionQuizService.updateLocationQuizResponse(quizResponse,username);
    }
}
