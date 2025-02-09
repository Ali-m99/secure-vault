package com.securevault.passwordmanager;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class User {
  @Id // Telling hiberante, the next field will be a primary key (unique differentiation)
  @GeneratedValue(strategy=GenerationType.AUTO) // Auto generate ids as users are created
  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private String password;
  private Long lastLoginDate;
  private Boolean isPersonalAccount;
  private Long orgId;

  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
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
  public boolean isPersonalAccount() {
    return isPersonalAccount;
  }
  public void setPersonalAccount(boolean isPersonalAccount) {
    this.isPersonalAccount = isPersonalAccount;
  }
  public Long getOrgId() {
    return orgId;
  }
  public void setOrgId(Long orgId) {
    this.orgId = orgId;
  }

  
}