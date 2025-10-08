import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a payment order
   */
  createPaymentOrder(bookingData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.post(`${this.apiUrl}/payment/create-order`, bookingData, { headers });
  }

  /**
   * Verify payment after successful transaction
   */
  verifyPayment(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.post(`${this.apiUrl}/payment/verify`, paymentData, { headers });
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.get(`${this.apiUrl}/payment/status/${paymentId}`, { headers });
  }

  /**
   * Initialize Razorpay payment
   */
  initiateRazorpayPayment(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const rzp = new (window as any).Razorpay({
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        order_id: options.order_id,
        handler: (response: any) => {
          resolve(response);
        },
        prefill: options.prefill,
        theme: options.theme,
        modal: {
          ondismiss: () => {
            reject({ error: 'Payment cancelled by user' });
          }
        }
      });
      
      rzp.open();
    });
  }

  /**
   * Calculate booking amount based on event details
   */
  calculateBookingAmount(event: any): number {
    // Base price for event booking
    let basePrice = event.basePrice || 5000;
    
    // You can add additional calculations based on event type, duration, etc.
    if (event.eventType === 'Premium') {
      basePrice *= 1.5;
    }
    
    // Add taxes (e.g., 18% GST)
    const tax = basePrice * 0.18;
    const totalAmount = basePrice + tax;
    
    return Math.round(totalAmount * 100); // Convert to paise for Razorpay
  }
}
