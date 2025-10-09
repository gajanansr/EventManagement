import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getEventById(id: number): Observable<any> {
    const url = `${this.serverName}/api/planner/event-details/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }
  
  getEventsByTitle(title: string): Observable<any[]> {
    const url = `${this.serverName}/api/planner/event-detail/${title}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<any[]>(url, { headers });
  }

  getBookingDetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/client/booking-details/${eventId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  GetEventdetails(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-details/${eventId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  deleteEventDetailsByID(eventId: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event/${eventId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.delete(url, { headers });
  }

  GetAllevents(): Observable<any> {
    const url = `${this.serverName}/api/planner/events`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  GetEventdetailsbyTitleforClient(title: any): Observable<any> {
    const url = `${this.serverName}/api/client/event-detailsbyTitleforClient/${title}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  GetEventdetailsbyTitle(title: any): Observable<any> {
    const url = `${this.serverName}/api/staff/event-detailsbyTitle/${title}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  GetEvents(): Observable<any> {
    const url = `${this.serverName}/api/staff/allEvents`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  GetAlleventsForClient():Observable<any> {
    const url = `${this.serverName}/api/client/allEvents`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  GetAllResources(): Observable<any> {
    const url = `${this.serverName}/api/planner/resources`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  createEvent(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/event`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(url, details, { headers });
  }

  updateEvent(details: any, eventId: any): Observable<any> {
    const url = `${this.serverName}/api/staff/update-setup/${eventId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.put(url, details, { headers });
  }

  addResource(details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/resource`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(url, details, { headers });
  }

  allocateResources(eventId: any, resourceId: any, details: any): Observable<any> {
    const url = `${this.serverName}/api/planner/allocate-resources?eventId=${eventId}&resourceId=${resourceId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(url, details, { headers });
  }

  Login(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, details, { headers });
  }

  registerUser(details: any): Observable<any> {
    const url = `${this.serverName}/api/user/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, details, { headers });
  }
  getStatename(): Observable<any> {

      const authToken = this.authService.getToken();
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', `Bearer ${authToken}`)
      return this.http.get(this.serverName + `/api/state/`, { headers: headers });
    }

  GetAllUsers(): Observable<any> {
    return this.http.get(`${this.serverName}/api/user/users`, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  // Profile Management
  getUserProfile(): Observable<any> {
    const url = `${this.serverName}/api/profile`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  updateUserProfile(profileData: any): Observable<any> {
    const url = `${this.serverName}/api/profile`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.put(url, profileData, { headers });
  }

  // Client Bookings
  getMyBookings(): Observable<any> {
    const url = `${this.serverName}/api/client/my-bookings`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  getMyBooking(bookingId: number): Observable<any> {
    const url = `${this.serverName}/api/client/my-booking/${bookingId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  createBooking(bookingData: any): Observable<any> {
    const url = `${this.serverName}/api/client/create-booking`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(url, bookingData, { headers });
  }

  // Staff Assignment (PLANNER)
  getAllStaff(): Observable<any> {
    const url = `${this.serverName}/api/planner/staff`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  assignStaffToEvent(eventId: number, staffId: number): Observable<any> {
    const url = `${this.serverName}/api/planner/assign-staff?eventId=${eventId}&staffId=${staffId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(url, {}, { headers });
  }

  // Messaging (CLIENT, STAFF and PLANNER)
  sendMessage(messageData: any): Observable<any> {
    const role = this.authService.getRole;
    let endpoint = 'client';
    if (role === 'PLANNER') {
      endpoint = 'planner';
    } else if (role === 'STAFF') {
      endpoint = 'staff';
    }
    const url = `${this.serverName}/api/${endpoint}/send-message`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.post(url, messageData, { headers });
  }

  getEventMessages(eventId: number): Observable<any> {
    const role = this.authService.getRole;
    let endpoint = 'client';
    if (role === 'PLANNER') {
      endpoint = 'planner';
    } else if (role === 'STAFF') {
      endpoint = 'staff';
    }
    const url = `${this.serverName}/api/${endpoint}/messages/${eventId}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  // Booking management for PLANNER
  getAllBookings(): Observable<any> {
    const url = `${this.serverName}/api/planner/bookings`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(url, { headers });
  }

  updateBookingStatus(bookingId: number, status: string, notes?: string): Observable<any> {
    const url = `${this.serverName}/api/planner/booking/${bookingId}/status`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    const body = { status, notes };
    return this.http.put(url, body, { headers });
  }
}

