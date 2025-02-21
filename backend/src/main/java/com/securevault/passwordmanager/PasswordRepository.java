package com.securevault.passwordmanager;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PasswordRepository extends CrudRepository<Password, Long>{

    @Modifying
    @Transactional
    @Query("DELETE FROM Password p WHERE p.passwordId = :passwordId")
    void deletePassword(Long passwordId);

    @Modifying
    @Transactional
    @Query("UPDATE Password p SET p.password = :newPassword WHERE p.passwordId = :passwordId")
    void updatePassword(Long passwordId, String newPassword);

    @Transactional
    @Query("SELECT p.serviceName, p.passwordId, p.password, p.userName, p.category, p.notes FROM Password p INNER JOIN p.user u WHERE u.id = :userId")
    List<Object[]> getAllUserPasswords(Long userId);

    
}
