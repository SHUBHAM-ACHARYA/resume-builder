import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  public pageStepper = 0;

  public gotoNextPage() {
    this.pageStepper = this.pageStepper + 1
  }

  public gotoPrevPage() {
    if (this.pageStepper!==0) {
      this.pageStepper = this.pageStepper - 1
    }
  }

  getPage(): number {
    return this.pageStepper;
  }
}
