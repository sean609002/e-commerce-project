package com.paul.ecommerce.dto.authentication;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserInfoResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private List<String> roles;

    public UserInfoResponse(Long id, String firstName, String lastName, String username, String email, List<String> roles) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }


}
