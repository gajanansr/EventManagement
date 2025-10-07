import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
 
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class BookingDetailsComponent implements OnInit {
 
  itemForm: FormGroup;
  myBookings: any[] = [];
  displayedBookings: any[] = [];
  message: { type: 'success' | 'error', text: string } | null = null;
  searchPerformed: boolean = false;
  loadingBookings: boolean = false;
  searchControl = new FormControl('');
  expandedBooking: any = null;
  currentFilter = 'all';

  displayedColumns: string[] = ['expand', 'id', 'event', 'eventDate', 'bookingDate', 'status', 'actions'];
 
  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router
  ) {
    this.itemForm = this.formBuilder.group({
      searchTerm: ['']
    });
  }
 
  ngOnInit(): void {
    this.loadMyBookings();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges.subscribe(value => {
      this.applyFilters();
    });
  }

  loadMyBookings(): void {
    this.loadingBookings = true;
    this.httpService.getMyBookings().subscribe(
      (bookings: any) => {
        this.myBookings = bookings;
        this.applyFilters();
        this.loadingBookings = false;
      },
      (error: any) => {
        console.error('Error loading bookings:', error);
        this.showTemporaryMessage('error', 'Failed to load your bookings');
        this.loadingBookings = false;
      }
    );
  }

  applyFilters(): void {
    let filtered = [...this.myBookings];

    // Apply status filter
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(booking => 
        booking.status?.toUpperCase() === this.currentFilter
      );
    }

    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(booking => {
        const eventTitle = booking.event?.title?.toLowerCase() || '';
        const eventLocation = booking.event?.location?.toLowerCase() || '';
        const bookingId = booking.bookingId?.toString() || '';
        return eventTitle.includes(searchTerm) || 
               bookingId.includes(searchTerm) ||
               eventLocation.includes(searchTerm);
      });
    }

    this.displayedBookings = filtered;
  }

  filterByStatus(status: string): void {
    this.currentFilter = status;
    this.applyFilters();
  }
 
  searchBookings(): void {
    const searchTerm = this.itemForm.get('searchTerm')?.value?.toLowerCase().trim();
    
    if (!searchTerm) {
      this.displayedBookings = this.myBookings;
      this.searchPerformed = false;
      return;
    }
    
    this.searchPerformed = true;
    this.displayedBookings = this.myBookings.filter(booking => {
      const eventTitle = booking.event?.title?.toLowerCase() || '';
      const bookingId = booking.bookingId?.toString() || '';
      const eventLocation = booking.event?.location?.toLowerCase() || '';
      
      return eventTitle.includes(searchTerm) || 
             bookingId.includes(searchTerm) ||
             eventLocation.includes(searchTerm);
    });
    
    if (this.displayedBookings.length > 0) {
      this.showTemporaryMessage('success', `Found ${this.displayedBookings.length} booking(s)`);
    } else {
      this.showTemporaryMessage('error', 'No bookings match your search');
    }
  }
  
  clearSearch(): void {
    this.searchControl.setValue('');
    this.currentFilter = 'all';
    this.applyFilters();
    this.message = null;
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'APPROVED':
        return 'status-confirmed';
      case 'PENDING':
        return 'status-pending';
      case 'CANCELLED':
      case 'REJECTED':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'APPROVED':
        return 'check_circle';
      case 'PENDING':
        return 'pending';
      case 'CANCELLED':
      case 'REJECTED':
        return 'cancel';
      default:
        return 'info';
    }
  }
 
  getBookingStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'APPROVED':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  viewDetails(booking: any): void {
    this.expandedBooking = this.expandedBooking === booking ? null : booking;
  }

  cancelBooking(booking: any): void {
    if (confirm(`Are you sure you want to cancel booking #${booking.bookingId}?`)) {
      // Implement cancel logic here
      this.showTemporaryMessage('success', `Booking #${booking.bookingId} has been cancelled.`);
      booking.status = 'CANCELLED';
      this.applyFilters();
    }
  }

  downloadTicket(booking: any): void {
    // Implement download logic here
    this.showTemporaryMessage('success', `Downloading ticket for booking #${booking.bookingId}...`);
  }

  viewEventDetails(event: any): void {
    if (event && event.id) {
      this.router.navigate(['/view-events', event.id]);
    }
  }
 
  private showTemporaryMessage(type: 'success' | 'error', text: string): void {
    this.message = { type, text };
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
}
