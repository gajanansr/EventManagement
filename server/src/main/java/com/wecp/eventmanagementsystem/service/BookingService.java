package com.wecp.eventmanagementsystem.service;

import com.wecp.eventmanagementsystem.entity.Booking;
import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.repository.BookingRepository;
import com.wecp.eventmanagementsystem.repository.EventRepository;
import com.wecp.eventmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.Date;
import java.util.List;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Booking> getClientBookings(String username) {
        User client = userRepository.findByUsername(username);
        if (client == null) {
            throw new EntityNotFoundException("Client not found: " + username);
        }
        return bookingRepository.findByClientUserId(client.getUserId());
    }
    
    public Booking getBookingById(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + bookingId));
        
        
        User client = userRepository.findByUsername(username);
        if (client == null || booking.getClient().getUserId() != client.getUserId()) {
            throw new SecurityException("Unauthorized access to booking");
        }
        
        return booking;
    }
    
    public Booking createBooking(Long eventId, String username, String clientRequirements) {
        User client = userRepository.findByUsername(username);
        if (client == null) {
            throw new EntityNotFoundException("Client not found: " + username);
        }
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));
        
        Booking booking = new Booking();
        booking.setClient(client);
        booking.setEvent(event);
        booking.setBookingDate(new Date());
        booking.setStatus("PENDING");
        booking.setClientRequirements(clientRequirements);
        
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Booking updateBookingStatus(Long bookingId, String status, String notes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + bookingId));
        
        booking.setStatus(status);
        if (notes != null) {
            booking.setNotes(notes);
        }
        
        return bookingRepository.save(booking);
    }
}
