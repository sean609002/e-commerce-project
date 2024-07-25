package com.paul.ecommerce.Entity.authentication;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name")
    private ERole name;

    public Role() {

    }

    public Role(ERole name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name.name();
    }

}
