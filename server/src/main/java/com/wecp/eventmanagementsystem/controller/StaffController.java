package com.wecp.eventmanagementsystem.controller;
import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.entity.Message;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.repository.UserRepository;
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
public class StaffController {
    @Autowired
    private EventService eventService;
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/staff/allEvents")
    public ResponseEntity<List<Event>> getAssignedEvents(Authentication authentication) {
        // Get only events assigned to this staff member
        String username = authentication.getName();
        User staff = userRepository.findByUsername(username);
        
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<Event> assignedEvents = eventService.getEventsForStaff(staff.getUserId());
        return ResponseEntity.ok(assignedEvents);
    }

    @GetMapping("/api/staff/event-details/{eventId}")
    public ResponseEntity<Event> getEventDetails(@PathVariable Long eventId) {
        // get the event details by eventId and return the event with status code 200 ok
        return ResponseEntity.status(200).body(eventService.getEventsById(eventId));
    }

    @PutMapping("/api/staff/update-setup/{eventId}")
    public ResponseEntity<Event> updateEventSetup(@RequestBody Event updatedEvent, @PathVariable Long eventId) {
        // update the event setup and return the updated event with status code 200 ok
        return new ResponseEntity<Event>(eventService.updateEvent(updatedEvent, eventId), HttpStatus.OK);
    }
    
    // Messaging endpoints for STAFF
    @PostMapping("/api/staff/send-message")
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
    
    @GetMapping("/api/staff/messages/{eventId}")
    public ResponseEntity<List<Message>> getEventMessages(@PathVariable Long eventId) {
        List<Message> messages = messageService.getEventMessages(eventId);
        return ResponseEntity.ok(messages);
    }
}
