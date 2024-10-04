package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.dao.authentication.UserRepository;
import com.paul.ecommerce.exception.UserNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Autowired
    public UserDetailsServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UserNotFoundException {
        User user = userService.findByUserName(username)
                .orElseThrow(() -> new UserNotFoundException("User Not Found with username: " + username));

        return UserDetailsImpl.build(user);
    }
}