import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [
    RouterLink,
    FooterComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    FormsModule,
  ],
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
  userId = localStorage.getItem('userId');

  startingTime: string = '';
  endingTime: string = '';
  timeSlots: { time: string; available: boolean }[] = [];
  originalSlots: any[] = [];
  hasChanges = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  prescriptionForm: any;

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
      availableDays: this.fb.array([this.fb.control('', Validators.required)]),
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
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
    _id: '',
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
    todayNotAvailable: false,
    slots: [
      {
        time: '',
        available: true,
        patientName: '',
        patientMail: '',
        occupied: false,
      },
    ],
    availableDays: [],
    contactNumber: '',
    achievements: [],
    awards: [],
    memberships: [],
    researches: [],
    languages: [],
    isRegistered: false,
    isVerified: false,
  };
  appointments = [
    {
      time: '',
      available: true,
      patientName: '',
      patientMail: '',
      occupied: false,
    },
  ];
  meetings = [{ requestedAt: '', userName: '', email: '' }];
  showPrescriptionPopup = false;
  fetchMeetings() {
    if (this.userId) {
      this.authService.getMeetings(this.userId).subscribe(
        (response) => {
          this.meetings = response;
          console.log(this.meetings);
        },
        (error) => {
          console.error('Error fetching meetings:', error);
        }
      );
    }
  }
  generateTimeSlots() {
    if (!this.startingTime || !this.endingTime) {
      alert('Please select both starting and ending times');
      return;
    }

    const start = new Date(`1970-01-01T${this.startingTime}:00`);
    const end = new Date(`1970-01-01T${this.endingTime}:00`);
    this.timeSlots = [];

    while (start < end) {
      const slotStart = new Date(start);
      start.setMinutes(start.getMinutes() + 30);
      const slotEnd = new Date(start);

      this.timeSlots.push({
        time: `${slotStart.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${slotEnd.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        available: true,
      });
    }
  }

  saveSlots() {
    const data = { slots: this.timeSlots };
    console.log(data);
    if (this.email) {
      this.authService.assignTimeSlots(this.doctorDetails._id, data).subscribe(
        (response) => {
          alert('Slots saved successfully!');
        },
        (error) => {
          console.error('Error saving slots:', error);
        }
      );
    }
  }
  formatFieldName(field: string): string {
    // Split camelCase and capitalize each word
    return field
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
      .replace(/^[a-z]/, (char) => char.toUpperCase()); // Capitalize the first letter
  }

  ngOnInit(): void {
    if (this.email) {
      this.authService.doctorRegistered(this.email).subscribe((res) => {
        this.isRegistrationCommpleted = res.doctorRegistered;
      });
      if (this.isRegistrationCommpleted) {
        this.authService.fetchDoctorDetails(this.email).subscribe((res) => {
          this.doctorDetails = res.doctor;
          this.doctorForm.patchValue(this.doctorDetails);
          this.fetchAppointments(this.doctorDetails._id);
        });
      }
      if (!this.doctorDetails.todayNotAvailable) {
        this.originalSlots = JSON.parse(
          JSON.stringify(this.doctorDetails.slots)
        );
      }
    }
    this.fetchMeetings();
    this.initializeForm();
  }
  get formControls() {
    return this.doctorForm.controls;
  }
  onSlotChange(slot: any) {
    this.hasChanges = true; // Mark that changes have been made
  }
  initializeForm() {
    this.prescriptionForm = this.fb.group({
      patientName: ['', Validators.required],
      patientMail: ['', [Validators.required, Validators.email]],
      doctorName: ['', Validators.required],
      disease: ['', Validators.required],
      medicines: this.fb.array([this.createMedicineGroup()])
    });
  }
  get medicinesControls() {
    return (this.prescriptionForm.get('medicines') as FormArray).controls;
  }

  createMedicineGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required]
    });
  }

  addMedicine() {
    const medicines = this.prescriptionForm.get('medicines') as FormArray;
    medicines.push(this.createMedicineGroup());
  }

  removeMedicine(index: number) {
    const medicines = this.prescriptionForm.get('medicines') as FormArray;
    medicines.removeAt(index);
  }

  openPrescriptionPopup(appointment: any) {
    this.prescriptionForm.patchValue({
      patientName: appointment.patientName,
      patientMail: appointment.patientMail,
      doctorName: localStorage.getItem('userName') // Assuming doctor's name is stored in local storage
    });
    this.showPrescriptionPopup = true;
  }

  closePrescriptionPopup() {
    this.showPrescriptionPopup = false;
  }

  onSubmitPrescription() {
    if (this.prescriptionForm.invalid) {
      return;
    }
    console.log(this.prescriptionForm.value)
    const prescriptionData = this.prescriptionForm.value;
    this.authService.generatePrescription(prescriptionData).subscribe(
      response => {
        console.log('Prescription generated successfully:', response);
        this.closePrescriptionPopup();
      },
      error => {
        console.error('Error generating prescription:', error);
      }
    );
  }
  saveEdits() {
    const editedSlots = this.doctorDetails.slots.map((slot: any) => {
      if (!slot.available && slot.patientMail) {
        slot.patientName = null;
        slot.patientMail = null;
      }
      return slot;
    });

    this.authService.updateSlots(this.doctorDetails._id, editedSlots).subscribe(
      (response) => {
        this.notification.showNotification(
          'Slots updated successfully!',
          'success'
        );
        this.hasChanges = false;
        this.originalSlots = JSON.parse(
          JSON.stringify(this.doctorDetails.slots)
        );
      },
      (error) => {
        console.error('Error updating slots:', error);
      }
    );
  }

  discardEdits() {
    this.doctorDetails.slots = JSON.parse(JSON.stringify(this.originalSlots));
    this.hasChanges = false;
    window.location.reload();
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
  fetchAppointments(doctorId: string): void {
    this.authService.findAppointments(doctorId).subscribe(
      (response) => {
        console.log(response.appointments);
        this.appointments = response.appointments;
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  onSubmit(): void {
    if (this.doctorForm.valid && this.email) {
      this.isSubmitting = true;

      const formData = { ...this.doctorForm.value, email: this.email };

      // Ensure all required keys are present
      const requiredKeys = [
        'doctorName',
        'doctorRegistrationNumber',
        'gender',
        'details',
        'specialization',
        'experienceInYears',
        'experience',
        'qualification',
        'clinicName',
        'address',
        'city',
        'availableDays',
        'contactNumber',
        'achievements',
        'awards',
        'memberships',
        'researches',
        'languages',
        'isVerified',
        'isRegistered',
        'email',
      ];

      const missingKeys = requiredKeys.filter((key) => !(key in formData));
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
          window.location.reload();
          this.notification.showNotification(
            'Doctor details updated successfully!',
            'success'
          );
        },
        error: (err) => {
          this.isSubmitting = false;
          this.notification.showNotification(
            err.error.message || 'Failed to update doctor details.',
            'error'
          );
        },
      });
    } else {
      // Highlight invalid fields
      Object.keys(this.doctorForm.controls).forEach((field) => {
        const control = this.doctorForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });

      this.notification.showNotification(
        'Please fill out all required fields.',
        'error'
      );
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
  scheduleMeeting(email: string) {
    if(this.userId){
      this.authService.scheduleMeeting(this.userId, email, 'accept').subscribe(
        (res) => {
          this.notification.showNotification(
            'Meeting scheduled successfully!',
           'success'
          );
        },
        (error) => {
          console.error('Error scheduling meeting:', error);
          this.notification.showNotification(
            'Failed to schedule meeting. Please try again later.',
            'error'
          );
        }
      );
      this.fetchMeetings();
    }
  }

  cancelMeeting(email: string){
    if(this.userId){
      this.authService.scheduleMeeting(this.userId, email, 'reject').subscribe(
        (res) => {
          this.notification.showNotification(
            'Meeting cancelled successfully!',
           'success'
          );
        },
        (error) => {
          console.error('Error cancelling meeting:', error);
          this.notification.showNotification(
            'Failed to cancel meeting. Please try again later.',
            'error'
          );
        }
      );
      this.fetchMeetings();
    }
  }
}
