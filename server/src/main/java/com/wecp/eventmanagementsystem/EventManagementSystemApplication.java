package com.wecp.eventmanagementsystem;

import com.wecp.eventmanagementsystem.scheduler.EventStatusScheduler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EventManagementSystemApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(EventManagementSystemApplication.class, args);
		
		// Run initial check on startup
		EventStatusScheduler scheduler = context.getBean(EventStatusScheduler.class);
		scheduler.updatePastEventsOnStartup();
	}

}
