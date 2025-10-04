package com.wecp.eventmanagementsystem.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    
    @ManyToOne
    @JoinColumn(name = "clientId", referencedColumnName = "userId")
    private User client;
    
    @ManyToOne
    @JoinColumn(name = "eventId")
    private Event event;
    
    private Date bookingDate;
    private String status; // PENDING, CONFIRMED, CANCELLED
    private String clientRequirements;
    private String notes;
    
    public Booking() {
    }
    
    public Booking(Long bookingId, User client, Event event, Date bookingDate, String status, String clientRequirements, String notes) {
        this.bookingId = bookingId;
        this.client = client;
        this.event = event;
        this.bookingDate = bookingDate;
        this.status = status;
        this.clientRequirements = clientRequirements;
        this.notes = notes;
    }
    
    public Long getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
    
    public User getClient() {
        return client;
    }
    
    public void setClient(User client) {
        this.client = client;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public Date getBookingDate() {
        return bookingDate;
    }
    
    public void setBookingDate(Date bookingDate) {
        this.bookingDate = bookingDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getClientRequirements() {
        return clientRequirements;
    }
    
    public void setClientRequirements(String clientRequirements) {
        this.clientRequirements = clientRequirements;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}
