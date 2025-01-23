import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // private apiUrl = 'http://localhost:3000/medicure/routes';
  private apiUrl = 'https://shared-server-cxer.onrender.com/medicure/routes';
  constructor(private http: HttpClient) {}
  // Send contact form
  sendContactForm(formValues: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact-form`, formValues);
  }
  // Signup form
  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, data);
  }
  // Login form
  login(data: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, data);
  }
  verifyLoginOtp(data: any) {
    return this.http.post<any>(`${this.apiUrl}/verify-login-otp`, data);
  }
  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, data);
  }
  logout(email: string) {
    return this.http.post<any>(`${this.apiUrl}/logout`, { email });
  }
  // Forgot password - Step 1: Send OTP
  sendOtp(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }
  // Forgot password - Step 2: Verify OTP
  verifyForgotPasswordOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-forgotp-otp`, { email, otp });
  }
  // Forgot password - Step 3: Reset Password
  resetPassword(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, { email, password });
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists in localStorage
  }
  getUserName(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/getUserName`, { email });
  }
  // Verify Secret Key
  verifySecretKey(secretKey: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verifySecretKey`, { secretKey });
  }
  //Check User Type
  userType(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user-type`, { email });
  }
  //Generate Chatbot response
  generateResponse(prompt: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatbot`, { prompt });
  }
  //Fetch Shops which are not verified
  fetchUnverifiedDoctors(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch-unverified-doctors?page=${page}`);
  }
  //Verify Shop Details
  verifyDoctorDetails(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-doctor`, { email });
  }
  //Add new Doctor Details
  addDoctorDetails(doctorDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-doctor`, doctorDetails);
  }
  //To check if the doctor is already registered
  doctorRegistered(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor-registered`, { email });
  }
  //Fetch Doctor Details by email
  fetchDoctorDetails(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fetch-doctor-details`, { email });
  }
  //Fetch Doctor details by filtering specialization, city, language & gender
  fetchFilteredDoctorDetails(filters: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/fetch-filtered-doctor-details`, filters); // Send filters directly
  }
  //Assign Time Slots
  assignTimeSlots(doctorId: string, slots: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save-time-slots`, { doctorId, slots });
  }
  //Edit Time Slots
  updateSlots(doctorId: string, slots: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-slots`, { doctorId, slots });
  }
  //Find UnOccupied Slots
  findUnoccupiedSlots(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/find-doctor-with-unoccupied-slots`, { email });
  }
  //Book Appointment
  bookAppointment(doctorId: String, slotId: String, email: String, userName: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/book-appointment`, { doctorId, slotId, email, userName });
  }
  //Find appointments
  findAppointments(doctorId: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/find-appointments`, { doctorId });
  }
}

