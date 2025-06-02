package com.herita.quest.Controllers;

import com.herita.quest.Entity.User;
import com.herita.quest.Services.ImageService;
import com.herita.quest.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userServices;
    @Autowired
    private static final PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();
    @Autowired
    private ImageService imageService;

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User user){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();

        User userInDb=userServices.findByUsername(userName);

        return userServices.updateUser(user,userInDb);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        userServices.deleteUser(userInDb);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/user-img")
    public ResponseEntity<String> uploadImg(@RequestParam("image") MultipartFile userImg){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        if(!userImg.getContentType().startsWith("image/")){
            return new ResponseEntity<>("Invalid file type",HttpStatus.BAD_REQUEST);
        }
        try{
            String imageurl=imageService.uploadImage(userImg,userInDb);
            return new ResponseEntity<>(imageurl,HttpStatus.OK);
        }
        catch(IOException e){
            return new ResponseEntity<>("Image upload failed",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete-img")
    public ResponseEntity<?> deleteImg(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        try{
            imageService.deleteImg(userInDb);
            return new ResponseEntity<>("Image deleted",HttpStatus.OK);
        }
        catch(IOException e){
            return new ResponseEntity<>("faile to delete",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("fetchUserDetail")
    public ResponseEntity<?> fetchUserDetail(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String userName=authentication.getName();
        User userInDb=userServices.findByUsername(userName);
        return new ResponseEntity<>(userInDb,HttpStatus.OK);
    }
}
