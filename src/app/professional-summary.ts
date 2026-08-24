import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumeStateService } from './resume-state.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-professional-summary',
  styleUrl: './professional-summary.scss',
  templateUrl: './professional-summary.html',
})
export class ProfessionalSummary {
  private readonly formBuilder = inject(FormBuilder);
  private readonly resumeState = inject(ResumeStateService);
  private readonly router = inject(Router);

  generatedSummary = '';

  summaryForm = this.formBuilder.nonNullable.group({
    yearsOfExperience: ['', Validators.required],
    primaryRole: ['', Validators.required],
    mainTechnologies: ['', Validators.required],
    industry: ['', Validators.required],
    keyStrengths: ['', Validators.required],
  });

  constructor() {
    const saved = this.resumeState.resume().professionalSummary;
    this.summaryForm.patchValue({
      yearsOfExperience: saved.yearsOfExperience,
      primaryRole: saved.primaryRole,
      mainTechnologies: saved.mainTechnologies.join(', '),
      industry: saved.industry,
      keyStrengths: saved.keyStrengths.join(', '),
    });
    this.generatedSummary = saved.generatedSummary;
    this.summaryForm.valueChanges.subscribe(() => {
      const value = this.summaryForm.getRawValue();
      this.resumeState.updateProfessionalSummary({
      yearsOfExperience: String(value.yearsOfExperience),
      primaryRole: value.primaryRole,
      mainTechnologies: this.splitList(value.mainTechnologies),
      industry: value.industry,
      keyStrengths: this.splitList(value.keyStrengths),
      });
    });
  }

  goToBasicInformation(): void {
    void this.router.navigate(['/']);
  }

  generateProfessionalSummary(): void {
    this.summaryForm.markAllAsTouched();

    if (this.summaryForm.invalid) {
      return;
    }

    const value = this.summaryForm.getRawValue();
    const technologies = this.splitList(value.mainTechnologies);
    const strengths = this.splitList(value.keyStrengths);
    this.generatedSummary = this.createSummary(value, technologies, strengths);

    this.resumeState.updateProfessionalSummary({
      yearsOfExperience: String(value.yearsOfExperience),
      primaryRole: value.primaryRole,
      mainTechnologies: technologies,
      industry: value.industry,
      keyStrengths: strengths,
      generatedSummary: this.generatedSummary,
    });
  }

  saveAndContinue(): void {
    this.summaryForm.markAllAsTouched();

    if (this.summaryForm.invalid) {
      return;
    }

    this.generateProfessionalSummary();
    void this.router.navigate(['/work-experience']);
  }

  private createSummary(
    value: ReturnType<typeof this.summaryForm.getRawValue>,
    technologies: string[],
    strengths: string[],
  ): string {
    const years = Number(value.yearsOfExperience);
    const experience = Number.isFinite(years) && years === 1
      ? '1 year'
      : `${value.yearsOfExperience} years`;
    const technologyText = this.joinList(technologies);
    const strengthText = this.joinList(strengths);
    const templates = [
      `${value.primaryRole} with ${experience} of experience in ${value.industry}, specializing in ${technologyText}. Known for ${strengthText}.`,
      `Results-driven ${value.primaryRole} bringing ${experience} of experience across ${value.industry}, with expertise in ${technologyText} and a focus on ${strengthText}.`,
      `Experienced ${value.primaryRole} who builds impactful solutions in ${value.industry} using ${technologyText}. Brings strengths in ${strengthText} and a practical, results-focused approach.`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private splitList(value: string): string[] {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  private joinList(items: string[]): string {
    if (items.length < 2) {
      return items[0] ?? '';
    }

    return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
  }

}