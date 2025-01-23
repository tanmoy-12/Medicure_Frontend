import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from "../footer/footer.component";
import { RouterLink, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    public router: Router,
  ){}
  currentIndex: number = 0;
  translateX: string = 'translateX(0px)';
  readonly slideWidth: number = 350; // Slide width matches `.slider-item` width in CSS.
  readonly totalSlides: number = 4; // Total number of slides.
  readonly visibleSlides: number = 3; // Number of slides visible at a time.

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

}
