package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.checkout.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<Order> findOrdersByUserEmail(String email, Pageable pageable);
}
