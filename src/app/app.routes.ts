import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { DoctorComponent } from './doctor/doctor.component';
import { BookingComponent } from './booking/booking.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { CommunityComponent } from './community/community.component';
import { HospitalsComponent } from './hospitals/hospitals.component';

import { Routes, CanActivate } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'
import { OpenGuard } from './guards/open.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  // Add more routes as needed
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard]},
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  { path: 'user', component: UserComponent, canActivate: [OpenGuard] },  // Change to UserComponent when user authentication is implemented
  { path: 'doctor', component: DoctorComponent, canActivate: [OpenGuard]},
  { path: 'appointment', component:AppointmentComponent },
  { path: 'booking', component: BookingComponent, canActivate: [OpenGuard]},
  { path: 'doctor-details/:id', component: DoctorDetailsComponent },
  { path: 'community', component: CommunityComponent },
  { path: 'hospitals', component: HospitalsComponent },
  // Add more routes as needed
];
