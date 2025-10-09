package com.wecp.eventmanagementsystem.dto;

public class PaymentVerificationRequest {
    
    private String orderId;
    private String paymentId;
    private String signature;
    private Long eventId;
    private String clientRequirements;
    
    public PaymentVerificationRequest() {
    }
    
    public PaymentVerificationRequest(String orderId, String paymentId, String signature, Long eventId, String clientRequirements) {
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
        this.eventId = eventId;
        this.clientRequirements = clientRequirements;
    }
    
    public String getOrderId() {
        return orderId;
    }
    
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getSignature() {
        return signature;
    }
    
    public void setSignature(String signature) {
        this.signature = signature;
    }
    
    public Long getEventId() {
        return eventId;
    }
    
    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
    
    public String getClientRequirements() {
        return clientRequirements;
    }
    
    public void setClientRequirements(String clientRequirements) {
        this.clientRequirements = clientRequirements;
    }
}
