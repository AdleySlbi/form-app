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
import { DbOpService } from '../services/db-op.service';
import { Router, NavigationEnd } from '@angular/router';
declare let fbq: Function;


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
  public wekeep: any = null;
  public leadDate: string = "";
  public tokenLead: string = "";
  public ipAddress: String | undefined;
  public clickId: String = "";
  public tf: String | undefined;
  public lander: String | undefined;
  public maxDate: Date = new Date;

  @ViewChild('picker', { static: false })
  private picker!: MatDatepicker<Date>;

  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    breakpointObserver: BreakpointObserver,
    private ip: IpServiceService,
    private route: ActivatedRoute,
    private dbOp: DbOpService,
    private router: Router,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.route.queryParams.subscribe(data => {
      this.clickId = data.clickid;
      this.tf = data.tf;
      this.lander = data.lander;
    })
  }


  ngOnInit(): void {
    this.getIP();
    this.getDate();
    this.getToken();
  }

  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  getDate() {
    var date = new Date;
    var monthToPass;
    if (date.getMonth() < 10) {
      monthToPass = `0${date.getMonth()}`
    } else {
      monthToPass = date.getMonth()
    }
    this.leadDate = `${date.getDate()}/${monthToPass}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  getToken() {
    var anysize = 20; //the size of string 
    var charset = "abcdefghijklmnopqrstuvwxyz"; //from where to create
    var result = "";
    for (var i = 0; i < anysize; i++)
      result += charset[Math.floor(Math.random() * charset.length)];
    // console.log(result);
    return this.tokenLead = result;
  }

  weKeepChange(status: number, stepper: MatStepper) {
    if (status == 1) {
      stepper.next()
      stepper.next()
      stepper.next()
    }
  }

  nextStep(stepper: MatStepper, step: String) {
    setTimeout(() => {
      stepper.next()
      if (step == "dwelling") {
        if (this.personnalInformation.value.dwellingType == 'appartement') {
          this.wekeep = 0;
        }
      } else if (step == "situation") {
        if (this.personnalInformation.value.dwellingType == 'house' && this.personnalInformation.value.situationType == 'locataire') {
          this.wekeep = 0;
        }
      }
    }, 50);

  }




  public personnalInformation = new UntypedFormGroup({
    dwellingType: new UntypedFormControl('', Validators.required),
    situationType: new UntypedFormControl('', Validators.required),
    zipCode: new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(5), Validators.maxLength(5)]),
    jobType: new UntypedFormControl('', [Validators.required]),
    streetAddress: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
    cityName: new UntypedFormControl('', [Validators.required, Validators.minLength(3)]),
    firstName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    secondName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
    birthYear: new FormControl(null, [Validators.required, Validators.min(1900), Validators.max(2022)]),
    emailAddress: new UntypedFormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    phoneNumber: new UntypedFormControl(null, [Validators.required, Validators.pattern('[- +()0-9]{10,}'), Validators.max(999999999)])
  })


  chosenYearHandler(ev: any, input: any) {
    let { _d } = ev._i.year;
    this.personnalInformation.value.birthYear = String(ev._i.year);
    this.picker.close()
  }

  finalSendToApi(stepper: MatStepper) {
    let formInfo = this.personnalInformation.value;
    stepper.next()

    if (formInfo.dwellingType == 'house' && formInfo.situationType == "proprietaire" && formInfo.zipCode != null) {
      this.dbOp.getWeKeep(formInfo.zipCode.slice(0, 2))
        .subscribe(data => {
          this.wekeep = data.we_keep;
          this.weKeepChange(data.we_keep, stepper)
        })
    }

    if (this.personnalInformation.value.dwellingType == 'house' && this.wekeep == 1 && this.personnalInformation.controls.secondName.status == 'VALID' && this.personnalInformation.controls.firstName.status == 'VALID' && this.personnalInformation.controls.emailAddress.status == 'VALID' && this.personnalInformation.controls.phoneNumber.status == 'VALID' && this.personnalInformation.controls.birthYear.status == 'VALID') {
      let objectToSend = {
        "situationType": formInfo.situationType,
        "dwellingType": formInfo.dwellingType,
        "zipCode": formInfo.zipCode,
        "firstName": formInfo.firstName,
        "lastName": formInfo.secondName,
        "phoneNumber": formInfo.phoneNumber,
        "emailAddress": formInfo.emailAddress,
        "offer": "PV",
        "date": this.leadDate,
        "token": this.tokenLead,
        "origin": this.tf,
        "chauffage": "",
        "lander": this.lander,
        "birth_year": formInfo.birthYear._i
      };
      
      this.dbOp.postApi1(objectToSend).subscribe(response => {
        // console.log(response)
      })

      this.dbOp.postCid(this.clickId).subscribe(response => {
        // console.log(response)
      });

      fbq('track', 'Lead', {
        content_name: '{_c_dt}',
        content_category: '{_c_node}',
        value: 28,
        currency: 'EUR'
      });
    } else if (this.personnalInformation.value.dwellingType == "house" && this.wekeep == 0 && this.personnalInformation.controls.zipCode.status == 'VALID' && this.personnalInformation.controls.jobType.status == 'VALID' && this.personnalInformation.controls.streetAddress.status == 'VALID' && this.personnalInformation.controls.cityName.status == 'VALID' && this.personnalInformation.controls.secondName.status == 'VALID' && this.personnalInformation.controls.firstName.status == 'VALID' && this.personnalInformation.controls.emailAddress.status == 'VALID' && this.personnalInformation.controls.phoneNumber.status == 'VALID' && this.personnalInformation.controls.birthYear.status == 'VALID') {
      // console.log("API2")
      let objectToSend = {
        "originDomain": "panneau-solaire.affiliate.com",
        "leadBy": "jeremy",
        "offer": "SOLAR",
        "firstName": formInfo.firstName,
        "lastName": formInfo.secondName,
        "dwellingType": "Maison",
        "situationType": "Propriétaire",
        "jobType": formInfo.jobType,
        "birthYear": formInfo.birthYear._i,
        "emailAddress": formInfo.emailAddress,
        "phoneNumber": formInfo.phoneNumber,
        "streetAddress": formInfo.streetAddress,
        "zipCode": formInfo.zipCode,
        "cityName": formInfo.cityName,
        "propertyState": "",
        "revenueRange": "",
        "ip": this.ipAddress,
        "trafficSource": this.tf,
        "subdomain": "solaire",
        "terms": "1",
        "bases": "1",
        "apidl": "1",
        "apilf": "1"
      };
      // console.log(objectToSend)
      this.dbOp.postApi2(objectToSend).subscribe(response => {
        // console.log(response)
      })
    } else if (this.personnalInformation.value.dwellingType == "appartement") {
      // console.log("API3");
      // A definir
    }
  }
}

