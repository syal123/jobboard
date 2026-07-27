package com.jobboard.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/*
 Represents one registeres user account, and defines the "users" database table (each field here becomes a column).
 Holds login credentials (the password is stored hashed, never in plain text) plus basic profile info,
 add two running counters used on the dashboard. This class is just the data shape - the actual 
 login/registration logic lives in AuthService.
*/
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String userName;

    private String password;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private int deletedJobsCount = 0;

    private int editedJobsCount = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public int getDeletedJobsCount() {
        return deletedJobsCount;
    }

    public void setDeletedJobsCount(int deletedJobsCount) {
        this.deletedJobsCount = deletedJobsCount;
    }

    public int getEditedJobsCount() {
        return editedJobsCount;
    }

    public void setEditedJobsCount(int editedJobsCount) {
        this.editedJobsCount = editedJobsCount;
    }
}
