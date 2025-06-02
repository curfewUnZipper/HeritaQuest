package com.herita.quest.Services;

import com.herita.quest.Entity.User;
import com.herita.quest.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class UserDetailServiceImp implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(identifier);
        if(user==null) user=userRepo.findByEmail(identifier);

        if(user!=null){
            UserDetails userDetails= org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .build();
            return userDetails;
        }
        else throw new UsernameNotFoundException("User not found with username or email"+identifier);
    }
}
