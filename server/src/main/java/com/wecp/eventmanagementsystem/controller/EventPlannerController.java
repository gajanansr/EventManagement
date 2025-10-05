package com.wecp.eventmanagementsystem.controller;

import com.wecp.eventmanagementsystem.entity.Allocation;
import com.wecp.eventmanagementsystem.entity.Booking;
import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.entity.Message;
import com.wecp.eventmanagementsystem.entity.Resource;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.service.BookingService;
import com.wecp.eventmanagementsystem.service.EventService;
import com.wecp.eventmanagementsystem.service.MessageService;
import com.wecp.eventmanagementsystem.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EventPlannerController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ResourceService resourceService;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private BookingService bookingService;

    @PostMapping("/api/planner/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        // create event and return created event with status code 201 (CREATED)
        return new ResponseEntity<>(eventService.createEvent(event), HttpStatus.CREATED);
    }

    @GetMapping("/api/planner/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        // get all events and return the list with status code 200 (OK)
        return new ResponseEntity<List<Event>>(eventService.getAllEvents(), HttpStatus.OK);
    }

    @PostMapping("/api/planner/resource")
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        // add resource and return added resource with status code 201 (CREATED)
        return new ResponseEntity<Resource>(resourceService.addResource(resource), HttpStatus.CREATED);
    }

    @GetMapping("/api/planner/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        // get all resources and return the list with status code 200 (OK)
        return new ResponseEntity<List<Resource>>(resourceService.getAllResources(), HttpStatus.OK);
    }

    @GetMapping("/api/planner/event-details/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable Long eventId) {
        System.out.println("Fetching event with ID: " + eventId);
        return new ResponseEntity<>(eventService.getEventsById(eventId), HttpStatus.OK);
    }

    @GetMapping("/api/planner/event-detail/{title}")
    public ResponseEntity<List<Event>> getAllEventByTitle(@PathVariable String title) {
        System.out.println("Fetching events with title: " + title);
        return new ResponseEntity<>(eventService.getAllEventByTitle(title), HttpStatus.OK);
    }

    @PostMapping("/api/planner/allocate-resources")
    public ResponseEntity<String> allocateResources(@RequestParam long eventId, @RequestParam long resourceId,
            @RequestBody Allocation allocation) {

        // allocate resources for the event and return a success message with status
        // code 201 (CREATED)
        resourceService.allocateResources(eventId, resourceId, allocation);
        return new ResponseEntity<>("{\"message\": \"Resource allocated successfully for Event ID: " + eventId + "\"}",
                HttpStatus.CREATED);
    }

    @DeleteMapping("/api/planner/event/{eventId}")
    public ResponseEntity<String> deleteEventById(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return new ResponseEntity<String>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/api/planner/staff")
    public ResponseEntity<List<User>> getAllStaff() {
        List<User> staffList = eventService.getAllStaff();
        return new ResponseEntity<>(staffList, HttpStatus.OK);
    }
    
    @PostMapping("/api/planner/assign-staff")
    public ResponseEntity<Map<String, Object>> assignStaffToEvent(
            @RequestParam Long eventId,
            @RequestParam Long staffId) {
        try {
            Event event = eventService.assignStaffToEvent(eventId, staffId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Staff assigned successfully");
            response.put("event", event);
            
            return ResponseEntity.ok(response);
                } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Messaging endpoints for PLANNER
    @PostMapping("/api/planner/send-message")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @RequestBody Map<String, Object> messageRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Long eventId = Long.valueOf(messageRequest.get("eventId").toString());
            String content = (String) messageRequest.get("content");
            
            Message message = messageService.sendMessage(eventId, username, content);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message sent successfully");
            response.put("data", message);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/api/planner/messages/{eventId}")
    public ResponseEntity<List<Message>> getEventMessages(@PathVariable Long eventId) {
        List<Message> messages = messageService.getEventMessages(eventId);
        return ResponseEntity.ok(messages);
    }
    
    // Booking management endpoints for PLANNER
    @GetMapping("/api/planner/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PutMapping("/api/planner/booking/{bookingId}/status")
    public ResponseEntity<Map<String, Object>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            String notes = statusUpdate.get("notes");
            
            Booking booking = bookingService.updateBookingStatus(bookingId, status, notes);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking status updated successfully");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

}
