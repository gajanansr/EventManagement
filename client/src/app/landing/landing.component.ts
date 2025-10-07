import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {

  features = [
    {
      icon: 'calendar_today',
      title: 'Smart Scheduling',
      description: 'Intelligent calendar management with automated conflict resolution and smart reminders',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: 'groups',
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools for seamless coordination between planners, staff, and vendors',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: 'analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive insights and reporting to track attendance, engagement, and ROI',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: 'inventory_2',
      title: 'Resource Management',
      description: 'Efficiently manage venues, equipment, and resources with availability tracking',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: 'confirmation_number',
      title: 'Ticketing System',
      description: 'Built-in ticketing with QR codes, seat selection, and payment processing',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: 'phone_android',
      title: 'Mobile First',
      description: 'Fully responsive design optimized for all devices with native app experience',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    }
  ];

  steps = [
    {
      icon: 'person_add',
      title: 'Create Account',
      description: 'Sign up in seconds with your email or social accounts. No credit card required.'
    },
    {
      icon: 'event_note',
      title: 'Plan Your Event',
      description: 'Use our intuitive tools to create and customize your event with all the details.'
    },
    {
      icon: 'rocket_launch',
      title: 'Launch & Manage',
      description: 'Publish your event and manage everything in real-time from your dashboard.'
    }
  ];

  testimonials = [
    {
      text: 'This platform has completely transformed how we manage corporate events. The automation features save us hours every week!',
      name: 'Sarah Johnson',
      role: 'Event Director, TechCorp',
      avatar: 'SJ'
    },
    {
      text: 'The best event management tool we\'ve used. The analytics dashboard gives us insights we never had before.',
      name: 'Michael Chen',
      role: 'Marketing Manager, StartupX',
      avatar: 'MC'
    },
    {
      text: 'Intuitive, powerful, and reliable. Our team productivity increased by 40% since switching to this platform.',
      name: 'Emily Rodriguez',
      role: 'Operations Lead, EventPro',
      avatar: 'ER'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Smooth scroll behavior for internal links
    this.setupSmoothScroll();
  }

  setupSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLElement, e: Event) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/registration']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
