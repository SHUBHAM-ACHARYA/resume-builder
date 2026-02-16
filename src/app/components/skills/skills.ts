import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ResumeService } from '../../services/resume.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills implements OnInit {
  formGroup: any;
  @Output() setPageForParent = new EventEmitter<number>();
  constructor(private resumeService: ResumeService) { }
  ngOnInit(): void {
    this.formGroup = new FormGroup({
      skillName: new FormControl('', [
        Validators.required,
      ]),
      skillLevel: new FormControl('', [Validators.required]),
    });

  }

  nextPage() {
    this.resumeService.gotoNextPage();
    this.setPageForParent.emit(this.resumeService.getPage())
  }

  prevPage() {
    this.resumeService.gotoPrevPage();
    this.setPageForParent.emit(this.resumeService.getPage())

  }
}
