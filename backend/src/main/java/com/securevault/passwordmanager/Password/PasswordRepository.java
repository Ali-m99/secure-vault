package com.securevault.passwordmanager.Password;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface PasswordRepository extends CrudRepository<Password, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Password p WHERE p.passwordId = :passwordId")
    void deletePassword(Long passwordId);

    @Modifying
    @Transactional
    @Query(value = """
                UPDATE password
                SET
                    service_name = COALESCE(:serviceName, service_name),
                    encrypted_password = COALESCE(:encryptedPassword, encrypted_password),
                    notes = COALESCE(:note, notes),
                    user_name = COALESCE(:userName, user_name),
                    category = COALESCE(:category, category),
                    last_modified_time = COALESCE(:lastModifiedTime, last_modified_time),
                    salt = COALESCE(:salt, salt)
                WHERE password_id = :passwordId
            """, nativeQuery = true)
    void updatePasswordDetails(Long passwordId, String serviceName, String encryptedPassword, String note, String userName,
            String category, Long lastModifiedTime, String salt);


}
