import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ResumeStateService } from './resume-state.service';

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
  private readonly resumeState = inject(ResumeStateService);
  readonly router = inject(Router);
  readonly isStepPage = signal(this.router.url !== '/');

  constructor() {
    this.firstFormGroup.patchValue(this.resumeState.resume().basicInformation);
    this.firstFormGroup.valueChanges.subscribe(() => {
      this.resumeState.updateBasicInformation(this.firstFormGroup.getRawValue());
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.isStepPage.set(event.urlAfterRedirects !== '/'));
  }
  showJobTitleOptions = false;
  filteredJobTitles: string[] = [];

  readonly jobTitleOptions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Web Developer',
    'Mobile App Developer',
    'DevOps Engineer',
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'Product Manager',
    'Project Manager',
    'UI/UX Designer',
    'Graphic Designer',
    'Marketing Manager',
    'Sales Representative',
    'Business Analyst',
    'Accountant',
    'Customer Success Manager',
    'Human Resources Manager',
  ];

  firstFormGroup = this.formBuilder.nonNullable.group({
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

  onJobTitleInput(): void {
    const searchTerm = this.firstFormGroup.controls.jobTitle.value?.trim().toLowerCase() ?? '';
    this.filteredJobTitles = this.jobTitleOptions
      .filter((title) => title.toLowerCase().includes(searchTerm))
      .slice(0, 8);
    this.showJobTitleOptions = true;
  }

  selectJobTitle(title: string): void {
    this.firstFormGroup.controls.jobTitle.setValue(title);
    this.showJobTitleOptions = false;
  }

  addManualJobTitle(): void {
    if (this.firstFormGroup.controls.jobTitle.value?.trim()) {
      this.firstFormGroup.controls.jobTitle.setValue(this.firstFormGroup.controls.jobTitle.value.trim());
      this.showJobTitleOptions = false;
    }
  }

  hideJobTitleOptions(): void {
    window.setTimeout(() => this.showJobTitleOptions = false, 150);
  }

  saveBasicInformation(): void {
    this.firstFormGroup.markAllAsTouched();

    if (this.firstFormGroup.invalid) {
      return;
    }

    this.resumeState.updateBasicInformation(this.firstFormGroup.getRawValue());
    void this.router.navigate(['/professional-summary']);
  }
}
