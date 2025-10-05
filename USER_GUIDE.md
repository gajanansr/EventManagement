# Event Management System - User Guide

## 🎯 How to Use the New Features

### For PLANNER Role 👔

#### 1. **Assign Staff to Events**
- Navigate to **View Events** page
- In the events table, look for the **"Assigned Staff"** column
- For events without staff:
  - Click the **"Assign Staff"** button
  - A modal will open showing the event details
  - Select a staff member from the dropdown
  - Click **"Assign Staff"** to confirm
  - The event will now show the assigned staff member's name

#### 2. **Send Messages to Clients**
- In the **"Action"** column, click the **"Messages"** button
- A chat-style modal will open showing:
  - All previous messages for that event
  - Your messages appear on the right (blue)
  - Client messages appear on the left (gray)
- Type your message in the input box at the bottom
- Click **"Send"** or press Enter
- The message is immediately added to the conversation

#### 3. **Update Events**
- Click the **"Update"** button in the Action column
- Modify event details
- Save changes

---

### For CLIENT Role 👤

#### 1. **Book an Event**
- Navigate to **View Events** page
- Browse available events in the table
- In the **"Action"** column, click the **"Book Event"** button (green)
- A modal will open showing:
  - Event title, date, location
  - Event description
  - A text area for your requirements
- Enter any special requirements or preferences (optional)
- Click **"Confirm Booking"**
- You'll see a success message
- The booking is created and can be viewed in your bookings

#### 2. **Send Messages to Planner**
- In the **"Action"** column, click the **"Messages"** button (blue)
- A chat-style modal will open
- Type your message about the event
- Click **"Send"** or press Enter
- The planner will receive your message

---

### For STAFF Role 👷

#### 1. **View Messages**
- Navigate to **View Events** page
- In the **"Action"** column, click the **"Messages"** button
- View all messages related to events you're assigned to
- Send updates or ask questions

#### 2. **View Events**
- Browse all events
- See event details including:
  - Event ID, Title, Description
  - Date and Time
  - Location and Status
  - Allocated Resources

**Note:** STAFF cannot update events or assign staff (permissions removed for security)

---

## 📍 Where to Find Everything

