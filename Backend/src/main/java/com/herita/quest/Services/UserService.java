package com.herita.quest.Services;

import com.herita.quest.Entity.User;
import com.herita.quest.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class UserService {
    @Autowired
    public UserRepo userRepo;
    private static final PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
    public User findByUsername(String userName){
        return userRepo.findByUsername(userName);
    }
    public User findByEmail(String email){
        return userRepo.findByEmail(email);
    }
    public void createNewUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
    }

    public ResponseEntity<?> updateUser(User newUser, User oldUser){
        if(newUser.getUsername()!=null && !newUser.getUsername().isEmpty() && !newUser.getUsername().equals(oldUser.getUsername())){
            User updatedUser=userRepo.findByUsername(newUser.getUsername());
            if(updatedUser!=null) return new ResponseEntity<>("user already exist with this userName", HttpStatus.BAD_REQUEST);
            oldUser.setUsername(newUser.getUsername());
        }
        if(newUser.getUsername()!=null&&!newUser.getPassword().isEmpty()){
            oldUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        }
        if(newUser.getName()!=null && !newUser.getName().isEmpty() && !newUser.getName().equals(oldUser.getName())) {
            oldUser.setName(newUser.getName());
        }
        if(newUser.getEmail()!=null && !newUser.getEmail().isEmpty() && !newUser.getEmail().equals(oldUser.getEmail())){
            User updatedUser=userRepo.findByEmail(newUser.getEmail());
            if(updatedUser!=null)  return new ResponseEntity<>("user already exist with this email", HttpStatus.BAD_REQUEST);
            oldUser.setEmail(newUser.getEmail());
        }
        userRepo.save(oldUser);
        return new ResponseEntity<>(oldUser,HttpStatus.CREATED);
    }

    public void deleteUser(User user){
        userRepo.delete(user);
    }

}
