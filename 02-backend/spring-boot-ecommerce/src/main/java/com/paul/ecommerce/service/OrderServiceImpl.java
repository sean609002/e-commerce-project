package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.checkout.Order;
import com.paul.ecommerce.dao.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    @Override
    public Page<Order> findOrdersByUserEmail(String email, Pageable pageable) {
        return orderRepository.findByUserEmail(email, pageable);
    }
}
