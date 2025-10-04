package com.wecp.eventmanagementsystem.service;


import com.wecp.eventmanagementsystem.dto.ProfileUpdateRequest;
import com.wecp.eventmanagementsystem.dto.UserProfileResponse;
import com.wecp.eventmanagementsystem.entity.User;
import com.wecp.eventmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    public User getUserByUsername(String username){
        return userRepository.findByUsername(username);
    }
    
    public UserProfileResponse getUserProfile(String username) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByUsername(username));
        User user = userOpt.orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        
        return new UserProfileResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.getFullName(),
                user.getAddress()
        );
    }
    
    public UserProfileResponse updateUserProfile(String username, ProfileUpdateRequest request) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByUsername(username));
        User user = userOpt.orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        
        // Update basic info
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        // Update password if provided and current password is correct
        if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                throw new IllegalArgumentException("Current password is required to change password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }
        
        User updatedUser = userRepository.save(user);
        
        return new UserProfileResponse(
                updatedUser.getUserId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.getPhoneNumber(),
                updatedUser.getFullName(),
                updatedUser.getAddress()
        );
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("User not found" +username);
        }
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            new ArrayList<>()
        );
    }
}
