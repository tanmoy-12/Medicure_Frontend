import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-doctor-details',
  imports: [NavbarComponent, FooterComponent, NgIf],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private params = inject(ActivatedRoute);
  private notification = inject(NotificationService);
  doctorId: string | null = null;

  userId = localStorage.getItem('userId');
  doctor = {
    userName: '',
    email: '',
    password: '',
    userType: '',
    otp: '',
    doctorName: '',
    doctorRegistrationNumber: '',
    gender: '',
    details: '',
    specialization: '',
    experienceInYears: 0, // experience in years
    experience: [],
    qualification: [],
    clinicName: '',
    address: '',
    city: '',
    startingTime: '',
    endingTime: '',
    availableDays: [], // days of the week
    contactNumber: '',
    achievements: [],
    awards: [],
    memberships: [],
    researches: [], // Research & publications
    languages: [],
    description: '',
    image: '',
    _id: ''
  };


  ngOnInit(): void {
    this.doctorId = this.params.snapshot.paramMap.get('id');
    if (this.doctorId) {
      this.fetchDoctorDetails(this.doctorId);
    }
  }
  fetchDoctorDetails(doctorId: String){
    if(this.doctorId){
      this.authService.fetchDoctorDetailsById(this.doctorId).subscribe(
        doctor => {
          this.doctor = doctor;
        },
        error => {
          console.error(error);
        }
      )
    }
  }
  requestMeeting(doctorId: String){
    if(this.userId){
      this.authService.requestMeeting(doctorId, this.userId).subscribe(
        response => {
          this.notification.showNotification(response.message, 'success')
        },
        error => {
          console.error(error);
        }
      )
    }
  }
}
