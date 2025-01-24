import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";
import { RouterLink, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, RouterModule, FormsModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isLoggedIn = localStorage.getItem('token');
  showPopup: boolean = true;

  constructor(
    public router: Router,
  ){}
  currentIndex: number = 0;
  translateX: string = 'translateX(0px)';
  readonly slideWidth: number = 350; // Slide width matches `.slider-item` width in CSS.
  readonly totalSlides: number = 4; // Total number of slides.
  readonly visibleSlides: number = 3; // Number of slides visible at a time.

  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  isLoading: boolean = false;

  ngOnInit(){
    if(this.isLoggedIn){
      this.showPopup = false;
    }
  }
  nextSlide() {
    if (this.currentIndex < this.totalSlides - this.visibleSlides) {
      this.currentIndex++;
      this.updateTranslateX();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateTranslateX();
    }
  }

  private updateTranslateX() {
    const newTranslateValue = -(this.currentIndex * this.slideWidth);
    this.translateX = `translateX(${newTranslateValue}px)`;
  }

  sendMessage() {
    if (!this.name || !this.email || !this.message) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    this.authService
      .sendMessageForm(this.name, this.email, this.message)
      .subscribe(
        (response) => {
          this.notificationService.showNotification('Message sent successfully!', 'success');
          this.resetForm();
          this.isLoading = false;
        },
        (error) => {
          this.notificationService.showNotification('Failed to send the message. Please try again later.', 'error');
          this.isLoading = false;
        }
      );
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.message = '';
  }

  //To close popup
  closePopup(){
    this.showPopup = false;
  }
}
