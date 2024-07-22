package com.paul.ecommerce.service.security;

import com.paul.ecommerce.Entity.authentication.ERole;
import com.paul.ecommerce.Entity.authentication.Role;
import com.paul.ecommerce.dao.authentication.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Optional<Role> findByName(ERole eRole) {
        return roleRepository.findByName(eRole);
    }
}
