package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.checkout.OrderItem;
import com.paul.ecommerce.dao.OrderItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface OrderItemService {
    Page<OrderItem> findByOrderId(Long id, Pageable pageable);
}
