import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-booking',
  imports: [NavbarComponent, FooterComponent, NgIf, NgFor],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  selectedFilters: Record<string, string | null> = {};

  doctors: any[] = [];
  doctorAppointment = {
    _id: '',
    doctorName: '',
    gender: '',
    specialization: '',
    slots:[
      { _id: '', time: '', occupied: false, patientName: '', patientMail: ''},
    ],
    email: '',
  };
  selectedSlotId: string | null = null;
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  cityChecked: boolean = false;
  specialityChecked: boolean = false;
  languageChecked: boolean = false;
  genderChecked: boolean = false;
  isappointmentCard: boolean = false;

  email = localStorage.getItem('email');
  userName = localStorage.getItem('userName');

  specialities = [
    { name: 'General Physician', value: 'general_physician' },
    { name: 'Cardiology', value: 'cardiology' },
    { name: 'Neurology', value: 'neurology' },
    { name: 'Gastroenterology', value: 'gastroenterology' },
    { name: 'Orthopedic', value: 'orthopedic' },
    { name: 'Oncology', value: 'oncology' },
    { name: 'Gynecology', value: 'gynecology' },
    { name: 'Dermatology', value: 'dermatology' },
    { name: 'Ophthalmology', value: 'ophthalmology' },
    { name: 'Pediatrics', value: 'pediatrics' },
    { name: 'Endocrinology', value: 'endocrinology' },
    { name: 'Urology', value: 'urology' },
    { name: 'Nephrology', value: 'nephrology' },
    { name: 'Pulmonology', value: 'pulmonology' },
    { name: 'Rheumatology', value: 'rheumatology' },
    { name: 'Neurosurgery', value: 'neurosurgery' },
    { name: 'Radiology', value: 'radiology' },
    { name: 'Plastic Surgery', value: 'plastic_surgery' },
    { name: 'Neonatology', value: 'neonatology' },
    { name: 'Vascular Surgery', value: 'vascular_surgery' },
    { name: 'Psychiatry', value: 'psychiatry' },
    { name: 'Dentistry', value: 'dentistry' },
    { name: 'ENT (Ear, Nose, Throat)', value: 'ent' }
];


  genders = [
    { name: 'Male' },
    { name: 'Female' }
  ]
  languages = [
    { name: 'English' },
    { name: 'Hindi' },
    { name: 'Tamil' },
    { name: 'Telugu' },
    { name: 'Marathi' },
    { name: 'Gujarati' },
    { name: 'Punjabi' },
    { name: 'Malayalam' },
    { name: 'Kannada' }
  ]
  city = [
    { name: 'Kolkata' },
    { name: 'Mumbai' },
    { name: 'Delhi' },
    { name: 'Chennai' },
    { name: 'Bangalore' },
    { name: 'Hyderabad' },
    { name: 'Pune' },
    { name: 'Mohali' },
    { name: 'Nagpur' },
    { name: 'Jaipur' },
    { name: 'Bhopal' },
    { name: 'Visakhapatnam' },
    { name: 'Vadodara' },
    { name: 'Surat' },
    { name: 'Ahmedabad' },
    { name: 'Rajkot' },
    { name: 'Lucknow' },
    { name: 'Kanpur' },
    { name: 'Nashik' },
    { name: 'Indore' },
    { name: 'Bhubaneswar' },
  ]

  ngOnInit(){
    this.fetchDoctors();
  }

  toggleCheck(check: boolean, currentState: 'cityChecked' | 'specialityChecked' | 'languageChecked' | 'genderChecked'): void{
    this[currentState] = !check;
  }

  fetchDoctors(): void {
    const filters = Object.keys(this.selectedFilters).reduce((acc: Record<string, string | null>, key) => {
      if (this.selectedFilters[key]) acc[key] = this.selectedFilters[key];
      return acc;
    }, {});


    this.authService.fetchFilteredDoctorDetails(filters)
      .subscribe({
        next: (response) => {
          this.doctors = response.doctors || [];
        },
        error: (error) => {
          console.error('Error fetching doctors:');
        }
      });
  }



  // Handle selection change
  updateFilter(type: string, value: string): void {
    this.selectedFilters[type] = value || null; // Allow clearing of filters
    this.fetchDoctors();
  }

  clearFilters(): void {
    this.selectedFilters = {}; // Reset filters to an empty object
    this.fetchDoctors();
  }
  getUpperCaseSpecialization(specialization: string): string {
    return specialization.toUpperCase();
  }

  bookAppointmentToggle(email:  string){
    this.isappointmentCard = !this.isappointmentCard;
    this.authService.findUnoccupiedSlots(email).subscribe(
      (res)=>{
        this.doctorAppointment = res|| [];
      }
    )
  }
  selectSlot(slotId: string) {
    this.selectedSlotId = this.selectedSlotId === slotId ? null : slotId;
  }

  bookAppointment(doctorId: string) {
    if (this.selectedSlotId && this.email && this.userName) {
      this.authService
        .bookAppointment(doctorId, this.selectedSlotId, this.email, this.userName)
        .subscribe(
          (res) => {
            this.selectedSlotId = null; // Reset selection after booking
            this.isappointmentCard = false; // Hide appointment card after booking
            this.notificationService.showNotification(`${res.message}`, 'success');
          },
          (error) => {
            this.notificationService.showNotification(`${error.error.message}`, 'error');
          }
        );
    }
  }

  isSlotDisabled(slotTime: string): boolean {
    //Extract start time from the slot
    const [startTime] = slotTime.split(' - ');
    const [time, meridian] = startTime.split(' '); // Split time and AM/PM
    const [hours, minutes] = time.split(':').map(Number);

    // Create a Date object for the slot's start time
    let slotDate = new Date();
    slotDate.setHours(
      meridian === 'PM' && hours !== 12 ? hours + 12 : hours === 12 ? 12 : hours,
      minutes,
      0,
      0
    );

    const now = new Date(); // Current time
    return slotDate < now; // Disable if slot start time is earlier than current time
  }
}
