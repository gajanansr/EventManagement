import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  statename: any = {}
  showError: any;
  errorMessage: any;
  stateIdMd: any;
  roleName: string | null;
  
  // Make Math available in template
  Math = Math;
  
  // Planner Statistics
  totalEvents: number = 0;
  totalResources: number = 0;
  totalAllocations: number = 0;
  activeEvents: number = 0;
  
  // Staff Statistics
  scheduledEvents: number = 0;
  completedEvents: number = 0;
  upcomingEvents: number = 0;
  
  // Client Statistics
  totalBookings: number = 0;
  pendingBookings: number = 0;
  confirmedBookings: number = 0;
  upcomingBookings: number = 0;
  
  // Actual data arrays
  ongoingEvents: any[] = [];
  upcomingEventsList: any[] = [];
  recentEvents: any[] = [];
  myBookingsList: any[] = [];
  
  constructor(
    public router: Router, 
    public httpService: HttpService, 
    private formBuilder: FormBuilder, 
    private authService: AuthService
  ) {
    console.log("Constructor");
    this.roleName = authService.getRole;
  }
  
  ngOnInit(): void {
    console.log("ngOnInit");
    this.dashboardView();
    this.loadStatistics();
  }

  dashboardView() {
    console.log(this.stateIdMd);
    console.log("stateMd Call");
    this.statename = {};
    this.httpService.getStatename().subscribe((data: any) => {
      this.statename = data;
      console.log(this.statename);
    }, error => {
      this.showError = true;
      this.errorMessage = "An error occurred while searching in. Please try again later or no record found";
      console.error('Login error:', error);
    });
  }

  loadStatistics() {
    if (this.roleName === 'PLANNER') {
      this.loadPlannerStats();
    } else if (this.roleName === 'STAFF') {
      this.loadStaffStats();
    } else if (this.roleName === 'CLIENT') {
      this.loadClientStats();
    }
  }

  loadPlannerStats() {
    // Load events
    this.httpService.GetAllevents().subscribe(
      (events: any) => {
        this.totalEvents = events.length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter ongoing events (today's events)
        this.ongoingEvents = events.filter((e: any) => {
          if (!e.dateTime) return false;
          const eventDate = new Date(e.dateTime);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime() && 
                 (e.status === 'Scheduled' || e.status === 'Active');
        }).slice(0, 4); // Limit to 4
        
        // Filter upcoming events (future events)
        this.upcomingEventsList = events.filter((e: any) => {
          if (!e.dateTime) return false;
          const eventDate = new Date(e.dateTime);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate > today && e.status === 'Scheduled';
        }).sort((a: any, b: any) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        }).slice(0, 5); // Limit to 5
        
        // Recent events (recently created or updated)
        this.recentEvents = [...events]
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.dateTime).getTime();
            const dateB = new Date(b.createdAt || b.dateTime).getTime();
            return dateB - dateA;
          })
          .slice(0, 5); // Limit to 5
        
        this.activeEvents = events.filter((e: any) => 
          e.status === 'Scheduled' || e.status === 'Active'
        ).length;
        
        // Count total allocations
        this.totalAllocations = events.reduce((total: number, event: any) => {
          return total + (event.allocations ? event.allocations.length : 0);
        }, 0);
      },
      (error: any) => console.error('Error loading events:', error)
    );

    // Load resources
    this.httpService.GetAllResources().subscribe(
      (resources: any) => {
        this.totalResources = resources.length;
      },
      (error: any) => console.error('Error loading resources:', error)
    );
  }

  loadStaffStats() {
    // Load only assigned events for staff
    this.httpService.GetEvents().subscribe(
      (events: any) => {
        this.totalEvents = events.length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter ongoing events (today's events)
        this.ongoingEvents = events.filter((e: any) => {
          if (!e.dateTime) return false;
          const eventDate = new Date(e.dateTime);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime() && 
                 (e.status === 'Scheduled' || e.status === 'Active');
        }).slice(0, 4);
        
        // Filter upcoming events
        this.upcomingEventsList = events.filter((e: any) => {
          if (!e.dateTime) return false;
          const eventDate = new Date(e.dateTime);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate > today && e.status === 'Scheduled';
        }).sort((a: any, b: any) => {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        }).slice(0, 5);
        
        // Count active events (Scheduled or Active status)
        this.activeEvents = events.filter((e: any) => 
          e.status === 'Scheduled' || e.status === 'Active'
        ).length;
        
        this.scheduledEvents = events.filter((e: any) => e.status === 'Scheduled').length;
        this.completedEvents = events.filter((e: any) => e.status === 'Completed').length;
        
        // Upcoming events (scheduled and within next 30 days)
        const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        this.upcomingEvents = events.filter((e: any) => {
          if (e.status !== 'Scheduled') return false;
          const eventDate = new Date(e.dateTime);
          return eventDate >= today && eventDate <= next30Days;
        }).length;
      },
      (error: any) => console.error('Error loading events:', error)
    );
  }

  loadClientStats() {
    // Load bookings for client
    this.httpService.getMyBookings().subscribe(
      (bookings: any) => {
        this.totalBookings = bookings.length;
        this.myBookingsList = bookings.slice(0, 5); // Limit to 5 recent bookings
        
        this.pendingBookings = bookings.filter((b: any) => 
          b.status === 'PENDING' || b.status === 'Pending'
        ).length;
        this.confirmedBookings = bookings.filter((b: any) => 
          b.status === 'CONFIRMED' || b.status === 'Confirmed'
        ).length;
        
        // Upcoming bookings (confirmed and event date in future)
        const today = new Date();
        this.upcomingBookings = bookings.filter((b: any) => {
          if (b.status !== 'CONFIRMED' && b.status !== 'Confirmed') return false;
          if (!b.event || !b.event.dateTime) return false;
          const eventDate = new Date(b.event.dateTime);
          return eventDate >= today;
        }).length;
      },
      error => {
        console.error('Error loading bookings:', error);
        // Set to 0 if error (user might not have bookings yet)
        this.totalBookings = 0;
        this.pendingBookings = 0;
        this.confirmedBookings = 0;
        this.upcomingBookings = 0;
        this.myBookingsList = [];
      }
    );
  }

  scrollToBookings() {
    const element = document.getElementById('bookings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToEvents() {
    const element = document.getElementById('events-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  // Helper methods for displaying data
  getEventDate(event: any): string {
    if (!event.dateTime) return 'N/A';
    const date = new Date(event.dateTime);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getEventTime(event: any): string {
    if (!event.dateTime) return 'N/A';
    const date = new Date(event.dateTime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  getEventDay(event: any): string {
    if (!event.dateTime) return '?';
    const date = new Date(event.dateTime);
    return date.getDate().toString();
  }

  getEventMonth(event: any): string {
    if (!event.dateTime) return '?';
    const date = new Date(event.dateTime);
    return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    const statusLower = status.toLowerCase();
    if (statusLower === 'scheduled' || statusLower === 'active') return 'status-success';
    if (statusLower === 'completed') return 'status-info';
    if (statusLower === 'cancelled') return 'status-error';
    return 'status-warning';
  }

  getBookingStatusClass(status: string): string {
    if (!status) return 'status-default';
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed') return 'status-success';
    if (statusLower === 'pending') return 'status-warning';
    if (statusLower === 'cancelled' || statusLower === 'rejected') return 'status-error';
    return 'status-default';
  }

  navigateToEvent(eventId: any) {
    if (eventId) {
      this.router.navigate(['/view-events'], { queryParams: { eventId: eventId } });
    }
  }
}
