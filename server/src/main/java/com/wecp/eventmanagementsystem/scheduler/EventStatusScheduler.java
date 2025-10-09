package com.wecp.eventmanagementsystem.scheduler;

import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Component
public class EventStatusScheduler {
    
    @Autowired
    private EventRepository eventRepository;
    
    
    @Scheduled(cron = "0 0 0 * * ?") 
    public void updatePastEventsToCompleted() {
        try {
            LocalDateTime now = LocalDateTime.now();
            Date currentDate = Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
            
            
            List<Event> allEvents = eventRepository.findAll();
            int updatedCount = 0;
            
            for (Event event : allEvents) {
                if (event.getDateTime() != null && 
                    event.getDateTime().before(currentDate) && 
                    "Scheduled".equals(event.getStatus())) {
                    
                    event.setStatus("Completed");
                    eventRepository.save(event);
                    updatedCount++;
                }
            }
            
            if (updatedCount > 0) {
                System.out.println("EventStatusScheduler: Updated " + updatedCount + " past events to 'Completed' status");
            }
        } catch (Exception e) {
            System.err.println("Error in EventStatusScheduler: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    
    public void updatePastEventsOnStartup() {
        System.out.println("EventStatusScheduler: Running initial check on startup...");
        updatePastEventsToCompleted();
    }
}
