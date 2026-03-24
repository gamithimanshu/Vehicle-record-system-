import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  readonly contactItems = [
    {
      label: 'Email',
      value: 'hiamshugamit@gmail.com',
      href: 'mailto:hiamshugamit@gmail.com'
    },
    {
      label: 'Phone',
      value: '+91 98765 43210',
      href: 'tel:+919876543210'
    },
    {
      label: 'Office Hours',
      value: 'Monday to Saturday, 9:00 AM to 6:00 PM'
    },
    {
      label: 'Location',
      value: 'Kolkata, West Bengal, India'
    }
  ];
}
