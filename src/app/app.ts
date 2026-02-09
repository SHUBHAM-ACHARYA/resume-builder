import { AfterViewInit, Component, signal } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';
import { ResumeBuilder } from './pages/resume-builder/resume-builder';

@Component({
  selector: 'app-root',
  imports: [MatSlideToggleModule, ResumeBuilder],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  protected readonly title = signal('resume-builder');
  ngAfterViewInit() {
    const cursor = document.createElement('div');
    cursor.className = 'glass-cursor';
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  }
}
