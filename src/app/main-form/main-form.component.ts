import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DOCUMENT } from '@angular/common';
declare const google: any;

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class MainFormComponent implements OnInit {

  SearchPlacesForm: NgForm | undefined;
  public shippingAddress: Event | undefined;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, @Inject(DOCUMENT) private document: Document, private renderer2: Renderer2) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }



  public wekeep: any = null;

  ngOnInit(): void {
    this.loadAutoComplete();
  }

  test() {
    console.log(this.personnalInformation)
  }

  weKeepChange(status: boolean, stepper: MatStepper) {
    this.wekeep = status;
    // this.myStepper.next();
    stepper.next()
  }

  // If houseInformation.livingType = house 
  // Check if we_keep == 0 
  public personnalInformation = new FormGroup({
    dwellingType: new FormControl('', Validators.required),
    situationType: new FormControl('', Validators.required),
    zipCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    jobType: new FormControl('', [Validators.required]),
    streetAddress: new FormControl('', Validators.required),
    streetNumber: new FormControl('', Validators.required),
    cityName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    secondName: new FormControl('', Validators.required),
    birthYear: new FormControl('', Validators.required),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required)
  })

  finalSendToApi() {
    if (this.personnalInformation.value.livingType == "house" && this.wekeep == true) {
      console.log("API1")
    } else if (this.personnalInformation.value.livingType == "house" && this.wekeep == false) {
      console.log("API2")
    } else if (this.personnalInformation.value.livingType == "appartement") {
      console.log("API3")
    }
  }

    private loadAutoComplete() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB0rvm8RnIJfF64EAKJPk5D9KrYyt8rHsg&libraries=places&v=weekly';
    this.loadScript(url).then(() => this.initAutocomplete());
  }

    private loadScript(url: any) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.head, script);
    })
  }

    initAutocomplete() {
    const input = document.getElementById("txtSearchPlaces") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "icon",
      "name"
    ]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert('No details available for input:' + input.value);
        return;
      } else {
        return;
      }
    });
  }
}
