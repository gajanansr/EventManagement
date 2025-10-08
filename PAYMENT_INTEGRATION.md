# Payment Gateway Integration - Razorpay

## Overview
This document explains the payment gateway integration added to the Event Management System using Razorpay.

## Features
- ✅ Secure payment processing during event booking
- ✅ Real-time payment verification
- ✅ Automatic booking confirmation after successful payment
- ✅ Payment status tracking
- ✅ User-friendly payment modal
- ✅ GST calculation (18%)

## Setup Instructions

### 1. Backend Setup (Required)

You need to create the following REST endpoints in your Spring Boot backend:

#### a. Create Payment Order Endpoint
```java
@PostMapping("/api/payment/create-order")
public ResponseEntity<?> createPaymentOrder(@RequestBody PaymentRequest request) {
    // Generate Razorpay order
    // Return order details with orderId, amount, currency
}
```

#### b. Verify Payment Endpoint
```java
@PostMapping("/api/payment/verify")
public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerification verification) {
    // Verify Razorpay signature
    // Create booking in database
    // Return success response
}
```

#### c. Payment Status Endpoint
```java
@GetMapping("/api/payment/status/{paymentId}")
public ResponseEntity<?> getPaymentStatus(@PathVariable String paymentId) {
    // Return payment status
}
```

### 2. Razorpay Account Setup

1. **Sign up for Razorpay**: https://razorpay.com/
2. **Get your API Keys**:
   - Go to Settings → API Keys
   - Copy your `Key ID` and `Key Secret`
3. **Test Mode**: Use test keys for development
4. **Production**: Use live keys for production

### 3. Backend Configuration

Add these properties to your `application.properties`:

```properties
# Razorpay Configuration
razorpay.key.id=rzp_test_YOUR_KEY_ID
razorpay.key.secret=YOUR_KEY_SECRET
razorpay.currency=INR
```

### 4. Backend Dependencies

Add Razorpay SDK to your `pom.xml`:

```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

### 5. Sample Backend Payment Controller

```java
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest request) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount()); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            
            Order order = razorpayClient.orders.create(orderRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("razorpayKeyId", razorpayKeyId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerification verification) {
        try {
            // Verify signature
            String generatedSignature = HmacUtils.hmacSha256Hex(razorpayKeySecret, 
                verification.getOrderId() + "|" + verification.getPaymentId());
            
            if (generatedSignature.equals(verification.getSignature())) {
                // Payment verified successfully
                // Create booking in database
                Booking booking = bookingService.createBooking(
                    verification.getEventId(), 
                    verification.getClientRequirements(),
                    verification.getPaymentId()
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Payment verified and booking created",
                    "bookingId", booking.getId()
                ));
            } else {
                return ResponseEntity.badRequest().body("Invalid payment signature");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error verifying payment: " + e.getMessage());
        }
    }
}
```

## Frontend Usage

The payment integration is automatically triggered when a client books an event:

1. Client clicks "Book Event" button
2. Modal appears showing event details and payment amount
3. Client enters requirements (optional)
4. Client clicks "Proceed to Payment"
5. Razorpay payment modal opens
6. Client completes payment
7. System verifies payment and confirms booking
8. Success message is shown

## Payment Amount Calculation

The system calculates the booking amount as follows:

```typescript
Base Price: ₹5,000 (configurable per event)
Premium Events: Base Price × 1.5
GST (18%): Base Price × 0.18
Total Amount: Base Price + GST
```

You can customize this logic in `payment.service.ts` → `calculateBookingAmount()` method.

## Testing

### Test Card Details (Razorpay Test Mode)

- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Name**: Any name

### Test UPI
- **UPI ID**: success@razorpay

### Test Netbanking
- Select any bank and use "success" as the username

## Security Features

1. ✅ Server-side signature verification
2. ✅ Secure payment token handling
3. ✅ HTTPS required for production
4. ✅ No card details stored in application
5. ✅ PCI DSS compliant (via Razorpay)

## Error Handling

The system handles various scenarios:
- Payment cancellation by user
- Payment failure
- Network errors
- Verification failures
- Server errors

## Production Checklist

Before going live:

1. ✅ Replace test keys with live keys
2. ✅ Enable HTTPS on your domain
3. ✅ Complete KYC on Razorpay dashboard
4. ✅ Configure webhooks for payment notifications
5. ✅ Set up proper error logging
6. ✅ Test with small amounts first
7. ✅ Configure email notifications
8. ✅ Set up refund policy

## Support

For Razorpay integration issues:
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com/

## Notes

- Payment amounts are in **paise** (1 Rupee = 100 paise)
- Minimum transaction: ₹1 (100 paise)
- Maximum transaction: Check with Razorpay limits
- Currency: Currently set to INR only
- Test mode: No actual money is charged

## Future Enhancements

- [ ] Support for multiple payment gateways
- [ ] Payment history for clients
- [ ] Refund management
- [ ] Partial payments
- [ ] Recurring payments for subscriptions
- [ ] Promo codes and discounts
- [ ] Payment analytics dashboard
