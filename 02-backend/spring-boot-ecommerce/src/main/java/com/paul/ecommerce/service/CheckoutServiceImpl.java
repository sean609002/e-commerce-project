package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.Entity.checkout.Order;
import com.paul.ecommerce.Entity.checkout.OrderItem;
import com.paul.ecommerce.dao.authentication.UserRepository;
import com.paul.ecommerce.dto.Purchase;
import com.paul.ecommerce.dto.PurchaseResponse;
import com.paul.ecommerce.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private UserRepository userRepository;
    @Autowired
    public CheckoutServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        for (OrderItem orderItem : orderItems) {
            order.addOrderItem(orderItem);
        }
        //populate order with shippingAddress and billingAddress
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());
        //populate customer with order
        User user = userRepository.findById(purchase.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.addOrder(order);
        //save data into database
        userRepository.save(user);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
