package com.herita.quest.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "App_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String name;

    private String password;
    private String userImageUrl;
    private String public_id;

    //    cascade = CascadeType.ALL -> Saving a User also saves their LocationQuiz
    //    orphanRemoval = true -> Removing a quiz from the user's quizzes list deletes that quiz from DB
//    @JsonIgnore
    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<LocationQuiz> quizzes=new ArrayList<>();

//    @JsonIgnore
    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval = true)
    private List<FBQuiz> fbQuiz=new ArrayList<>();
}
