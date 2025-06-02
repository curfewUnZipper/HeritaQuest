package com.herita.quest.Services;

import com.cloudinary.Cloudinary;
import com.herita.quest.Entity.User;
import com.herita.quest.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImageService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserRepo userRepo;

    public String uploadImage(MultipartFile file, User user) throws IOException {
        deleteImg(user);
        Map<String,String> upload=cloudinary.uploader().upload(file.getBytes(),new HashMap<>());
        String fileUrl= upload.get("url");
        String publidId=upload.get("public_id");
        user.setUserImageUrl(fileUrl);
        user.setPublic_id(publidId);
        userRepo.save(user);
        return fileUrl;
    }
    public void deleteImg(User user) throws IOException {
        if(user.getUserImageUrl()!=null && !user.getUserImageUrl().isEmpty()){
            cloudinary.uploader().destroy(user.getPublic_id(),new HashMap<>());
            user.setPublic_id("");
            user.setUserImageUrl("");
            userRepo.save(user);
        }
    }
}
