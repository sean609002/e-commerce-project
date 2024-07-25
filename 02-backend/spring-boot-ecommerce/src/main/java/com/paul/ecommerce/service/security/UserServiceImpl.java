package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.dao.authentication.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean existsByUsername(String userName) {
        return userRepository.existsByUsername(userName);
    }
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public void save(User user) {
        userRepository.save(user);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
