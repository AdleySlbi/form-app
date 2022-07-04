import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  test(){
    console.log(this.personnalInformation.value)
  }

  // If houseInformation.livingType = house 
  // Check if we_keep == 0 
  public personnalInformation = new FormGroup({
    livingType: new FormControl(''),
    ownership: new FormControl(''),
    zipCode: new FormControl(''),
    workSituation: new FormControl(''),
    adress: new FormGroup({
      street: new FormControl(''),
      streetNumber: new FormControl(''),
      city: new FormControl('')
    }),
    perso: new FormGroup({
      firstName: new FormControl(''),
      secondName: new FormControl(''), 
      birthday: new FormControl(''),
      phoneNumber: new FormControl('')
    })
  })
}
