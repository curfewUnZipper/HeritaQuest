package com.herita.quest.Services;

import com.herita.quest.Entity.*;
import com.herita.quest.Repository.LocationQuizRepo;
import com.herita.quest.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LocationQuizService {
    @Autowired
    private LocationQuizRepo locationQuizRepo;
    @Autowired
    private UserRepo userRepo;
//    public ResponseEntity<List<LocationQuizDTO>> leaderboard(){
//        List<LocationQuiz> quizzes=locationQuizRepo.findAll();
//
//        if(quizzes.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//
//        return new ResponseEntity<>(quizzes.stream().map(quiz -> {
//            String username = (quiz.getUser() != null) ? quiz.getUser().getUsername() : "N/A";
//            String userImageUrl = (quiz.getUser() != null) ? quiz.getUser().getUserImageUrl() : "";
//            return new LocationQuizDTO(quiz.getName(), quiz.getMarks(), username, userImageUrl);
//        }).sorted(((a, b) -> a.getMarks() - b.getMarks())).collect(Collectors.toList()), HttpStatus.OK);
//    }

    public ResponseEntity<List<LocationQuizDTO>> LocationQuizLeaderBoard() {
        List<User> users = userRepo.findAll();

        if (users.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        List<LocationQuizDTO> quizList = users.stream()
                .filter(user -> !user.getQuizzes().isEmpty())
                .map(user -> {
                    int sum=0;
                    for(int i=0;i<user.getQuizzes().size();i++){
                        sum+=user.getQuizzes().get(i).getMarks();
                    }
                    return new LocationQuizDTO(user.getUsername(), sum, user.getUserImageUrl());
                })
                .sorted((a,b)->a.getMarks()- b.getMarks())
                .collect(Collectors.toList());

        return new ResponseEntity<>(quizList, HttpStatus.OK);
    }


    public ResponseEntity<?> LocationHistory(String username) {
        User user=userRepo.findByUsername(username);
        if(user==null) return new ResponseEntity<>("user not found",HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(user.getQuizzes(),HttpStatus.OK);
    }

    public ResponseEntity<?> updateLocationQuizResponse(QuizResponse quizResponse,String username){
        User user = userRepo.findByUsername(username);

        Optional<LocationQuiz> optionalQuiz = user.getQuizzes()
                .stream()
                .filter(q -> q.getId().equals(quizResponse.getId()))
                .findFirst();

        if (!optionalQuiz.isPresent()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        LocationQuiz quiz = optionalQuiz.get();
        quiz.setMarks(quizResponse.getMarks());

        Map<Long, String> responseMap = quizResponse.getResponse();
        for (LocationQuizQuestion question : quiz.getQuestions()) {
            if (responseMap.containsKey(question.getId())) {
                question.setUser_response(responseMap.get(question.getId()));
            }
        }
        locationQuizRepo.save(quiz);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
