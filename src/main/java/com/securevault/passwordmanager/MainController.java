package com.securevault.passwordmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller // This means that this class is a Controller
@RequestMapping(path = "/user") // This means URL's start with /user (after Application path)
public class MainController {
  @Autowired // This means to get the bean called userRepository
  // Which is auto-generated by Spring, we will use it to handle the data
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder; // Inject BCryptPasswordEncoder

  @PostMapping(path = "/register") // Map ONLY POST Requests
  public @ResponseBody String addNewUser(@RequestParam(value = "firstName") String firstName,
      @RequestParam(value = "lastName") String lastName, @RequestParam(value = "password") String password,
      @RequestParam(value = "email") String email, @RequestParam(value = "isPersonalAccount") Boolean isPersonalAccount,
      @RequestParam(value = "orgId", required = false) Long orgId) {
    // @ResponseBody means the returned String is the response, not a view name
    // @RequestParam means it is a parameter from the GET or POST request

    System.out.println("/add was reached!");

    // If there is a user that already has that email, don't create them.
    // Else, create them.
    if (userRepository.findByEmail(email) != null) {
      return "A user with the email " + email + " already exists.";
    } else {
      try {
        User n = new User();
        n.setFirstName(firstName);
        n.setLastName(lastName);
        n.setPersonalAccount(isPersonalAccount);
        String hashedPassword = passwordEncoder.encode(password);
        System.out.println("Hashed password: " + hashedPassword);
        n.setPassword(hashedPassword);
        n.setEmail(email);

        // If the account is not a personal account, set the orgId
        if (!n.isPersonalAccount()) {
          n.setOrgId(orgId);
        }

        userRepository.save(n);
        return "User saved";
      } catch (Exception e) {
        e.printStackTrace();
        return "Error saving user: " + e.getMessage();
      }
    }
  }

  @PostMapping(path = "/login")
  public @ResponseBody String authenticate(@RequestParam(value = "email") String email,
      @RequestParam(value = "password") String password) {

    User user = userRepository.findByEmail(email);

    if (user != null) {
      if (passwordEncoder.matches(password, user.getPassword())) {
        return "Logged in!";
      } else {
        return "Password is incorrect!";
      }
    } else {
      return "User not found.";
    }

  }

  @GetMapping(path = "/all")
  public @ResponseBody Iterable<User> getAllUsers() {
    // This returns a JSON or XML with the users
    return userRepository.findAll();
  }
}
