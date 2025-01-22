import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor,NgIf } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FooterComponent,FormsModule, RouterLink, NgFor, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  loggedIn = false;
  isAdmin = false;

  currentPage = 0;
  totalShops = 0;
  isLoading = false;
  unverifiedShops: any[] = [];

  //Get user email from localstorage
  email = localStorage.getItem('email');
  userName = localStorage.getItem('userName');

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);


  ngOnInit(): void {
    this.loadUnverifiedShops();
  }
  //Fetch Unverified Shop  Details
  loadUnverifiedShops() {
    this.isLoading = true;
    this.authService.fetchUnverifiedDoctors(this.currentPage).subscribe(
      (res) => {
        this.unverifiedShops = [...this.unverifiedShops, ...res.shops];
        this.totalShops = res.total;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  loadMore() {
    if (this.unverifiedShops.length < this.totalShops) {
      this.currentPage++;
      this.loadUnverifiedShops();
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
}
