package com.securevault.passwordmanager;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Password {

    @Id

    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long passwordId;
    private String password;
    private String userName;
    private String notes;
    private String category;

       // Many-to-One relationship with User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // This creates a foreign key column "user_id"
    private User user;

    public Long getPasswordId() {
        return passwordId;
    }

    public void setPasswordId(Long id) {
        this.passwordId = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


}
