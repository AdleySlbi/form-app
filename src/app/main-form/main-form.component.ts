import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class MainFormComponent implements OnInit {

  @ViewChild('picker', { static: false })
  private picker!: MatDatepicker<Date>;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: UntypedFormBuilder, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }



  public wekeep: any = null;

  ngOnInit(): void {

  }

  test() {
    console.log(this.personnalInformation.value)
  }

  // On Appartement, don't call the API WeKeep
  weKeepChange(status: boolean, stepper: MatStepper) {
    if (status == true) {
      stepper.next()
      stepper.next()
      stepper.next()
    } else {
      stepper.next()
    }
  }

  nextStep(stepper: MatStepper, step: String) {
        

    setTimeout(() => {
      stepper.next()
      if (step == "dwelling") {
      if (this.personnalInformation.value.dwellingType == 'appartement') {
        this.wekeep = false;
      }
    } else if (step == "situation") {
      if (this.personnalInformation.value.dwellingType == 'house' && this.personnalInformation.value.situationType == 'locataire') {
        this.wekeep = false;
      }
    }
    }, 1000);

  }



  // If houseInformation.livingType = house 
  // Check if we_keep == 0 
  public personnalInformation = new UntypedFormGroup({
    dwellingType: new UntypedFormControl('', Validators.required),
    situationType: new UntypedFormControl('', Validators.required),
    zipCode: new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    jobType: new UntypedFormControl('', [Validators.required]),
    streetAddress: new UntypedFormControl(null, Validators.required),
    streetNumber: new UntypedFormControl(null, Validators.required),
    cityName: new UntypedFormControl(null, Validators.required),
    firstName: new UntypedFormControl(null, Validators.required),
    secondName: new UntypedFormControl(null, Validators.required),
    birthYear: new FormControl(null, Validators.required),
    emailAddress: new UntypedFormControl(null, [Validators.required, Validators.email]),
    phoneNumber: new UntypedFormControl(null, Validators.required)
  })

  chosenYearHandler(ev: any, input: any) {
    console.log(this.personnalInformation.value.birthYear)
    let { _d } = ev._i.year;
    this.personnalInformation.value.birthYear = String(ev._i.year);
    // input._destroyPopup()
    console.log(this.personnalInformation.value.birthYear)
    this.picker.close()
  }

  finalSendToApi() {
    let formInfo = this.personnalInformation.value;

    if (this.personnalInformation.value.dwellingType == "house" && this.wekeep == true) {
      console.log("API1")

      let objectToSend = {
        "situationType": formInfo.situationType,
        "dwellingType": formInfo.dwellingType,
        "zipCode": formInfo.zipCode,
        "firstName": formInfo.firstName,
        "lastName": formInfo.lastName,
        "phoneNumber": formInfo.phoneNumber,
        "emailAddress": formInfo.email,
        "offer": "PV",
        // "date": ,
        // "token": "{lead_token}",
        // "origin": "{tf}",
        "chauffage": "",
        // "lander": "{lander}",
        "birth_year": formInfo.birthYear
      };

      console.log(objectToSend)
      // POST Request : https://script.google.com/macros/s/AKfycbzUoZGKsPk-crUwcMRniz-UnqbfJ9T5fMWUpW2Dl7F6W0ilDXAsAWpDCdG4daf5DxQguA/exec

    } else if (this.personnalInformation.value.dwellingType == "house" && this.wekeep == false) {
      console.log("API2")
      let objectToSend = {
        "originDomain": "panneau-solaire.affiliate.com",
        "leadBy": "jeremy",
        "offer": "SOLAR",
        "firstName": formInfo.firstName,
        "lastName": formInfo.lastName,
        "dwellingType": "Maison",
        "situationType": "Propriétaire",
        "jobType": formInfo.jobType,
        "birthYear": formInfo.birthYear,
        "emailAddress": formInfo.email,
        "phoneNumber": formInfo.phoneNumber,
        "streetAddress": formInfo.streetAddress,
        "zipCode": formInfo.zipCode,
        "cityName": formInfo.cityName,
        "propertyState": "",
        "revenueRange": "",
        "ip": "{ip_address}", // Todo
        "trafficSource": "{tf}", // Todo
        "subdomain": "solaire",
        "terms": "1",
        "bases": "1",
        "apidl": "1",
        "apilf": "1"
      };
      console.log(objectToSend);
    } else if (this.personnalInformation.value.dwellingType == "appartement") {
      console.log("API3");
      // A definir
    }
  }
}

