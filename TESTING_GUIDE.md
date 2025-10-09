# Testing Guide - Planner Event Filtering Feature

## 🎯 What Was Implemented

The system now supports **multiple independent planners**, where each planner can only see and manage their own events.

---

## ✅ Complete Feature List

### 1. **CAPTCHA Verification** ✅
- Random number addition during registration
- Refresh button to generate new problems
- Must be solved correctly to proceed

### 2. **Planner Access Key** ✅  
- Access key "1234" required for PLANNER role
- Show/hide toggle for security
- Field only visible when PLANNER role selected

### 3. **Show/Hide Password** ✅
- All password fields have eye icon toggles
- Login, Registration, and Profile pages
- Access key field also has toggle

### 4. **Planner-Event Isolation** ✅
- Events linked to creator planner
- Each planner sees only their events
- Complete data isolation

---

## 🧪 Testing Instructions

### Test 1: Register Multiple Planners

#### Planner 1:
1. Navigate to registration page
2. Fill in details:
   - Name: `John Smith`
   - Username: `johnplanner`
   - Email: `john@planner.com`
   - Password: `Password123@`
   - Role: **Event Planner**
3. **Access Key field appears** - Enter: `1234`
4. **CAPTCHA appears** - Solve the math problem (e.g., 12 + 8 = 20)
5. Click "Create Account"
6. Should see success message and redirect to login

#### Planner 2:
1. Repeat above with different details:
   - Name: `Jane Doe`
   - Username: `janeplanner`
   - Email: `jane@planner.com`
   - Password: `Password456@`
   - Role: **Event Planner**
   - Access Key: `1234`
   - Solve CAPTCHA
2. Register successfully

### Test 2: Create Events as Different Planners

#### As johnplanner:
1. Login with `johnplanner` / `Password123@`
2. Go to Dashboard → Create Event
3. Create events:
   - Event 1: "Tech Conference 2025"
   - Event 2: "Product Launch"
   - Event 3: "Team Building"

#### As janeplanner:
1. **Logout** from johnplanner
2. Login with `janeplanner` / `Password456@`
3. Go to Dashboard → Create Event
4. Create events:
   - Event 1: "Marketing Summit"
   - Event 2: "Client Workshop"

### Test 3: Verify Event Isolation

#### Logged in as johnplanner:
1. Go to "View Events" or Dashboard
2. **Should ONLY see**:
   - Tech Conference 2025
   - Product Launch
   - Team Building
3. **Should NOT see**:
   - Marketing Summit
   - Client Workshop

#### Logged in as janeplanner:
1. Go to "View Events" or Dashboard
2. **Should ONLY see**:
   - Marketing Summit
   - Client Workshop
3. **Should NOT see**:
   - Tech Conference 2025
   - Product Launch
   - Team Building

### Test 4: Dashboard Statistics

#### As johnplanner:
- Total Events: 3
- Scheduled Events: (count of scheduled)
- Upcoming Events: (events within 30 days)
- Statistics should ONLY reflect johnplanner's events

#### As janeplanner:
- Total Events: 2
- Statistics should ONLY reflect janeplanner's events

### Test 5: Search and Filter

#### As johnplanner:
1. Search for "Tech Conference"
   - ✅ Should find "Tech Conference 2025"
2. Search for "Marketing Summit"
   - ❌ Should find NOTHING (belongs to janeplanner)

#### As janeplanner:
1. Search for "Marketing Summit"
   - ✅ Should find it
2. Search for "Product Launch"
   - ❌ Should find NOTHING (belongs to johnplanner)

### Test 6: Update and Delete Events

#### As johnplanner:
1. Try to update "Tech Conference 2025"
   - ✅ Should work
2. Try to delete "Team Building"
   - ✅ Should work

**Note**: Currently, there's no authorization check on update/delete endpoints. If you can access the event ID, you could potentially modify it. This is a security enhancement opportunity.

### Test 7: Show/Hide Password Feature

1. **Login Page**:
   - Type password
   - Click eye icon → password becomes visible
   - Click again → password hidden

2. **Registration Page**:
   - Type password → click eye to view
   - Select PLANNER role
   - Type access key → click eye to view

3. **Profile Page**:
   - Go to Change Password
   - All 3 fields (current, new, confirm) have eye toggles
   - Test each one independently

### Test 8: CAPTCHA Variations

1. **Registration Page**:
   - Note the CAPTCHA: e.g., "15 + 7 = ?"
   - Click refresh button (↻)
   - Numbers should change
   - Try wrong answer → should show error
   - Try correct answer → should proceed

### Test 9: Access Key Validation

1. **Try registering PLANNER without access key**:
   - Should show error "Access key is required"

2. **Try wrong access key**:
   - Enter "0000" instead of "1234"
   - Should show error "Invalid access key"

3. **Try correct access key**:
   - Enter "1234"
   - Should proceed if other fields valid

### Test 10: Cross-Role Testing

#### Register as STAFF:
1. Register with role "Staff Member"
2. **Should NOT see** access key field
3. **Should see** CAPTCHA
4. Login and check dashboard
5. Staff should see ALL events (not filtered)

#### Register as CLIENT:
1. Register with role "Client"
2. **Should NOT see** access key field
3. **Should see** CAPTCHA  
4. Login and browse events
5. Client should see ALL events (to book from)

---

## 🔍 What to Look For

### ✅ Expected Behavior:
- Planners see only their own events
- Dashboard stats reflect only planner's events
- Search works within planner's event scope
- CAPTCHA must be solved correctly
- Access key "1234" required for planners
- Password toggles work on all forms

### ❌ Issues to Report:
- Planner sees another planner's events
- Statistics include other planners' events
- Can search and find other planners' events
- CAPTCHA not validating
- Access key not enforced
- Password toggle not working

---

## 🗄️ Database Verification (Optional)

If you have database access:

```sql
-- Check events and their creators
SELECT e.eventID, e.title, e.status, u.username as createdBy, u.role
FROM events e
LEFT JOIN users u ON e.createdByPlannerId = u.userId;

-- Should show each event linked to its creator planner
```

---

## 🚀 Next Steps After Testing

If all tests pass:

1. ✅ Merge `gajanannew` branch to `main`
2. ✅ Deploy to production
3. ✅ Create user documentation
4. ✅ Train planners on the system

### Optional Enhancements:

1. **Authorization on Update/Delete**:
   - Prevent planners from modifying others' events
   - Add ownership checks in controller

2. **Admin Panel**:
   - View all events across all planners
   - Manage access keys
   - Generate reports

3. **Event Transfer**:
   - Allow transferring event ownership
   - Planner delegation features

4. **Analytics Dashboard**:
   - Compare performance across planners
   - System-wide statistics

---

## 📱 Contact

If you find any issues during testing:
- Check server logs: `server/server.log`
- Check browser console for frontend errors
- Verify JWT token includes correct user info
- Confirm database has `createdByPlannerId` column in `events` table

---

**Testing Status**: Ready for QA ✅
**Branch**: `gajanannew`
**Deployment**: Pending final approval
