import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbOpService {

  constructor(private http: HttpClient) { }

  getWeKeep(dept: number): Observable<any>{
    console.log(dept)
    return this.http.get(`https://script.google.com/macros/s/AKfycbzo1GjM407_blAni_qYBuEFFhaWa3LevHk9jJ1M_Qkp9vlMZ6iWV7dMKcHSMJXDnH1e/exec?sq_dept=${dept}&sq_offer=PV`)
  }
}
