import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private formBuilder = inject(FormBuilder);

  firstFormGroup = this.formBuilder.group({
    fullName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    location: ['', Validators.required],
    linkedIn: ['', Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/\S+$/i)],
    gitHub: ['', Validators.pattern(/^https?:\/\/(www\.)?github\.com\/\S+$/i)],
    portfolio: ['', Validators.pattern(/^https?:\/\/\S+$/i)],
    profilePhoto: [''],
  });
}
