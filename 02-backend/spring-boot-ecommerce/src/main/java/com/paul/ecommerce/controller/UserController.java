package com.paul.ecommerce.controller;

import com.paul.ecommerce.Entity.authentication.RefreshToken;
import com.paul.ecommerce.Entity.authentication.Role;
import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.Entity.checkout.Order;
import com.paul.ecommerce.dto.authentication.MessageResponse;
import com.paul.ecommerce.dto.authentication.UserInfoRequest;
import com.paul.ecommerce.dto.authentication.UserInfoResponse;
import com.paul.ecommerce.jwt.JwtUtils;
import com.paul.ecommerce.service.OrderService;
import com.paul.ecommerce.service.security.RefreshTokenService;
import com.paul.ecommerce.service.security.UserService;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpEntity;
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
    private final OrderService orderService;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils, RefreshTokenService refreshTokenService,
                          OrderService orderService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    //@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public HttpEntity<PagedModel<Order>> getOrders(@RequestParam String email,
                                                   @RequestParam(required = false) Integer page,
                                                   @RequestParam(required = false) Integer size,
                                                   @RequestParam(required = false) String sort,
                                                   PagedResourcesAssembler assembler) {
        //設置默認值
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 10;
        String mySort = (sort == null || sort.equals("")) ? "id,asc" : sort;

        String[] splitSort = StringUtils.split(mySort, ",");
        Pageable pageable = null;
        if (splitSort.length == 2) {
            String property = splitSort[0];
            String direction = splitSort[1].toLowerCase();

            Sort.Direction sortDirection = direction.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

            pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortDirection, property));


        }

        if(splitSort.length == 1) {
            pageable = PageRequest.of(pageNumber, pageSize, Sort.by(splitSort[0]).ascending());
        }

        Page<Order> ordersByUserEmail = orderService.findOrdersByUserEmail(email, pageable);

        return ResponseEntity.ok(assembler.toModel(ordersByUserEmail));
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
