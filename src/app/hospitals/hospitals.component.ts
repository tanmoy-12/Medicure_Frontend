import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-hospitals',
  imports: [NavbarComponent, FooterComponent, NgIf, NgFor],
  templateUrl: './hospitals.component.html',
  styleUrl: './hospitals.component.css'
})
export class HospitalsComponent {
  private authService = inject(AuthService);
  email = localStorage.getItem('email');
  private notification = inject(NotificationService)
  hospitals: any[] = [];
  ngOnInit() {
    this.authService.getHospitals().subscribe((res) => {
      console.log(res); // Check if it's an array or an object
      this.hospitals = Array.isArray(res) ? res : res.hospitals;
    });
  }

  bookBed(hospitalId: string) {
    if(this.email){
      this.authService.bookBed(hospitalId, this.email).subscribe(response => {
        alert('Bed booked successfully! Confirmation sent to your email.');
        this.ngOnInit();
      });
    }
  }
  bookAmbulance(){
    this.notification.showNotification('Ambulance Booked! Confirmation sent to your email', 'success');
  }
}