### View Events Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Event Management System - View Events                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Search: [________________]  [Search by ID] [Search by Title]  │
│                                                                 │
│  Sort by: [Dropdown]                                           │
│                                                                 │
├──┬────────┬─────────┬──────┬──────────┬────────┬──────────────┤
│ID│ Title  │ Desc    │ Date │ Location │ Status │ Action       │
├──┼────────┼─────────┼──────┼──────────┼────────┼──────────────┤
│  │        │         │      │          │        │              │
│  │        │         │      │          │        │ [Buttons]    │
│  │        │         │      │          │        │  depend on   │
│  │        │         │      │          │        │  your role   │
└──┴────────┴─────────┴──────┴──────────┴────────┴──────────────┘
```

### Action Column Buttons by Role

**PLANNER sees:**
- 🔵 **Update** button (primary)
- 🔵 **Messages** button (info)
- *(In Assigned Staff column)* **Assign Staff** button (secondary)

**CLIENT sees:**
- 🟢 **Book Event** button (success)
- 🔵 **Messages** button (info)

**STAFF sees:**
- 🔵 **Messages** button (info)

---

## 🎨 Modal Descriptions

### 1. Staff Assignment Modal (PLANNER only)
```
┌───────────────────────────────────┐
│ Assign Staff to Event        [X] │
├───────────────────────────────────┤
│ Event: Summer Festival            │
│ Location: Central Park            │
│ Date: June 15, 2025               │
│                                   │
│ Select Staff Member:              │
│ [Dropdown: John Doe ▼]           │
│                                   │
│ [Cancel]         [Assign Staff]   │
└───────────────────────────────────┘
```

### 2. Messaging Modal (All roles)
```
┌────────────────────────────────────────┐
│ Event Messages               [X]      │
├────────────────────────────────────────┤
│ Event: Summer Festival                 │
│ ────────────────────────────────────── │
│                                        │
│    ┌──────────────────┐               │
│    │ Client: Need...  │               │
│    │ 2:30 PM          │               │
│    └──────────────────┘               │
│                                        │
│               ┌──────────────────┐    │
│               │ Planner: Sure... │    │
│               │ 2:35 PM          │    │
│               └──────────────────┘    │
│                                        │
│ ────────────────────────────────────── │
│ [Type your message...] [Send]         │
└────────────────────────────────────────┘
```

### 3. Booking Modal (CLIENT only)
```
┌───────────────────────────────────┐
│ Book Event                   [X] │
├───────────────────────────────────┤
│ Summer Festival                   │
│ 📅 June 15, 2025, 2:00 PM        │
│ 📍 Central Park                   │
│                                   │
│ An amazing outdoor festival...    │
│                                   │
│ Your Requirements:                │
│ ┌─────────────────────────────┐  │
│ │ Enter any special requests  │  │
│ │ or requirements here...     │  │
│ │                             │  │
│ └─────────────────────────────┘  │
│                                   │
│ [Cancel]      [Confirm Booking]   │
└───────────────────────────────────┘
```

---

## 🔍 Search Functionality

### Search by ID
1. Enter the event ID in the search box
2. Click **"Search by ID"** button
3. The matching event will be displayed

### Search by Title
1. Enter the event title (partial match works)
2. Click **"Search by Title"** button
3. All events matching the title will be displayed

**Note:** Search works for all roles (PLANNER, STAFF, CLIENT)

---

## ✅ Success Indicators

### Staff Assignment
- ✅ Modal shows "Staff assigned successfully!"
- ✅ The assigned staff's name appears in the table
- ✅ The "Assign Staff" button changes to show the staff name

### Booking
- ✅ Modal shows "Booking created successfully!"
- ✅ Modal automatically closes after 2 seconds
- ✅ Check "My Bookings" page to see your booking

### Messaging
- ✅ Message appears immediately in the chat
- ✅ Messages are color-coded (blue for you, gray for others)
- ✅ Auto-scrolls to show the latest message

---

## ❌ Common Issues & Solutions

### "Buttons don't do anything"
✅ **Fixed!** The latest update removes the Bootstrap toggle attributes that were blocking the click handlers.

### "I don't see the Book Event button"
- Make sure you're logged in as a **CLIENT**
- The button only appears for CLIENT role
- Check that you're on the **View Events** page

### "I can't assign staff"
- Make sure you're logged in as a **PLANNER**
- Only PLANNER role can assign staff
- Make sure there are users with STAFF role in the system

### "Messages aren't sending"
- Check your internet connection
- Make sure you're logged in
- Verify the event ID is valid
- Check browser console for errors (F12)

### "Staff Assignment dropdown is empty"
- Make sure there are users registered with STAFF role
- Contact administrator to create STAFF users

---

## 🔐 Security & Permissions

### PLANNER Can:
- ✅ Create, view, update events
- ✅ Assign staff to events
- ✅ View all staff members
- ✅ Send and receive messages
- ✅ View all bookings

### CLIENT Can:
- ✅ View all events
- ✅ Book events
- ✅ View their bookings
- ✅ Send and receive messages
- ❌ Cannot create or update events
- ❌ Cannot assign staff

### STAFF Can:
- ✅ View events
- ✅ View assigned events
- ✅ Send and receive messages
- ❌ Cannot update events (permission removed)
- ❌ Cannot assign other staff
- ❌ Cannot create bookings

---

## 🚀 Quick Start Checklist

### As PLANNER:
1. ✅ Login with PLANNER credentials
2. ✅ Go to View Events
3. ✅ Create or select an event
4. ✅ Click "Assign Staff" to assign a staff member
5. ✅ Click "Messages" to communicate with clients

### As CLIENT:
1. ✅ Login with CLIENT credentials
2. ✅ Go to View Events
3. ✅ Browse available events
4. ✅ Click green "Book Event" button
5. ✅ Fill in requirements and confirm
6. ✅ Click "Messages" to ask questions

### As STAFF:
1. ✅ Login with STAFF credentials
2. ✅ Go to View Events
3. ✅ View events you're assigned to
4. ✅ Click "Messages" to communicate

---

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Check browser console (F12) for errors
3. Verify you're using the correct role
4. Make sure the backend server is running
5. Check that MySQL database is connected

---

**Version:** 1.0.0  
**Last Updated:** October 5, 2025  
**Status:** ✅ All features functional and tested
