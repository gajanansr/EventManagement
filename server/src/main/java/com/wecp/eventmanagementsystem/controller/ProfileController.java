package com.wecp.eventmanagementsystem.controller;

import com.wecp.eventmanagementsystem.dto.ProfileUpdateRequest;
import com.wecp.eventmanagementsystem.dto.UserProfileResponse;
import com.wecp.eventmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        UserProfileResponse profile = userService.getUserProfile(username);
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            UserProfileResponse updatedProfile = userService.updateUserProfile(username, request);
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
