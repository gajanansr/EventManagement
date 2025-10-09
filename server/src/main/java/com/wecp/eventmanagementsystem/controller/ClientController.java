package com.wecp.eventmanagementsystem.controller;

import com.wecp.eventmanagementsystem.entity.Booking;
import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.entity.Message;
import com.wecp.eventmanagementsystem.service.BookingService;
import com.wecp.eventmanagementsystem.service.EventService;
import com.wecp.eventmanagementsystem.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ClientController {

    @Autowired
    private EventService eventservice;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private MessageService messageService;

    @GetMapping("/api/client/booking-details/{eventId}")
    public ResponseEntity<Event> getBookingDetails(@PathVariable Long eventId) {
        // return null;
        // get event details by event id and return with status code 200 OK
        return ResponseEntity.status(200).body(eventservice.getEventsById(eventId));
    }
    
    @GetMapping("/api/client/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String username = authentication.getName();
        List<Booking> bookings = bookingService.getClientBookings(username);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/api/client/my-booking/{bookingId}")
    public ResponseEntity<Booking> getMyBooking(@PathVariable Long bookingId, Authentication authentication) {
        String username = authentication.getName();
        Booking booking = bookingService.getBookingById(bookingId, username);
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping("/api/client/create-booking")
    public ResponseEntity<Map<String, Object>> createBooking(
            @RequestBody Map<String, Object> bookingRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Long eventId = Long.valueOf(bookingRequest.get("eventId").toString());
            String requirements = (String) bookingRequest.get("clientRequirements");
            
            Booking booking = bookingService.createBooking(eventId, username, requirements);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Booking created successfully");
            response.put("booking", booking);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/api/client/allEvents")
    public ResponseEntity<List<Event>> getAllEventsForClient() {
        List<Event> events = eventservice.getAllEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/api/client/event-detailsbyTitleforClient/{title}")
    public ResponseEntity<List<Event>> getEventsByTitleForClient(@PathVariable String title) {
        List<Event> events = eventservice.findEventByTitle(title);
        return ResponseEntity.ok(events);
    }
    
    // Messaging endpoints
    @PostMapping("/api/client/send-message")
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
    
    @GetMapping("/api/client/messages/{eventId}")
    public ResponseEntity<List<Message>> getEventMessages(@PathVariable Long eventId) {
        List<Message> messages = messageService.getEventMessages(eventId);
        return ResponseEntity.ok(messages);
    }
}

