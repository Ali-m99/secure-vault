package com.securevault.passwordmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
    public @ResponseBody String storePassword(@RequestParam String email, 
    @RequestParam String newPassword, @RequestParam(required = false) String note, @RequestParam String userName,
    @RequestParam(required = false) String category){

        User user = userRepository.findByEmail(email);
        Password password = new Password();

        password.setUserName(userName);
        password.setPassword(newPassword);
        password.setNotes(note);
        password.setCategory(category);
        password.setUser(user);
        passwordRepository.save(password);

        return "password stored!";
    }


}
