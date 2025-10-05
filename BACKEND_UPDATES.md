# Backend Updates - New Features Implementation

## Date: October 5, 2025

### 🆕 New Features Added

#### 1. **Staff Assignment to Events**
- Planners can now assign staff members to events
- New field `assignedStaff` in Event entity (Many-to-One with User)

**Endpoints:**
- `GET /api/planner/staff` - Get all STAFF users
- `POST /api/planner/assign-staff?eventId={id}&staffId={id}` - Assign staff to event

#### 2. **Client-Planner Communication System**
- Simple messaging system for event-related communication
- New `Message` entity with sender, event, content, and timestamp

**Endpoints:**
- `POST /api/planner/send-message` - Planner sends message
- `POST /api/client/send-message` - Client sends message  
- `GET /api/planner/messages/{eventId}` - Get event messages (PLANNER)
- `GET /api/client/messages/{eventId}` - Get event messages (CLIENT)

#### 3. **Event Search by Title (All Roles)**
- Fixed and added title search for all roles

**Endpoints:**
- `GET /api/planner/event-detail/{title}` - PLANNER search by title
- `GET /api/staff/event-detailsbyTitle/{title}` - STAFF search by title (**NEW**)
- `GET /api/client/event-detailsbyTitleforClient/{title}` - CLIENT search by title (**EXISTING**)

#### 4. **Staff Permissions Updated**
- ❌ STAFF can NO LONGER update events (`/api/staff/update-setup/{eventId}` removed)
- ✅ STAFF can only VIEW events (read-only access)

#### 5. **Client Event Listing**
- Added endpoint for clients to view all available events

**Endpoint:**
- `GET /api/client/allEvents` - Get all events for client browsing

---

## 📦 New Files Created

### Entities
1. **Message.java** - Communication between CLIENT and PLANNER
   - messageId (PK)
   - event (FK to Event)
   - sender (FK to User)
   - senderRole (PLANNER/CLIENT)
   - content (message text)
   - sentAt (timestamp)

### Repositories
1. **MessageRepository.java**
   - `findByEvent_EventIDOrderBySentAtAsc(Long eventId)` - Get messages by event

### Services
1. **MessageService.java**
   - `sendMessage(eventId, username, content)` - Send a message
   - `getEventMessages(eventId)` - Get all messages for an event

---

## 🔄 Modified Files

### Entities
**Event.java**
```java
@ManyToOne
@JoinColumn(name = "assignedStaffId", referencedColumnName = "userId")
private User assignedStaff;

public User getAssignedStaff() { return assignedStaff; }
public void setAssignedStaff(User assignedStaff) { this.assignedStaff = assignedStaff; }
```

### Services
**EventService.java**
- Added `UserRepository` autowiring
- New method: `assignStaffToEvent(Long eventId, Long staffId)`
- New method: `getAllStaff()` - Get all users with role='STAFF'

### Controllers

**EventPlannerController.java** - Added:
- `GET /api/planner/staff` - Get all staff members
- `POST /api/planner/assign-staff` - Assign staff to event
- `POST /api/planner/send-message` - Send message to client
- `GET /api/planner/messages/{eventId}` - View event messages

**ClientController.java** - Added:
- `GET /api/client/allEvents` - List all available events
- `GET /api/client/event-detailsbyTitleforClient/{title}` - Search events by title
- `POST /api/client/send-message` - Send message to planner
- `GET /api/client/messages/{eventId}` - View event messages

**SecurityConfig.java** - Updated:
- Added security rules for new endpoints
- Removed `/api/staff/update-setup/{eventId}` (STAFF can't update anymore)
- Added message endpoints for PLANNER and CLIENT
- Added staff assignment endpoints for PLANNER

---

## 🔒 Security Changes

### Removed Permissions
- ❌ `PUT /api/staff/update-setup/{eventId}` - STAFF can no longer update events

### Added Permissions

**PLANNER Authority:**
```java
.antMatchers(HttpMethod.GET, "/api/planner/staff").hasAuthority("PLANNER")
.antMatchers(HttpMethod.POST, "/api/planner/assign-staff").hasAuthority("PLANNER")
.antMatchers(HttpMethod.POST, "/api/planner/send-message").hasAuthority("PLANNER")
.antMatchers(HttpMethod.GET, "/api/planner/messages/{eventId}").hasAuthority("PLANNER")
```

**STAFF Authority:**
```java
.antMatchers(HttpMethod.GET, "/api/staff/allEvents").hasAnyAuthority("STAFF", "PLANNER")
.antMatchers(HttpMethod.GET, "/api/staff/event-detailsbyTitle/{title}").hasAnyAuthority("STAFF", "PLANNER")
.antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").hasAnyAuthority("STAFF", "PLANNER")
```

**CLIENT Authority:**
```java
.antMatchers(HttpMethod.GET, "/api/client/allEvents").hasAuthority("CLIENT")
.antMatchers(HttpMethod.GET, "/api/client/event-detailsbyTitleforClient/{title}").hasAuthority("CLIENT")
.antMatchers(HttpMethod.POST, "/api/client/send-message").hasAuthority("CLIENT")
.antMatchers(HttpMethod.GET, "/api/client/messages/{eventId}").hasAuthority("CLIENT")
```

---

## 📊 Database Schema Changes

### New Table: messages
```sql
CREATE TABLE messages (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT,
    sender_id BIGINT,
    sender_role VARCHAR(50),
    content TEXT,
    sent_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);
```

### Updated Table: events
```sql
ALTER TABLE events 
ADD COLUMN assigned_staff_id BIGINT,
ADD FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id);
```

---

## 🧪 Testing Endpoints

### Staff Assignment (PLANNER)
```bash
# Get all staff
GET /api/planner/staff
Authorization: Bearer {planner_token}

# Assign staff to event
POST /api/planner/assign-staff?eventId=1&staffId=5
Authorization: Bearer {planner_token}
```

### Messaging (PLANNER ↔ CLIENT)
```bash
# CLIENT sends message
POST /api/client/send-message
Authorization: Bearer {client_token}
Body: {
  "eventId": 1,
  "content": "When will the event setup be complete?"
}

# PLANNER responds
POST /api/planner/send-message
Authorization: Bearer {planner_token}
Body: {
  "eventId": 1,
  "content": "Setup will be complete by 2pm tomorrow."
}

# View messages
GET /api/planner/messages/1  # or /api/client/messages/1
Authorization: Bearer {token}
```

### Search by Title
```bash
# PLANNER
GET /api/planner/event-detail/Birthday
Authorization: Bearer {planner_token}

# STAFF
GET /api/staff/event-detailsbyTitle/Birthday
Authorization: Bearer {staff_token}

# CLIENT
GET /api/client/event-detailsbyTitleforClient/Birthday
Authorization: Bearer {client_token}
```

---

## ✅ Verification Checklist

- [x] Message entity created
- [x] MessageRepository created
- [x] MessageService created
- [x] Event entity updated with assignedStaff
- [x] EventService updated with staff assignment
- [x] PLANNER endpoints added (staff, assign-staff, messaging)
- [x] CLIENT endpoints added (allEvents, messaging)
- [x] SecurityConfig updated
- [x] STAFF update permission removed
- [x] All files compile without errors

---

## 🚀 Next Steps: Frontend Implementation

1. Create staff assignment component for PLANNER
2. Create booking form for CLIENT
3. Create messaging component (simple chat)
4. Update search to work with both ID and title
5. Remove update functionality from STAFF view
6. Test all new features end-to-end

---

**Status:** ✅ Backend Complete  
**Build:** ✅ No Errors  
**Ready for Frontend:** YES
