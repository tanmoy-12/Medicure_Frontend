import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-appointment',
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export class AppointmentComponent {
  appointmentForm: FormGroup;
  private notification = inject(NotificationService)

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      area: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postCode: ['', Validators.required]
    });
  }

  bookAppointment() {
    if (this.appointmentForm.valid) {
      this.authService.bookEmergencyAppointment(this.appointmentForm.value)
        .subscribe(
          (response: any) => {
            this.notification.showNotification(response.message, 'success');
            this.appointmentForm.reset();
          },
          (error) => {
            this.notification.showNotification('Error booking appointment. Please try again.', 'error');
          }
        );
    } else {
      this.notification.showNotification('Please fill out all fields correctly.', 'error');
    }
  }
}
