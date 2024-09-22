package com.paul.ecommerce.dao;

import com.paul.ecommerce.Entity.checkout.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {

    @Query("SELECT S FROM ShippingAddress S WHERE S.city = :city AND S.country = :country AND S.state = :state AND S.street = :street AND S.zipCode = :zipCode")
    ShippingAddress findMatchingAddress(String city, String country, String state, String street, String zipCode);
}
