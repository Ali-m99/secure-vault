package com.securevault.passwordmanager;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

// Security configuration class for user authentication

@Configuration
public class SecurityConfig {

    // Bean for filtering which URLs that users can access while they're authenticated or not
    // and also whether to generate a CSRF token or not for sessions.
    // Without this, requests to our app will not work!!
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF for development (enable in production)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll() // Allow public access to /user endpoints
                        .anyRequest().authenticated()); // Secure all other endpoints

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Define the encoder as a bean
    }
}
