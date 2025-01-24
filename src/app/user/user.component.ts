import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterLink,
    FooterComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  userName = localStorage.getItem('userName');
  email = localStorage.getItem('email');

  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  loggedIn = false;
  appointments: any[] = [];

  ngOnInit(): void {
    this.fetchAppointments();
  }

  fetchAppointments() {
    if (this.email) {
      this.authService.getUserAppointments(this.email).subscribe(
        (response) => {
          this.appointments = response;
        },
        (error) => {
          this.notification.showNotification(`${error}`, 'error'); // Show error message
        }
      );
    }
  }
  getUpperCaseSpecialization(specialization: string): string {
    return specialization.toUpperCase();
  }

  cancelAppointment(doctorId: String, slotId: string){
    this.authService.cancelAppointment(doctorId, slotId).subscribe(
      (res) => {
        this.notification.showNotification(`${res.message}`,'success'); // Show success message
        this.fetchAppointments();
      },
      (err) => {
        this.notification.showNotification(`${err.error.message}`, 'error'); // Show error message
      }
    )
  }

  logout() {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.logout(email).subscribe(
        (res) => {
          // Clear localStorage and update component state
          localStorage.clear();
          this.loggedIn = false;
          // Navigate back to the login page
          this.router.navigate(['/login']);
          this.notification.showNotification(`${res.msg}`, 'success'); // Show success message
        },
        (err) => {
          this.notification.showNotification(`${err.error.msg}`, 'error');
        }
      );
    }
  }
  goToSection(section: string) {
    // Navigate to the home component and scroll to the #about section
    this.router.navigate([''], { fragment: `${section}` });
    if (this.router.url === '/') {
      const gallerySection = document.getElementById(section);
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        const gallerySection = document.getElementById(section);
        if (gallerySection) {
          gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }
}
