package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.User;

import java.util.Optional;

public interface UserService {
    boolean existsByUsername(String userName);
    boolean existsByEmail(String email);
    void save(User user);
    User findById(Long id);
    Optional<User> findByUserName(String username);
    Optional<User> findByEmail(String email);
}
