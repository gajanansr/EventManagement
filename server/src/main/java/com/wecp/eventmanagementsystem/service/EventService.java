package com.wecp.eventmanagementsystem.service;


import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.repository.EventRepository;

import ch.qos.logback.core.encoder.EchoEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;


@Service
public class EventService {
    @Autowired
    EventRepository eventRepository;

    public List<Event> getAllEvents(){
        return eventRepository.findAll();
    }

    public Event getEventById(Long id){
        Event e = eventRepository.findById(id).orElse(null);
        if(e==null){
            throw new EntityNotFoundException("Event Not Found!");
        } else {
            return e;
        }
    }

    public Event createEvent(Event event){
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventID, Event event){
        Event e = eventRepository.findById(eventID).orElseThrow(EntityNotFoundException::new);
        e.setAllocations(event.getAllocations());
        e.setDateTime(event.getDateTime());
        e.setDescription(event.getDescription());
        e.setEventID(event.getEventID());
        e.setLocation(event.getLocation());
        e.setStatus(event.getStatus());
        e.setTitle(event.getTitle());
        return eventRepository.save(e);
    }

    public void deleteEvent(Long eventID){
        eventRepository.deleteById(eventID);
    }

    public List<Event> getAllEventsByTitle(String title){
        return eventRepository.findByTitle(title);
    }

    public Event findEventByTitle(String title){
        return eventRepository.findEventByTitle(title);
    }
}
