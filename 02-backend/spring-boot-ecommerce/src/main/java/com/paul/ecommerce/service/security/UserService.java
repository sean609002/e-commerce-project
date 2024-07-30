package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.User;

public interface UserService {
    boolean existsByUsername(String userName);
    boolean existsByEmail(String email);
    void save(User user);
    User findById(Long id);
}
