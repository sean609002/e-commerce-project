package com.paul.ecommerce.Entity.checkout;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.paul.ecommerce.Entity.authentication.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "order_tracking_number")
    private String orderTrackingNumber;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "total_quantity")
    private int totalQuantity;

    @Column(name = "status")
    private String status;

    @Column(name = "date_created")
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    private Date lastUpdated;

    @JsonManagedReference(value = "order-orderItem")
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private Set<OrderItem> orderItems;

    @JsonBackReference(value = "user-order")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonBackReference(value = "shippingAddress-order")
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id")
    private ShippingAddress shippingAddress;

    @JsonBackReference(value = "billingAddress-order")
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "billing_address_id")
    private BillingAddress billingAddress;

    public void addOrderItem(OrderItem orderItem) {
        if(orderItems == null) {
            orderItems = new HashSet<OrderItem>();
        }
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }
}
