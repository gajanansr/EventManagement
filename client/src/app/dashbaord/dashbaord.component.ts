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
  
  
  totalEvents: number = 0;
  totalResources: number = 0;
  totalAllocations: number = 0;
  activeEvents: number = 0;
  
  
  scheduledEvents: number = 0;
  completedEvents: number = 0;
  upcomingEvents: number = 0;
  
  
  totalBookings: number = 0;
  pendingBookings: number = 0;
  confirmedBookings: number = 0;
  upcomingBookings: number = 0;
  
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
    
    this.httpService.GetAllevents().subscribe(
      (events: any) => {
        this.totalEvents = events.length;
        this.activeEvents = events.filter((e: any) => 
          e.status === 'Scheduled' || e.status === 'Active'
        ).length;
        
      
        this.scheduledEvents = events.filter((e: any) => e.status === 'Scheduled').length;
        this.completedEvents = events.filter((e: any) => e.status === 'Completed').length;
        
       
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        this.upcomingEvents = events.filter((e: any) => {
          if (e.status !== 'Scheduled') return false;
          const eventDate = new Date(e.dateTime);
          eventDate.setHours(0, 0, 0, 0); 
          return eventDate >= today && eventDate <= next30Days;
        }).length;
        
        
        this.totalAllocations = events.reduce((total: number, event: any) => {
          return total + (event.allocations ? event.allocations.length : 0);
        }, 0);
      },
      (error: any) => console.error('Error loading events:', error)
    );

    
    this.httpService.GetAllResources().subscribe(
      (resources: any) => {
        this.totalResources = resources.length;
      },
      (error: any) => console.error('Error loading resources:', error)
    );
  }

  loadStaffStats() {
    
    this.httpService.GetEvents().subscribe(
      (events: any) => {
        this.totalEvents = events.length;
        
        
        this.activeEvents = events.filter((e: any) => 
          e.status === 'Scheduled' || e.status === 'Active'
        ).length;
        
        this.scheduledEvents = events.filter((e: any) => e.status === 'Scheduled').length;
        this.completedEvents = events.filter((e: any) => e.status === 'Completed').length;
        
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        this.upcomingEvents = events.filter((e: any) => {
          if (e.status !== 'Scheduled') return false;
          const eventDate = new Date(e.dateTime);
          eventDate.setHours(0, 0, 0, 0); 
          return eventDate >= today && eventDate <= next30Days;
        }).length;
      },
      (error: any) => console.error('Error loading events:', error)
    );
  }

  loadClientStats() {
    
    this.httpService.getMyBookings().subscribe(
      (bookings: any) => {
        this.totalBookings = bookings.length;
        this.pendingBookings = bookings.filter((b: any) => 
          b.status === 'PENDING' || b.status === 'Pending'
        ).length;
        this.confirmedBookings = bookings.filter((b: any) => 
          b.status === 'CONFIRMED' || b.status === 'Confirmed'
        ).length;
        
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        this.upcomingBookings = bookings.filter((b: any) => {
          if (b.status !== 'CONFIRMED' && b.status !== 'Confirmed') return false;
          if (!b.event) return false;
          
          const eventDate = new Date(b.event.dateTime || b.event.date);
          if (isNaN(eventDate.getTime())) return false; 
          eventDate.setHours(0, 0, 0, 0); 
          return eventDate >= today;
        }).length;
      },
      error => {
        console.error('Error loading bookings:', error);
        
        this.totalBookings = 0;
        this.pendingBookings = 0;
        this.confirmedBookings = 0;
        this.upcomingBookings = 0;
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
}
