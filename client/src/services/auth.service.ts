import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loginUrl = `${environment.apiUrl}`;
  getLoginStatus: any;
  // getRole!:string | null;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) { }

  login(user: Partial<any>): Observable<{ [key: string]: string }> {//Not sure if it should be Partial<any>
    return this.http.post<{ token: string }>(
      `${this.loginUrl}/api/user/login`,
      user,
      this.httpOptions
    );
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getRole() {
    return localStorage.getItem("role");
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('doctor_id');
    localStorage.removeItem('patient_id');
  }

  createUser(user: any): Observable<any> {//Not sure if it should be user: any
    return this.http.post<any>(`${this.loginUrl}/api/user/register`, user);//Not sure if it should be post<any>
  }
}