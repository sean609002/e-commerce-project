package com.paul.ecommerce.dao.authentication;

import com.paul.ecommerce.Entity.authentication.ERole;
import com.paul.ecommerce.Entity.authentication.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);

}
