import { Component } from '@angular/core';
import { PersonalInfo } from '../../components/personal-info/personal-info';
import { CommonModule } from '@angular/common';
import { ResumeService } from '../../services/resume.service';
import { Skills } from "../../components/skills/skills";
@Component({
  selector: 'app-resume-builder',
  imports: [PersonalInfo, CommonModule, Skills],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.scss',
})
export class ResumeBuilder {
  constructor(private resumeService: ResumeService) { }
  formCount = 1
  isLoading = false;

  getCurrentForm(count: number) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500)
    this.formCount = Number(count)
  }

}
