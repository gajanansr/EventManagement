import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface Particle {
  x: number;
  y: number;
  delay: number;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  particles: Particle[] = [];
  
  private countdownInterval: any;
  private targetDate: Date;

  features = [
    {
      icon: '🎯',
      title: 'Smart Planning',
      description: 'AI-powered event planning that adapts to your needs and preferences'
    },
    {
      icon: '👥',
      title: 'Team Collaboration',
      description: 'Seamless coordination between planners, staff, and clients in real-time'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Deep insights and metrics to track your event success and performance'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols to protect your data'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Manage events on the go with our fully responsive mobile experience'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance for instant response times and smooth operations'
    }
  ];

  stats = [
    { value: '10,000+', label: 'Events Managed' },
    { value: '5,000+', label: 'Happy Clients' },
    { value: '50+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' }
  ];

  constructor(private router: Router) {
    // Set target date to 30 days from now (you can adjust this)
    this.targetDate = new Date();
    this.targetDate.setDate(this.targetDate.getDate() + 30);
  }

  ngOnInit(): void {
    this.generateParticles();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  generateParticles(): void {
    this.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
  }

  startCountdown(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;


    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }


  navigateToRegister(): void {
    this.router.navigate(['/registration']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
