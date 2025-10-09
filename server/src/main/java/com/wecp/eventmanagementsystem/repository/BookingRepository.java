package com.wecp.eventmanagementsystem.repository;

import com.wecp.eventmanagementsystem.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByClientUserId(Long clientId);
    List<Booking> findByEventEventID(Long eventId);
}
