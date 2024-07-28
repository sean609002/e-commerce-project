package com.paul.ecommerce.controller;

import com.paul.ecommerce.Entity.authentication.RefreshToken;
import com.paul.ecommerce.Entity.authentication.Role;
import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.dto.authentication.MessageResponse;
import com.paul.ecommerce.dto.authentication.UserInfoRequest;
import com.paul.ecommerce.dto.authentication.UserInfoResponse;
import com.paul.ecommerce.jwt.JwtUtils;
import com.paul.ecommerce.service.security.RefreshTokenService;
import com.paul.ecommerce.service.security.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder, JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    @PutMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UserInfoRequest userInfoRequest) {
        User user = userService.findById(userInfoRequest.getId());
        if (!user.getUsername().equals(userInfoRequest.getUsername()) && userService.existsByUsername(userInfoRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (!user.getEmail().equals(userInfoRequest.getEmail()) && userService.existsByEmail(userInfoRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        if(passwordEncoder.matches(userInfoRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Don't type the same password!"));
        }

        String encodedPassword = passwordEncoder.encode(userInfoRequest.getPassword());
        userInfoRequest.setPassword(encodedPassword);
        //set all userInfoRequest fields into user object
        updateUserHelper(userInfoRequest, user);
        userService.save(user);

        //根據user object生成jwt token
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user);

        //刪除refresh token
        refreshTokenService.deleteByUserId(user.getId());

        //生成refresh token後生成refresh token cookie
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());
        ResponseCookie jwtRefreshCookie = jwtUtils.generateRefreshJwtCookie(refreshToken.getToken());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                                .body(new UserInfoResponse(user.getId(),
                                        user.getFirstName(),
                                        user.getLastName(),
                                        user.getUsername(),
                                        user.getEmail(),
                                        user.getRoles()
                                                .stream()
                                                .map(Role::toString)
                                                .collect(Collectors.toList())));
    }

    private void updateUserHelper(UserInfoRequest userInfoRequest, User user) {
        user.setFirstName(userInfoRequest.getFirstName());
        user.setLastName(userInfoRequest.getLastName());
        user.setUsername(userInfoRequest.getUsername());
        user.setEmail(userInfoRequest.getEmail());
        user.setPassword(userInfoRequest.getPassword());
    }
}
