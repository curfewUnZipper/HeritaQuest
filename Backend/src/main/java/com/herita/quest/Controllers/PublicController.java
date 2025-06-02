package com.herita.quest.Controllers;


import com.herita.quest.Entity.User;
import com.herita.quest.Services.UserDetailServiceImp;
import com.herita.quest.Services.UserService;
import com.herita.quest.Utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@Slf4j
public class PublicController {
    @Autowired
    private UserService userServices;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailServiceImp userDetailServiceImp;
    @Autowired
    private JwtUtils jwtUtil;

    @GetMapping("Health-check")
    ResponseEntity<String> healthCheck(){
        return new ResponseEntity<>("App is working fine",HttpStatus.OK);
    }
    @PostMapping("Signup")
    ResponseEntity<?> Signup(@RequestBody User user){
        if(userServices.findByUsername(user.getUsername())!=null){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("User already exist with this email username");
        }
        if(userServices.findByEmail(user.getEmail())!=null){
            return new ResponseEntity<>("User already exist with this email",HttpStatus.BAD_REQUEST);
        }
        userServices.createNewUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody User user){
        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
            UserDetails userDetails=userDetailServiceImp.loadUserByUsername(user.getUsername());
            String jwt=jwtUtil.generateToken(userDetails.getUsername());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        }
        catch (Exception e){
            log.error("Exception occured while createAuthenticationToken ",e);
            return new ResponseEntity<>("Incorrect UserName or Password",HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/change-pass")
    public ResponseEntity<?> changePassword(@RequestBody User user){
        try {
            User userInDb = userServices.findByEmail(user.getEmail());
            return userServices.updateUser(user, userInDb);
        }
        catch (Exception e){
            return new ResponseEntity<>(e,HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/findUser")
    public ResponseEntity<?>  findUser(@RequestBody String identifier){
        User user=userServices.findByUsername(identifier);
        if(user==null){
            user=userServices.findByEmail(identifier);
        }
        if(user==null){
            return new ResponseEntity<>("User Not Found",HttpStatus.BAD_REQUEST);
        }else{
            User temp=new User();
            temp.setName(user.getName());
            temp.setEmail(user.getEmail());
            temp.setUsername(user.getUsername());
            return new ResponseEntity<>(temp,HttpStatus.OK);
        }
    }
}
