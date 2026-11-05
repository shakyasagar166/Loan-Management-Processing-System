package com.loan.service;

import com.loan.entity.User;
import com.loan.enums.UserRole;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByUsername(String username);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    User updateUserRole(Long id, UserRole role);
    User toggleUserStatus(Long id);
}
