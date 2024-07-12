package com.paul.ecommerce.dto;


import com.paul.ecommerce.Entity.*;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private ShippingAddress shippingAddress;
    private BillingAddress billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
