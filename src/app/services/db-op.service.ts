import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbOpService {

  constructor(private http: HttpClient) { }

  getWeKeep(dept: number): Observable<any> {
    return this.http.get(`https://script.google.com/macros/s/AKfycbzo1GjM407_blAni_qYBuEFFhaWa3LevHk9jJ1M_Qkp9vlMZ6iWV7dMKcHSMJXDnH1e/exec?sq_dept=${dept}&sq_offer=PV`)
  }

  postApi1(data: any): Observable<any> {
    return this.http.post(`https://script.google.com/macros/s/AKfycbzUoZGKsPk-crUwcMRniz-UnqbfJ9T5fMWUpW2Dl7F6W0ilDXAsAWpDCdG4daf5DxQguA/exec`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
    )
  }

  postCid(cid: String): Observable<any> {
    return this.http.post(`https://limsorts-oscularly.icu/postback?cid=${cid}&payout=27`, null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  postApi2(data: any): Observable<any> {
    console.log(data)
    return this.http.post(`https://ios14club.herokuapp.com/offers/1/webhook`, data, { headers: {
        // "Content-Type": "text/html; charset=UTF-8",
        // "Content-Type": "text/plain",
        "Content-Type": "application/json"
        // "Content-Type": "application/x-www-form-urlencoded",
        // "Content-Type": "multipart/form-data",
      },
    })
  }


}
