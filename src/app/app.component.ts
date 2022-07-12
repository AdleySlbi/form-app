import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare let fbq:Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'form-app';
  constructor(private router: Router){
    router.events.subscribe((y: NavigationEnd | any ) => {
      if(y instanceof NavigationEnd){
        fbq('track', 'PageView');
      }
    })
  }
}
