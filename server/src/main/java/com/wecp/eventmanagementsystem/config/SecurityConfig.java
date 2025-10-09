package com.wecp.eventmanagementsystem.config;

import com.wecp.eventmanagementsystem.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService,
                          JwtRequestFilter jwtRequestFilter,
                          PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST, "/api/user/register").permitAll()
                .antMatchers(HttpMethod.POST, "/api/user/login").permitAll()
                .antMatchers(HttpMethod.GET, "/api/profile").authenticated()
                .antMatchers(HttpMethod.PUT, "/api/profile").authenticated()
                .antMatchers(HttpMethod.POST, "/api/planner/event").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/events").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.POST, "/api/planner/resource").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/resources").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.POST, "/api/planner/allocate-resources").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/staff").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.POST, "/api/planner/assign-staff").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/event-details/{eventId}").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/event-detail/{title}").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.DELETE, "/api/planner/event/{eventId}").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.POST, "/api/planner/send-message").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/messages/{eventId}").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/planner/bookings").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.PUT, "/api/planner/booking/{bookingId}/status").hasAuthority("PLANNER")
                .antMatchers(HttpMethod.GET, "/api/staff/event-details/{eventId}").hasAnyAuthority("STAFF", "PLANNER")
                .antMatchers(HttpMethod.GET, "/api/staff/allEvents").hasAuthority("STAFF")
                .antMatchers(HttpMethod.GET, "/api/staff/event-detailsbyTitle/{title}").hasAnyAuthority("STAFF", "PLANNER")
                .antMatchers(HttpMethod.POST, "/api/staff/send-message").hasAuthority("STAFF")
                .antMatchers(HttpMethod.GET, "/api/staff/messages/{eventId}").hasAuthority("STAFF")
                .antMatchers(HttpMethod.GET, "/api/client/booking-details/{eventId}").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/allEvents").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/event-detailsbyTitleforClient/{title}").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/my-bookings").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/my-booking/{bookingId}").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.POST, "/api/client/create-booking").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.POST, "/api/client/send-message").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/client/messages/{eventId}").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.POST, "/api/payment/create-order").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.POST, "/api/payment/verify").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/payment/status/**").hasAuthority("CLIENT")
                .antMatchers(HttpMethod.GET, "/api/payment/booking/**").hasAnyAuthority("CLIENT", "PLANNER")
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}