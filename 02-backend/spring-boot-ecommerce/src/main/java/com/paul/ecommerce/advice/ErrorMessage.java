package com.paul.ecommerce.advice;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ErrorMessage {
    private int value;
    private Date date;
    private String message;
    private String description;
    public ErrorMessage(int value, Date date, String message, String description) {
        this.value = value;
        this.date = date;
        this.message = message;
        this.description = description;
    }

}
