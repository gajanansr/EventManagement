package com.wecp.eventmanagementsystem.dto;

public class PaymentOrderResponse {
    
    private String orderId;
    private Long amount;
    private String currency;
    private String razorpayKeyId;
    
    public PaymentOrderResponse() {
    }
    
    public PaymentOrderResponse(String orderId, Long amount, String currency, String razorpayKeyId) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.razorpayKeyId = razorpayKeyId;
    }
    
    public String getOrderId() {
        return orderId;
    }
    
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    
    public Long getAmount() {
        return amount;
    }
    
    public void setAmount(Long amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }
    
    public void setRazorpayKeyId(String razorpayKeyId) {
        this.razorpayKeyId = razorpayKeyId;
    }
}
