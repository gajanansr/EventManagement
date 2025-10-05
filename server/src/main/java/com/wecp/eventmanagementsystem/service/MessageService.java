package com.wecp.eventmanagementsystem.service;

import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.entity.Message;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.repository.EventRepository;
import com.wecp.eventmanagementsystem.repository.MessageRepository;
import com.wecp.eventmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Message sendMessage(Long eventId, String senderUsername, String content) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        User sender = userRepository.findByUsername(senderUsername);
        if (sender == null) {
            throw new RuntimeException("User not found");
        }
        
        Message message = new Message(event, sender, sender.getRole(), content);
        return messageRepository.save(message);
    }
    
    public List<Message> getEventMessages(Long eventId) {
        return messageRepository.findByEvent_EventIDOrderBySentAtAsc(eventId);
    }
}
