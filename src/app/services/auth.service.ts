import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //private apiUrl = 'http://localhost:3000/medicure/routes';
  private apiUrl = 'https://shared-server-cxer.onrender.com/medicure/routes';
  constructor(private http: HttpClient) {}

  // Send contact form
  sendMessageForm(name: String, email: String, message: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact-form`, { name, email, message });
  }
  //Book Emergency Appointment
  bookEmergencyAppointment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/book-emergency-appointment`, data);
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
  //Fetch Appointments by patient email
  getUserAppointments(userEmail: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user-appointments`, { userEmail });
  }
  //Cancel Appointment
  cancelAppointment(doctorId: String, slotId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cancel-appointment`, { doctorId, slotId });
  }
  //Find doctor details using doctor id
  fetchDoctorDetailsById(Id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctor-details`, { Id });
  }
  //Create New Post
  createPost(userId: string, content: string, userType: String, email: String, userName: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-post`, { userId, content, userType, email, userName });
  }
  //Fetch All posts
  fetchPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fetch-posts`);
  }
  //Like posts
  likePost(postId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/like-post`, { postId, userId });
  }
  //Comment Any Post
  commentPost( postId: String, comment: String, userId: String, userType: String, email: String, parentCommentId: String ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comment-post`, { postId, comment, userId, userType, email, parentCommentId });
  }
  //Like Comment
  likeComment(commentId: string, userId: string): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/like-comment`, { commentId, userId })
  }
  // Delete Post
  deletePost(postId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-post/${postId}`);
  }
  // Delete Comment
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-comment/${commentId}`);
  }
  calculateBmi(weight: number, height: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bmicalculator`, { weight, height });
  }
  requestMeeting(doctorId: String, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-meeting`, { doctorId, userId });
  }
  getMeetings(doctorId: String): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/fetch-meeting-requests`, { doctorId });
  }
  scheduleMeeting(doctorId: String, email: string, decission: string): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/accept-reject-meeting-request`, { doctorId, email, decission });
  }
  //Add new hospital
  addHospital(hospital: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-hospital`, hospital);
  }

  editHospital(id: string, hospital: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit-hospital/${id}`, hospital);
  }

  getHospitals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hospitals`);
  }
  bookBed(Id: string, email: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/book-bed`, { Id, email });
  }
  generatePrescription(prescriptionData: String): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-prescription`, prescriptionData );
  }

}

