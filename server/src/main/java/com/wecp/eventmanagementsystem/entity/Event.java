package com.wecp.eventmanagementsystem.entity;
 
 
import javax.persistence.*;
import java.util.Date;
import java.util.List;
 
@Table(name = "events") // do not change table name
@Entity
public class Event {
 
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long eventID;
    private String title;
    private  String description;
    private Date dateTime;
    private String location;
    private String status;
    private Double amount; // Event price in rupees (e.g., 5000.0)
 
    @ManyToOne
    @JoinColumn(name = "createdByPlannerId", referencedColumnName = "userId")
    private User createdByPlanner; // Track which planner created this event
    
    @ManyToOne
    @JoinColumn(name = "assignedStaffId", referencedColumnName = "userId")
    private User assignedStaff;
 
    @OneToMany(mappedBy = "event")
    private List<Allocation> allocations;
 
    public Event() {
    }
 
    public Event(Long eventID, String title, String description, Date dateTime, String location, String status, List<Allocation> allocations) {
        this.eventID = eventID;
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.location = location;
        this.status = status;
        this.allocations = allocations;
    }
 
    public Long getEventID() {
        return eventID;
    }
 
    public void setEventID(Long eventID) {
        this.eventID = eventID;
    }
 
    public String getTitle() {
        return title;
    }
 
    public void setTitle(String title) {
        this.title = title;
    }
 
    public String getDescription() {
        return description;
    }
 
    public void setDescription(String description) {
        this.description = description;
    }
 
    public Date getDateTime() {
        return dateTime;
    }
 
    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }
 
    public String getLocation() {
        return location;
    }
 
    public void setLocation(String location) {
        this.location = location;
    }
 
    public String getStatus() {
        return status;
    }
 
    public void setStatus(String status) {
        this.status = status;
    }
 
    public List<Allocation> getAllocations() {
        return allocations;
    }
 
    public void setAllocations(List<Allocation> allocations) {
        this.allocations = allocations;
    }
    
    public User getAssignedStaff() {
        return assignedStaff;
    }
    
    public void setAssignedStaff(User assignedStaff) {
        this.assignedStaff = assignedStaff;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public User getCreatedByPlanner() {
        return createdByPlanner;
    }
    
    public void setCreatedByPlanner(User createdByPlanner) {
        this.createdByPlanner = createdByPlanner;
    }
   
}
 
 