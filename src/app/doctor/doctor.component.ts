import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [RouterLink, FooterComponent, NgIf, FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css',
})
export class DoctorComponent {
  loggedIn = false;
  isSeller = false;
  isRegistrationCommpleted = true;

  doctorForm!: FormGroup;
  isSubmitting = false;

  //Get user email from localstorage
  email = localStorage.getItem('email');
  userName = localStorage.getItem('userName');

  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  constructor(private fb: FormBuilder) {
    this.doctorForm = this.fb.group({
      doctorName: ['', Validators.required],
      doctorRegistrationNumber: ['', Validators.required],
      gender: ['', Validators.required],
      details: ['', Validators.required],
      specialization: ['', Validators.required],
      experienceInYears: [null, [Validators.required, Validators.min(0)]],
      experience: this.fb.array([this.fb.control('', Validators.required)]),
      qualification: this.fb.array([this.fb.control('', Validators.required)]),
      clinicName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      availableMorningStartingTime: ['', Validators.required],
      availableMorningEndingTime: ['', Validators.required],
      availableAfternoonStartingTime: ['', Validators.required],
      availableAfternoonEndingTime: ['', Validators.required],
      availableEveningStartingTime: ['', Validators.required],
      availableEveningEndingTime: ['', Validators.required],
      availableDays: this.fb.array([this.fb.control('', Validators.required)]),
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      achievements: this.fb.array([this.fb.control('', Validators.required)]),
      awards: this.fb.array([this.fb.control('', Validators.required)]),
      memberships: this.fb.array([this.fb.control('', Validators.required)]),
      researches: this.fb.array([this.fb.control('', Validators.required)]),
      languages: this.fb.array([this.fb.control('', Validators.required)]),
      isRegistered: [true],
      isVerified: [false],
    });
  }

  doctorDetails = {
    email: '',
    doctorName: '',
    doctorRegistrationNumber: '',
    gender: '',
    details: '',
    specialization: '',
    experienceInYears: null,
    experience: [],
    qualification: [],
    clinicName: '',
    address: '',
    city: '',
    availableMorningStartingTime: '',
    availableMorningEndingTime: '',
    availableAfternoonStartingTime: '',
    availableAfternoonEndingTime: '',
    availableEveningStartingTime: '',
    availableEveningEndingTime: '',
    availableDays: [],
    contactNumber: '',
    achievements: [],
    awards: [],
    memberships: [],
    researches: [],
    languages: [],
    isRegistered: false,
    isVerified: false,
  }
  formatFieldName(field: string): string {
    // Split camelCase and capitalize each word
    return field
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
      .replace(/^[a-z]/, (char) => char.toUpperCase()); // Capitalize the first letter
  }

  ngOnInit(): void{
    if(this.email){
      this.authService.doctorRegistered(this.email).subscribe(
        (res) => {
          this.isRegistrationCommpleted = res.doctorRegistered;
        }
      )
      if(this.isRegistrationCommpleted){
        this.authService.fetchDoctorDetails(this.email).subscribe(
          (res) => {
            this.doctorDetails = res.doctor;
            this.doctorForm.patchValue(this.doctorDetails);
            console.log(this.doctorDetails);
          }
        )
      }
    }
  }
  get formControls() {
    return this.doctorForm.controls;
  }

  getFormArray(field: string): FormArray {
    return this.doctorForm.get(field) as FormArray;
  }

  addField(field: string): void {
    const formArray = this.getFormArray(field);
    if (formArray.at(formArray.length - 1)?.value) {
      formArray.push(this.fb.control('', Validators.required));
    }
  }

  removeField(field: string, index: number): void {
    const formArray = this.getFormArray(field);
    formArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.doctorForm.valid && this.email) {
      this.isSubmitting = true;

      const formData = { ...this.doctorForm.value, email: this.email };

      // Ensure all required keys are present
      const requiredKeys = [
        'doctorName', 'doctorRegistrationNumber', 'gender', 'details',
        'specialization', 'experienceInYears', 'experience', 'qualification',
        'clinicName', 'address', 'city', 'availableMorningStartingTime',
        'availableMorningEndingTime', 'availableAfternoonStartingTime',
        'availableAfternoonEndingTime', 'availableEveningStartingTime',
        'availableEveningEndingTime', 'availableDays', 'contactNumber',
        'achievements', 'awards', 'memberships', 'researches', 'languages',
        'isVerified', 'isRegistered', 'email'
      ];

      const missingKeys = requiredKeys.filter(key => !(key in formData));
      if (missingKeys.length > 0) {
        this.isSubmitting = false;
        this.notification.showNotification(
          `Missing fields: ${missingKeys.join(', ')}`,
          'error'
        );
        return;
      }

      // Submit data
      this.authService.addDoctorDetails(formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.router.navigate(['/doctor']);
          this.notification.showNotification('Doctor details updated successfully!', 'success');
        },
        error: (err) => {
          this.isSubmitting = false;
          this.notification.showNotification(err.error.message || 'Failed to update doctor details.', 'error');
        },
      });
    } else {
      // Highlight invalid fields
      Object.keys(this.doctorForm.controls).forEach(field => {
        const control = this.doctorForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });

      this.notification.showNotification('Please fill out all required fields.', 'error');
    }
  }



  logout() {
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.logout(email).subscribe(
        (res) => {
          // Clear localStorage and update component state
          localStorage.clear();
          this.loggedIn = false;
          this.isSeller = false;

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
