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
    public @ResponseBody String storePassword(@RequestParam String serviceName, @RequestParam String email, 
    @RequestParam String newPassword, @RequestParam(required = false) String note, @RequestParam String userName,
    @RequestParam(required = false) String category){

        User user = userRepository.findByEmail(email);
        Password password = new Password();

        Long timestamp = Instant.now().toEpochMilli();

        password.setServiceName(serviceName);
        password.setUserName(userName);
        password.setPassword(newPassword);
        password.setNotes(note);
        password.setCategory(category);
        password.setUser(user);
        password.setDateCreated(timestamp);
        passwordRepository.save(password);

        return "password stored!";
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
    public @ResponseBody List<Password> getPasswords(@RequestParam Long userId) {
        User user = userRepository.findByUserId(userId)
                                  .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPasswords();
    }

}
