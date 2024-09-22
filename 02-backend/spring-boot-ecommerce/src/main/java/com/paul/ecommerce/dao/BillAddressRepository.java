package com.paul.ecommerce.dao;

import com.paul.ecommerce.Entity.checkout.BillingAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BillAddressRepository extends JpaRepository<BillingAddress, Long> {
    @Query("SELECT B FROM BillingAddress B WHERE B.city = :city AND B.country = :country AND B.state = :state AND B.street = :street AND B.zipCode = :zipCode")
    BillingAddress findMatchingAddress(String city, String country, String state, String street, String zipCode);
}
