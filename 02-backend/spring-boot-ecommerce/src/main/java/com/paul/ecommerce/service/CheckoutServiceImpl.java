package com.paul.ecommerce.service;

import com.paul.ecommerce.Entity.authentication.User;
import com.paul.ecommerce.Entity.checkout.BillingAddress;
import com.paul.ecommerce.Entity.checkout.Order;
import com.paul.ecommerce.Entity.checkout.OrderItem;
import com.paul.ecommerce.Entity.checkout.ShippingAddress;
import com.paul.ecommerce.dao.BillAddressRepository;
import com.paul.ecommerce.dao.ShippingAddressRepository;
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

    private ShippingAddressRepository shippingAddressRepository;

    private BillAddressRepository billAddressRepository;

    @Autowired
    public CheckoutServiceImpl(UserRepository userRepository, ShippingAddressRepository shippingAddressRepository, BillAddressRepository billAddressRepository) {
        this.userRepository = userRepository;
        this.shippingAddressRepository = shippingAddressRepository;
        this.billAddressRepository = billAddressRepository;
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

        ShippingAddress purchaseShippingAddress = purchase.getShippingAddress();
        BillingAddress purchaseBillingAddress = purchase.getBillingAddress();

        ShippingAddress shippingAddress = shippingAddressRepository.findMatchingAddress(purchaseShippingAddress.getCity(),purchaseShippingAddress.getCountry(),purchaseShippingAddress.getState(),purchaseShippingAddress.getStreet(),purchaseShippingAddress.getZipCode());
        BillingAddress billingAddress = billAddressRepository.findMatchingAddress(purchaseBillingAddress.getCity(),purchaseBillingAddress.getCountry(),purchaseBillingAddress.getState(),purchaseBillingAddress.getStreet(),purchaseBillingAddress.getZipCode());

        //populate order with shippingAddress and billingAddress
        order.setShippingAddress(shippingAddress == null ? purchaseShippingAddress : shippingAddress);
        order.setBillingAddress(billingAddress == null ? purchaseBillingAddress : billingAddress);
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
