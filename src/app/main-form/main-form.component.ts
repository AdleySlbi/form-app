import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
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
    console.log(this.personnalInformation)
  }

  // appNoKeep(){
  //   if(this.personnalInformation.value.dwellingType == "Appartement"){
  //   this.wekeep = false

  //   }
  // }  

  // On Appartement, don't call the API WeKeep
  weKeepChange(status: boolean, stepper: MatStepper) {
    // this.wekeep = status;
    // this.myStepper.next();
    if (status == true) {
      stepper.next()
      stepper.next()
    } else {
      stepper.next()
    }

    // stepper.next()

  }

  // If houseInformation.livingType = house 
  // Check if we_keep == 0 
  public personnalInformation = new UntypedFormGroup({
    dwellingType: new UntypedFormControl('', Validators.required),
    situationType: new UntypedFormControl('', Validators.required),
    zipCode: new UntypedFormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    jobType: new UntypedFormControl('', [Validators.required]),
    streetAddress: new UntypedFormControl('', Validators.required),
    streetNumber: new UntypedFormControl('', Validators.required),
    cityName: new UntypedFormControl('', Validators.required),
    firstName: new UntypedFormControl('', Validators.required),
    secondName: new UntypedFormControl('', Validators.required),
    birthYear: new UntypedFormControl('', Validators.required),
    emailAddress: new UntypedFormControl('', [Validators.required, Validators.email]),
    phoneNumber: new UntypedFormControl('', Validators.required)
  })

  chosenYearHandler(ev:any, input:any) {
    let { _d } = ev;
    this.personnalInformation.value.birthYear = _d;
    // input._destroyPopup()
    this.picker.close()
  }

  finalSendToApi() {
    if (this.personnalInformation.value.livingType == "house" && this.wekeep == true) {
      console.log("API1")
    } else if (this.personnalInformation.value.livingType == "house" && this.wekeep == false) {
      console.log("API2")
    } else if (this.personnalInformation.value.livingType == "appartement") {
      console.log("API3")
    }
  }
}

