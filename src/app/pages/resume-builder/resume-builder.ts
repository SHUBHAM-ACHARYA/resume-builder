import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PersonalInfo } from '../../components/personal-info/personal-info';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-resume-builder',
  imports: [MatCardModule, MatButtonModule, PersonalInfo, MatProgressSpinnerModule, CommonModule],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.scss',
})
export class ResumeBuilder {
  pageCount = 0;
  isLoading = false;
  nextPage() {
    this.isLoading = true;
    this.pageCount = this.pageCount + 1;
    setTimeout(() => {
      this.isLoading = false;
    }, 200);
  }
  prevPage() {
    if (this.pageCount > 0) {
      this.pageCount = this.pageCount - 1;
    }
  }
}
