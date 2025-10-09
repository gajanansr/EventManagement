package com.wecp.eventmanagementsystem.dto;

public class PaymentOrderRequest {
    
    private Long eventId;
    private String clientRequirements;
    private Long amount; 
    
    public PaymentOrderRequest() {
    }
    
    public PaymentOrderRequest(Long eventId, String clientRequirements, Long amount) {
        this.eventId = eventId;
        this.clientRequirements = clientRequirements;
        this.amount = amount;
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
    
    public Long getAmount() {
        return amount;
    }
    
    public void setAmount(Long amount) {
        this.amount = amount;
    }
}
