package com.paul.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.paul.ecommerce.Entity.Product;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(value = {"http://localhost:4200"})
public interface ProductRepository extends JpaRepository<Product, Long> {
}
