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
import { IpServiceService } from '../services/ip-service.service';
import { ActivatedRoute } from "@angular/router";

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
  public ipAddress: String | undefined;
  public clickId: String | undefined;
  public tf: String | undefined;
  public lander: String | undefined;

  @ViewChild('picker', { static: false })
  private picker!: MatDatepicker<Date>;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: UntypedFormBuilder, breakpointObserver: BreakpointObserver, private ip: IpServiceService, private route: ActivatedRoute) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.route.queryParams.subscribe(data => {
      this.clickId = data.clickId;
      this.tf = data.tf;
      this.lander = data.lander;
    })
  }

  public wekeep: any = null;

  ngOnInit(): void {
    this.getIP();
    this.getDate();
  }

  test() {
    console.log(this.personnalInformation)
    console.log(this.wekeep)
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getDate() {
    var date = new Date;
    console.log(date)
    console.log(date.getDate())
    console.log(date.getMonth())
    console.log(date.getFullYear())
    console.log(date.getMinutes())
    console.log(date.getHours())
    // var dateToPass 
  }

  // On Appartement, don't call the API WeKeep
  weKeepChange(status: boolean, stepper: MatStepper) {
    this.wekeep = status
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
    }, 200);

  }



  // If houseInformation.livingType = house 
  // Check if we_keep == 0 
  public personnalInformation = new UntypedFormGroup({
    dwellingType: new UntypedFormControl('', Validators.required),
    situationType: new UntypedFormControl('', Validators.required),
    zipCode: new UntypedFormControl('', [Validators.required, Validators.min(10000), Validators.maxLength(99999)]),
    jobType: new UntypedFormControl('', [Validators.required]),
    streetAddress: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
    // streetNumber: new UntypedFormControl(null, Validators.required),
    cityName: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    firstName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    secondName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    birthYear: new FormControl(null, [Validators.required, Validators.min(1900), Validators.max(2022)]),
    emailAddress: new UntypedFormControl(null, [Validators.required, Validators.email]),
    phoneNumber: new UntypedFormControl(null, [Validators.required, Validators.pattern('[- +()0-9]{10,}')])
  })

  chosenYearHandler(ev: any, input: any) {
    console.log(this.personnalInformation.value.birthYear)
    let { _d } = ev._i.year;
    this.personnalInformation.value.birthYear = String(ev._i.year);
    // input._destroyPopup()
    console.log(this.personnalInformation.value.birthYear)
    this.picker.close()
  }

  finalSendToApi(stepper: MatStepper) {
    let formInfo = this.personnalInformation.value;
    stepper.next()
    if (this.personnalInformation.value.dwellingType == 'house' && this.wekeep == true && this.personnalInformation.controls.secondName.status == 'VALID' && this.personnalInformation.controls.firstName.status == 'VALID' && this.personnalInformation.controls.emailAddress.status == 'VALID' && this.personnalInformation.controls.phoneNumber.status == 'VALID' && this.personnalInformation.controls.birthYear.status == 'VALID' ) {
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
        "origin": this.tf,
        "chauffage": "",
        "lander": this.lander,
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
        "ip": this.ipAddress, // Todo
        "trafficSource": this.tf, // Todo
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

