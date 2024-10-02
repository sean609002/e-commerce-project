package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.checkout.OrderItem;
import com.paul.ecommerce.dao.OrderItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    private OrderItemRepository orderItemRepository;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @Override
    public Page<OrderItem> findByOrderId(Long id, Pageable pageable) {
        return orderItemRepository.findByOrderId(id, pageable);
    }
}
