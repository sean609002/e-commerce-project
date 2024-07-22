package com.paul.ecommerce.dto;


import com.paul.ecommerce.Entity.checkout.*;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Long userId;
    private ShippingAddress shippingAddress;
    private BillingAddress billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
