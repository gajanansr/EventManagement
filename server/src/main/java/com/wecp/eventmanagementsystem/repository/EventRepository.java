package com.wecp.eventmanagementsystem.repository;

import com.wecp.eventmanagementsystem.entity.Event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>{
    List<Event> findByTitle(String title);
    @Query("SELECT e from Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%',:title, '%'))")
    public List<Event> findEventByTitle(String title);
    List<Event> findByAssignedStaffUserId(Long staffId);
}
