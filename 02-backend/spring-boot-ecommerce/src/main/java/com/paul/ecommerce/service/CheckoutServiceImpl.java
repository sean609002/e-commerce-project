package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.checkout.Customer;
import com.paul.ecommerce.Entity.checkout.Order;
import com.paul.ecommerce.Entity.checkout.OrderItem;
import com.paul.ecommerce.dao.CustomerRepository;
import com.paul.ecommerce.dto.Purchase;
import com.paul.ecommerce.dto.PurchaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{
    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        for (OrderItem orderItem : orderItems) {order.addOrderItem(orderItem);}
        //populate order with shippingAddress and billingAddress
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());
        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.addOrder(order);
        //save data into database
        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
