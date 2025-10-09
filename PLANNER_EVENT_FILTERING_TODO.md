# Planner-Event Filtering Integration - TODO

## ✅ Completed Backend Setup

1. **Event Entity** (`server/src/main/java/com/wecp/eventmanagementsystem/entity/Event.java`)
   - Added `createdByPlanner` field with `@ManyToOne` relationship to User
   - Added getter and setter methods

2. **EventRepository** (`server/src/main/java/com/wecp/eventmanagementsystem/repository/EventRepository.java`)
   - Added `findByCreatedByPlannerUserId(Long plannerId)` method

3. **EventService** (`server/src/main/java/com/wecp/eventmanagementsystem/service/EventService.java`)
   - Added `getEventsForPlanner(Long plannerId)` method
   - Added `createEventByPlanner(Event event, Long plannerId)` method

## 🔄 Remaining Integration Steps

### 1. Update EventPlannerController

File: `server/src/main/java/com/wecp/eventmanagementsystem/controller/EventPlannerController.java`

#### Add UserService Dependency
```java
@Autowired
private UserService userService;
```

#### Update createEvent Method
Replace:
```java
@PostMapping("/api/planner/event")
public ResponseEntity<Event> createEvent(@RequestBody Event event) {
    return new ResponseEntity<>(eventService.createEvent(event), HttpStatus.CREATED);
}
```

With:
```java
@PostMapping("/api/planner/event")
public ResponseEntity<Event> createEvent(@RequestBody Event event, Authentication authentication) {
    String username = authentication.getName();
    User planner = userService.getUserByUsername(username);
    Event createdEvent = eventService.createEventByPlanner(event, planner.getUserId());
    return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
}
```

#### Update getAllEvents Method  
Replace:
```java
@GetMapping("/api/planner/events")
public ResponseEntity<List<Event>> getAllEvents() {
    return new ResponseEntity<List<Event>>(eventService.getAllEvents(), HttpStatus.OK);
}
```

With:
```java
@GetMapping("/api/planner/events")
public ResponseEntity<List<Event>> getAllEvents(Authentication authentication) {
    String username = authentication.getName();
    User planner = userService.getUserByUsername(username);
    List<Event> plannerEvents = eventService.getEventsForPlanner(planner.getUserId());
    return new ResponseEntity<>(plannerEvents, HttpStatus.OK);
}
```

### 2. Database Migration (Optional)

If you need to update existing events in the database:

```sql
-- This would set all existing events to a default planner
-- Adjust as needed based on your data
UPDATE events SET createdByPlannerId = (SELECT userId FROM users WHERE role = 'PLANNER' LIMIT 1) WHERE createdByPlannerId IS NULL;
```

Or manually update via application code:
- Create a one-time migration endpoint
- Assign existing events to their respective planners
- Or set them to NULL and let planners claim them

### 3. Testing Checklist

After implementing the above changes:

- [ ] **Create Event**: Verify that new events are created with the logged-in planner's ID
- [ ] **View Events**: Confirm planner only sees their own events in the dashboard
- [ ] **Multiple Planners**: Test with multiple planner accounts - each should see only their events
- [ ] **Edit Event**: Ensure planners can only edit their own events
- [ ] **Delete Event**: Ensure planners can only delete their own events
- [ ] **Search/Filter**: Verify search functionality still works within planner's events

### 4. Additional Security (Recommended)

Add authorization checks in update and delete methods:

```java
@PutMapping("/api/planner/update-event/{eventId}")
public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event event, Authentication authentication) {
    String username = authentication.getName();
    User planner = userService.getUserByUsername(username);
    
    // Verify the event belongs to this planner
    Event existingEvent = eventService.getEventsById(eventId);
    if (existingEvent.getCreatedByPlanner() == null || 
        !existingEvent.getCreatedByPlanner().getUserId().equals(planner.getUserId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own events");
    }
    
    // Proceed with update...
}
```

## 🎯 Expected Behavior After Implementation

1. **Planner Registration**:
   - Must provide access key "1234"
   - Must solve CAPTCHA

2. **Event Creation**:
   - Event is automatically linked to the logged-in planner
   - createdByPlanner field is set in database

3. **Event Viewing**:
   - Planner sees only events they created
   - Other planners' events are not visible
   - Maintains existing functionality for STAFF and CLIENT roles

4. **Dashboard Stats**:
   - Statistics reflect only the planner's events
   - Total Events, Scheduled, Completed counts are filtered

## 📝 Notes

- The UserService import needs to be added to EventPlannerController
- Authentication object provides the logged-in user's username
- All existing functionality for STAFF and CLIENT remains unchanged
- This feature adds planner-specific event isolation without breaking existing code

## 🐛 Troubleshooting

If you encounter issues:

1. **NullPointerException**: Check if Authentication is properly injected
2. **403 Forbidden**: Verify JWT token includes correct user info
3. **Events not filtered**: Confirm the createdByPlannerUserId query is correct
4. **Existing events missing**: May need database migration for old events

---

**Status**: Backend infrastructure ✅ Complete | Controller integration ⏳ Pending
**Priority**: High - Core feature for multi-planner support
**Estimated Time**: 15-30 minutes for implementation and testing
