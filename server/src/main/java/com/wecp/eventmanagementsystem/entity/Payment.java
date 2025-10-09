package com.wecp.eventmanagementsystem.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    
    @OneToOne
    @JoinColumn(name = "bookingId")
    private Booking booking;
    
    @Column(unique = true)
    private String razorpayOrderId;
    
    @Column(unique = true)
    private String razorpayPaymentId;
    
    private String razorpaySignature;
    
    private Long amount; // Amount in paise
    private String currency;
    private String status; // CREATED, SUCCESS, FAILED, REFUNDED
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    private String receipt;
    
    public Payment() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    public Payment(Booking booking, String razorpayOrderId, Long amount, String currency, String status, String receipt) {
        this.booking = booking;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.receipt = receipt;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    // Getters and Setters
    
    public Long getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
    
    public Booking getBooking() {
        return booking;
    }
    
    public void setBooking(Booking booking) {
        this.booking = booking;
    }
    
    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }
    
    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }
    
    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }
    
    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }
    
    public String getRazorpaySignature() {
        return razorpaySignature;
    }
    
    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = new Date();
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getReceipt() {
        return receipt;
    }
    
    public void setReceipt(String receipt) {
        this.receipt = receipt;
    }
}
