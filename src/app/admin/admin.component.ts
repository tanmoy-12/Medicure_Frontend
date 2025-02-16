import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor,NgIf } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
// hospital.model.ts
interface Hospital {
  hospitalName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactNumber: string;
  email: string;
  password?: string;
  website?: string;
  opd: {
    numberOfBeds: number;
  };
  ambulance: {
    numberOfAmbulances: number;
  };
  bloodBank: Array<{
    bloodType: string;
    numberOfBags: number;
  }>;
  emergencyServices: boolean;
  facilities: {
    icu: boolean;
    nicu: boolean;
    ambulance: boolean;
    pharmacy: boolean;
    cafeteria: boolean;
  };
  ratings?: number;
  reviews?: Array<{
    user: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FooterComponent,FormsModule, RouterLink, NgFor, NgIf, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  loggedIn = false;
  isAdmin = false;

  currentPage = 0;
  totalDoctors = 0;
  isLoading = false;
  unverifiedDoctors: any[] = [];

  //Get user email from localstorage
  email = localStorage.getItem('email');
  userName = localStorage.getItem('userName');

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  jsonData: string = '';
  hospitalForm!: FormGroup;
  editMode = false;
  hospitalId!: string;
  ngOnInit(): void {
    this.loadUnverifiedDoctors();
    this.initForm();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editMode = true;
        this.hospitalId = params['id'];
        this.loadHospitalDetails();
      }
    });
  }
  initForm() {
    this.hospitalForm = this.fb.group({
      hospitalName: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      contactNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      opd: this.fb.group({
        numberOfBeds: [0, Validators.required]
      }),
      ambulance: this.fb.group({
        numberOfAmbulances: [0, Validators.required]
      }),
      bloodBank: this.fb.array([]),
      emergencyServices: [false],
      facilities: this.fb.group({
        icu: [false],
        nicu: [false],
        ambulance: [false],
        pharmacy: [false],
        cafeteria: [false]
      })
    });
  }

  get bloodBankControls() {
    return this.hospitalForm.get('bloodBank') as FormArray;
  }

  addBloodBank() {
    this.bloodBankControls.push(this.fb.group({
      bloodType: ['', Validators.required],
      numberOfBags: [0, Validators.required]
    }));
  }

  removeBloodBank(index: number) {
    this.bloodBankControls.removeAt(index);
  }

  loadHospitalDetails() {
    this.authService.getHospitals().subscribe(hospitals => {
      const hospital = hospitals.find((h: any) => h._id === this.hospitalId); // Explicitly set the type of 'h' to 'any'
      if (hospital) {
        this.hospitalForm.patchValue(hospital);
        hospital.bloodBank.forEach((blood: { bloodType: any; numberOfBags: any; }) => {
          this.bloodBankControls.push(this.fb.group({
            bloodType: [blood.bloodType, Validators.required],
            numberOfBags: [blood.numberOfBags, Validators.required]
          }));
        });
      }
    });
  }


  onSubmit() {
    if (this.hospitalForm.invalid) {
      return;
    }

    const hospitalData: Hospital = this.hospitalForm.value;
    if (this.editMode) {
      this.authService.editHospital(this.hospitalId, hospitalData).subscribe(response => {
        this.router.navigate(['/hospitals']);
      });
    } else {
      this.authService.addHospital(hospitalData).subscribe(response => {
        this.router.navigate(['/hospitals']);
      });
    }
  }
  //Fetch Unverified Shop  Details
  loadUnverifiedDoctors() {
    this.isLoading = true;
    this.authService.fetchUnverifiedDoctors(this.currentPage).subscribe(
      (res) => {
        this.unverifiedDoctors = [...this.unverifiedDoctors, ...res.doctors];
        this.totalDoctors = res.totalDoctors;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  loadMore() {
    if (this.unverifiedDoctors.length < this.totalDoctors) {
      this.currentPage++;
      this.loadUnverifiedDoctors();
    }
  }
  verifyDetails(email: string){
    this.isLoading = true;
    this.authService.verifyDoctorDetails(email).subscribe(
      (res) => {
        this.notification.showNotification(`${res.msg}`,'success');  // Show success message
        window.location.reload();
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.notification.showNotification(`${err.error.msg}`,'error');
      }
    );
  }
  //Logout User
  logout() {
    const email = localStorage.getItem('email');
    if (email) {

      this.authService.logout(email).subscribe(
        (res) => {
          // Clear localStorage and update component state
          localStorage.clear();
          this.loggedIn = false;
          this.isAdmin = false;

          // Navigate back to the login page
          this.router.navigate(['/login']);
          this.notification.showNotification(`${res.msg}`,'success');  // Show success message
        },
        (err) => {
          this.notification.showNotification(`${err.error.msg}`,'error');
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
  uploadJsonData() {
    try {
      const parsedData = JSON.parse(this.jsonData);
      this.authService.addHospital(parsedData).subscribe(
        (response) => {
          console.log('Data uploaded successfully!', response);
          alert('Data uploaded successfully!');
        },
        (error) => {
          console.error('Error uploading data', error);
          alert('Failed to upload data. Please try again.');
        }
      );
    } catch (err) {
      console.error('Invalid JSON data', err);
      alert('Invalid JSON data. Please check your input.');
    }
  }
}
