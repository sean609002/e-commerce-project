package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.ERole;
import com.paul.ecommerce.Entity.authentication.Role;

import java.util.Optional;

public interface RoleService {
    Optional<Role> findByName(ERole eRole);
}
