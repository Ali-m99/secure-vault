//Doc used for implementation: https://spring.io/guides/gs/accessing-data-mysql
package com.securevault.passwordmanager.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface UserRepository extends CrudRepository<User, Long> {

    User findByEmail(String email);

    Optional<User> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :newPassword, u.passwordHint = :newPasswordHint WHERE u.userId = :userId")
    void resetPassword(Long userId, String newPassword, String newPasswordHint);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.email = :newEmail WHERE u.userId = :userId")
    void updateEmail(Long userId, String newEmail);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLoginDate = :lastLoginDate WHERE u.userId = :userId")
    void updateLastLoginDate(Long userId, Long lastLoginDate);
        
}