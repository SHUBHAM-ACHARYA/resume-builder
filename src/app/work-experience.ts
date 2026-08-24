import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumeStateService } from './resume-state.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-work-experience',
  styleUrl: './work-experience.scss',
  templateUrl: './work-experience.html',
})
export class WorkExperience {
  private readonly formBuilder = inject(FormBuilder);
  private readonly resumeState = inject(ResumeStateService);
  private readonly router = inject(Router);

  experienceForm = this.formBuilder.nonNullable.group({
    company: ['', Validators.required],
    jobTitle: ['', Validators.required],
    employmentType: ['', Validators.required],
    location: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    currentlyWorking: [false],
    technologies: ['', Validators.required],
    responsibilities: ['', Validators.required],
    achievements: [''],
  });

  constructor() {
    const saved = this.resumeState.resume().workExperienceDraft;
    this.experienceForm.patchValue({
      ...saved,
      technologies: saved.technologies.join(', '),
      responsibilities: saved.responsibilities.join(', '),
      achievements: saved.achievements.join(', '),
    });
    this.experienceForm.valueChanges.subscribe(() => {
      const value = this.experienceForm.getRawValue();
      this.resumeState.updateWorkExperienceDraft({
      ...value,
      technologies: this.splitList(value.technologies),
      responsibilities: this.splitList(value.responsibilities),
      achievements: this.splitList(value.achievements),
      });
    });
  }

  saveExperience(): void {
    this.experienceForm.markAllAsTouched();

    if (this.experienceForm.invalid) {
      return;
    }

    const value = this.experienceForm.getRawValue();
    this.resumeState.addWorkExperience({
      ...value,
      technologies: this.splitList(value.technologies),
      responsibilities: this.splitList(value.responsibilities),
      achievements: this.splitList(value.achievements),
    });
    this.experienceForm.reset();
  }

  goToProfessionalSummary(): void {
    void this.router.navigate(['/professional-summary']);
  }

  private splitList(value: string): string[] {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
}