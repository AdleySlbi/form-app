import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class MainFormComponent implements OnInit {

    stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  // constructor() { }

  ngOnInit(): void {
  }

  test(){
    console.log(this.personnalInformation.value)
    console.log(this.personnalInformation.value.zipCode.length)
  }

  // If houseInformation.livingType = house 
  // Check if we_keep == 0 
  public personnalInformation = new FormGroup({
    livingType: new FormControl('', Validators.required),
    ownership: new FormControl('', Validators.required),
    zipCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    workSituation: new FormControl('', [Validators.required]),
    adress: new FormGroup({
      street: new FormControl('', Validators.required),
      streetNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required)
    }),
    perso: new FormGroup({
      firstName: new FormControl('', Validators.required),
      secondName: new FormControl('', Validators.required), 
      birthday: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', Validators.required)
    })
  })
}
