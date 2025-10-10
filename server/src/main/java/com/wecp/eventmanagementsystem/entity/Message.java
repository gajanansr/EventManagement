package com.wecp.eventmanagementsystem.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;
    
    @ManyToOne
    @JoinColumn(name = "eventId")
    private Event event;
    
    @ManyToOne
    @JoinColumn(name = "senderId", referencedColumnName = "userId")
    private User sender;
    
    private String senderRole; 
    private String content;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date sentAt;
    
    public Message() {
        this.sentAt = new Date();
    }
    
    public Message(Event event, User sender, String senderRole, String content) {
        this.event = event;
        this.sender = sender;
        this.senderRole = senderRole;
        this.content = content;
        this.sentAt = new Date();
    }
    
 
    public Long getMessageId() {
        return messageId;
    }
    
    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public User getSender() {
        return sender;
    }
    
    public void setSender(User sender) {
        this.sender = sender;
    }
    
    public String getSenderRole() {
        return senderRole;
    }
    
    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Date getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(Date sentAt) {
        this.sentAt = sentAt;
    }
}
