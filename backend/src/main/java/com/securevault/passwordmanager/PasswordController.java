package com.securevault.passwordmanager;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/password")
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

        password.setServiceName(serviceName);
        password.setUserName(userName);
        password.setPassword(newPassword);
        password.setNotes(note);
        password.setCategory(category);
        password.setUser(user);
        passwordRepository.save(password);

        return "password stored!";
    }

    @PostMapping(path="/delete")
    public @ResponseBody String deletePassword(@RequestParam Long passwordId){
        passwordRepository.deletePassword(passwordId);
        return "password deleted";
    }

    @PostMapping(path="/update")
    public @ResponseBody String updatePassword(@RequestParam Long passwordId, @RequestParam String newPassword){
        passwordRepository.updatePassword(passwordId, newPassword);
        return "updated password";
    } 

    @GetMapping(path="/getPasswords")
    public @ResponseBody List<Object[]> getPasswords(@RequestParam Long userId){
       List<Object[]> userPasswords = passwordRepository.getAllUserPasswords(userId);
        return userPasswords;
    }



}
