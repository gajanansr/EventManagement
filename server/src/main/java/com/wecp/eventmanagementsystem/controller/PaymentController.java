package com.wecp.eventmanagementsystem.controller;

import com.wecp.eventmanagementsystem.dto.PaymentOrderRequest;
import com.wecp.eventmanagementsystem.dto.PaymentOrderResponse;
import com.wecp.eventmanagementsystem.dto.PaymentVerificationRequest;
import com.wecp.eventmanagementsystem.entity.Payment;
import com.wecp.eventmanagementsystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    /**
     * Create a payment order
     * POST /api/payment/create-order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentOrderRequest request) {
        try {
            PaymentOrderResponse response = paymentService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Verify payment and create booking
     * POST /api/payment/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            Map<String, Object> response = paymentService.verifyPaymentAndCreateBooking(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Get payment status by Razorpay payment ID
     * GET /api/payment/status/{paymentId}
     */
    @GetMapping("/status/{paymentId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String paymentId) {
        try {
            Payment payment = paymentService.getPaymentStatus(paymentId);
            Map<String, Object> response = new HashMap<>();
            response.put("paymentId", payment.getPaymentId());
            response.put("razorpayOrderId", payment.getRazorpayOrderId());
            response.put("razorpayPaymentId", payment.getRazorpayPaymentId());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());
            response.put("status", payment.getStatus());
            response.put("bookingId", payment.getBooking() != null ? payment.getBooking().getBookingId() : null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    /**
     * Get payment by booking ID
     * GET /api/payment/booking/{bookingId}
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBooking(@PathVariable Long bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBookingId(bookingId);
            Map<String, Object> response = new HashMap<>();
            response.put("paymentId", payment.getPaymentId());
            response.put("razorpayOrderId", payment.getRazorpayOrderId());
            response.put("razorpayPaymentId", payment.getRazorpayPaymentId());
            response.put("amount", payment.getAmount());
            response.put("currency", payment.getCurrency());
            response.put("status", payment.getStatus());
            response.put("bookingId", payment.getBooking().getBookingId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
}
