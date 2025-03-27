//Doc used for implementation: https://spring.io/guides/gs/accessing-data-mysql
package com.securevault.passwordmanager.User;

import java.util.List;

import com.securevault.passwordmanager.Password.Password;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity // This tells Hibernate to make a table out of this class
public class User {
  @Id // Telling hiberante, the next field will be a primary key (unique
      // differentiation)
  @GeneratedValue(strategy = GenerationType.AUTO) // Auto generate ids as users are created
  private Long userId;
  private String firstName;
  private String lastName;
  private String email;
  private String password;
  private Long lastLoginDate;

  // One-to-Many relationship with passwords
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Password> passwords;

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long id) {
    this.userId = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Long getLastLoginDate() {
    return lastLoginDate;
  }

  public void setLastLoginDate(Long lastLoginDate) {
    this.lastLoginDate = lastLoginDate;
  }

  public List<Password> getPasswords() {
    return passwords;
  }

  public void setPasswords(List<Password> passwords) {
    this.passwords = passwords;
  }

}