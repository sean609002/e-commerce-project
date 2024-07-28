package com.paul.ecommerce.dao;

import com.paul.ecommerce.Entity.checkout.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserEmail(String email, Pageable pageable);
}
