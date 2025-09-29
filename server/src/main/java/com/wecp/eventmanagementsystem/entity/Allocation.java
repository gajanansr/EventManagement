package com.wecp.eventmanagementsystem.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "allocations") // do not change table name
public class Allocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long allocationID;
    private Event event;
    private Allocation allocation;
    private int quantity;
}
