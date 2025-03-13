package com.securevault.passwordmanager.Password;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.securevault.passwordmanager.User.User;
import com.securevault.passwordmanager.User.UserRepository;

import java.time.Instant;

@Controller
@RequestMapping(path="/password")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordController {
    
    @Autowired
    private PasswordRepository passwordRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(path="/store")
    public @ResponseBody String storePassword(@RequestParam String serviceName, @RequestParam String encryptedPassword, 
        @RequestParam String salt, @RequestParam(required = false) String note, @RequestParam String userName,
        @RequestParam(required = false) String category, @RequestParam String email) {

        Long timestamp = Instant.now().toEpochMilli();
    
        User user = userRepository.findByEmail(email);
        Password password = new Password();
    
        password.setServiceName(serviceName);
        password.setEncryptedPassword(encryptedPassword);
        password.setSalt(salt);
        password.setUserName(userName);
        password.setNotes(note);
        password.setCategory(category);
        password.setDateCreated(timestamp);
        password.setUser(user);
    
        passwordRepository.save(password);
        return "Password stored!";
    }

    @PostMapping(path="/delete")
    public @ResponseBody String deletePassword(@RequestParam Long passwordId){
        passwordRepository.deletePassword(passwordId);
        return "password deleted";
    }

    @PostMapping(path="/update")
    public @ResponseBody String updatePassword(@RequestParam(required = false) String serviceName, @RequestParam Long passwordId, 
    @RequestParam(required = false) String newPassword, @RequestParam(required = false) String note, @RequestParam(required = false) String userName,
    @RequestParam(required = false) String category){
        Long timestamp = Instant.now().toEpochMilli();
        passwordRepository.updatePasswordDetails(passwordId, serviceName, newPassword, note, userName,
        category, timestamp);
        return "password details updated";
    } 

    @GetMapping("/getPasswords")
    public @ResponseBody List<Password> getPasswords(@RequestParam String userId) {
        System.out.println(userId);
        User user = userRepository.findByUserId(Long.parseLong(userId))
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPasswords();
    }

}
