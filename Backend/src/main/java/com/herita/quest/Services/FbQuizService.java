package com.herita.quest.Services;

import com.herita.quest.Entity.*;
import com.herita.quest.Repository.FbQuizRepo;
import com.herita.quest.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FbQuizService {
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private FbQuizRepo fbQuizRepo;
    public ResponseEntity<?> LocationQuizLeaderBoard() {
        List<User> users = userRepo.findAll();

        if (users.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);

        List<LocationQuizDTO> quizList = users.stream()
                .filter(user -> !user.getFbQuiz().isEmpty())
                .map(user -> {
                    int sum=0;
                    for(int i=0;i<user.getFbQuiz().size();i++){
                        sum+=user.getFbQuiz().get(i).getMarks();
                    }
                    return new LocationQuizDTO(user.getUsername(), sum, user.getUserImageUrl());
                })
                .sorted((a,b)->a.getMarks()- b.getMarks())
                .collect(Collectors.toList());

        return new ResponseEntity<>(quizList, HttpStatus.OK);
    }
    public ResponseEntity<?> fbHistory(String username) {
        User user=userRepo.findByUsername(username);
        if(user==null) return new ResponseEntity<>("user not found",HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(user.getFbQuiz(),HttpStatus.OK);
    }
    public ResponseEntity<?> updatefbQuizResponse(QuizResponse quizResponse,String username){
        User user=userRepo.findByUsername(username);
        Optional<FBQuiz> fbQuizQuestion=user.getFbQuiz().stream().filter((q)->q.getId().equals(quizResponse.getId())).findFirst();
        if (!fbQuizQuestion.isPresent()) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        fbQuizQuestion.get().setMarks(quizResponse.getMarks());
        fbQuizQuestion.get().getQuestions().forEach((q)->{
            if(quizResponse.getResponse().containsKey(q.getId())){
                q.setUser_response(quizResponse.getResponse().get(q.getId()));
            }
        });
        fbQuizRepo.save(fbQuizQuestion.get());
        return new ResponseEntity<>(HttpStatus.OK);

    }
}
