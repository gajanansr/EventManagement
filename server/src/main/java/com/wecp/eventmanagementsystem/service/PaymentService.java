package com.wecp.eventmanagementsystem.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.wecp.eventmanagementsystem.dto.PaymentOrderRequest;
import com.wecp.eventmanagementsystem.dto.PaymentOrderResponse;
import com.wecp.eventmanagementsystem.dto.PaymentVerificationRequest;
import com.wecp.eventmanagementsystem.entity.Booking;
import com.wecp.eventmanagementsystem.entity.Event;
import com.wecp.eventmanagementsystem.entity.Payment;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.repository.BookingRepository;
import com.wecp.eventmanagementsystem.repository.EventRepository;
import com.wecp.eventmanagementsystem.repository.PaymentRepository;
import com.wecp.eventmanagementsystem.repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SignatureException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    @Value("${razorpay.currency}")
    private String currency;
    
    /**
     * Create a Razorpay order for payment
     */
    @Transactional
    public PaymentOrderResponse createOrder(PaymentOrderRequest request) throws Exception {
        try {
            // Initialize Razorpay client
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount()); // amount in paise
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1); // Auto capture payment
            
            // Create order in Razorpay
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            
            // Create payment record in database
            Payment payment = new Payment();
            payment.setRazorpayOrderId(razorpayOrder.get("id"));
            payment.setAmount(request.getAmount());
            payment.setCurrency(currency);
            payment.setStatus("CREATED");
            payment.setReceipt(orderRequest.getString("receipt"));
            
            paymentRepository.save(payment);
            
            // Return response
            return new PaymentOrderResponse(
                razorpayOrder.get("id"),
                request.getAmount(),
                currency,
                razorpayKeyId
            );
            
        } catch (RazorpayException e) {
            throw new Exception("Error creating Razorpay order: " + e.getMessage());
        }
    }
    
    /**
     * Verify payment signature and create booking
     */
    @Transactional
    public Map<String, Object> verifyPaymentAndCreateBooking(PaymentVerificationRequest request) throws Exception {
        try {
            // Verify signature
            if (!verifySignature(request.getOrderId(), request.getPaymentId(), request.getSignature())) {
                throw new Exception("Invalid payment signature");
            }
            
            // Get payment record
            Payment payment = paymentRepository.findByRazorpayOrderId(request.getOrderId())
                .orElseThrow(() -> new Exception("Payment record not found"));
            
            // Update payment record
            payment.setRazorpayPaymentId(request.getPaymentId());
            payment.setRazorpaySignature(request.getSignature());
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);
            
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User client = userRepository.findByUsername(username);
            if (client == null) {
                throw new Exception("User not found");
            }
            
            // Get event
            Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new Exception("Event not found"));
            
            // Create booking
            Booking booking = new Booking();
            booking.setClient(client);
            booking.setEvent(event);
            booking.setBookingDate(new Date());
            booking.setStatus("CONFIRMED");
            booking.setClientRequirements(request.getClientRequirements());
            booking.setNotes("Payment ID: " + request.getPaymentId());
            
            booking = bookingRepository.save(booking);
            
            // Link payment to booking
            payment.setBooking(booking);
            paymentRepository.save(payment);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment verified and booking created successfully");
            response.put("bookingId", booking.getBookingId());
            response.put("paymentId", payment.getPaymentId());
            response.put("status", "SUCCESS");
            
            return response;
            
        } catch (Exception e) {
            // Update payment status to failed
            paymentRepository.findByRazorpayOrderId(request.getOrderId())
                .ifPresent(payment -> {
                    payment.setStatus("FAILED");
                    paymentRepository.save(payment);
                });
            throw e;
        }
    }
    
    /**
     * Verify Razorpay payment signature
     */
    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            String generatedSignature = calculateHmacSHA256(payload, razorpayKeySecret);
            return generatedSignature.equals(signature);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Calculate HMAC SHA256 signature
     */
    private String calculateHmacSHA256(String data, String key) throws SignatureException {
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(data.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : rawHmac) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new SignatureException("Failed to generate HMAC : " + e.getMessage());
        }
    }
    
    /**
     * Get payment status by payment ID
     */
    public Payment getPaymentStatus(String paymentId) throws Exception {
        return paymentRepository.findByRazorpayPaymentId(paymentId)
            .orElseThrow(() -> new Exception("Payment not found"));
    }
    
    /**
     * Get payment by booking ID
     */
    public Payment getPaymentByBookingId(Long bookingId) throws Exception {
        return paymentRepository.findByBooking_BookingId(bookingId)
            .orElseThrow(() -> new Exception("Payment not found for this booking"));
    }
}
