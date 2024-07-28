package com.paul.ecommerce.Entity.checkout;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "shipping_address")
@Getter
@Setter
public class ShippingAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "state")
    private String state;

    @Column(name = "street")
    private String street;

    @Column(name = "zip_code")
    private String zipCode;

    @JsonManagedReference(value = "shippingAddress-order")
    @OneToMany(mappedBy = "shippingAddress")
    private Set<Order> shippingAddressOrders;

}
