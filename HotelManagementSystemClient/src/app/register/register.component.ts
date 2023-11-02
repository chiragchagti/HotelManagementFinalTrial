import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userForm: FormGroup
  password: string = ''
  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {

    this.userForm = this.formBuilder.group({
      name: ['', { validators: [Validators.required, Validators.minLength(4)] }], // Required and minimum length of 2 characters
      email: ['', [Validators.required, Validators.email]], // Required and must be a valid email
      password: ['', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/), this.savePassword]], // Required and minimum length of 8 characters
      role: ['User'], // No specific validation as it's a default value
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]], // Optional, a 10-digit numeric pattern (customize as needed)
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator]], // Required, you might want to add a custom validation for matching passwords
    })
  }
  savePassword = (control: AbstractControl) => {
    this.password = control.value

    return null
  }
  confirmPasswordValidator = (control: AbstractControl) => {

    const confirmPassword = control.value
    if (confirmPassword === this.password) {
      return null; // Validation passed
    }
    else {
      return { passwordDontMatch: true }; // Validation failed
    }

  }
  register() {
    var formData = new FormData
    formData = this.userForm.value
    this.loginService.register(formData).subscribe(
      (response) => {
        Swal.fire("User Regustered Successfully")
        this.router.navigateByUrl("")
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
