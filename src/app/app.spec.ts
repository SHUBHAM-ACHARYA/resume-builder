import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { ResumeStateService } from './resume-state.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the basic information form', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Basic information');
    expect(compiled.querySelector('form')).toBeTruthy();
  });

  it('should store valid basic information in the global resume state', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const state = TestBed.inject(ResumeStateService);

    app.firstFormGroup.setValue({
      fullName: 'Jane Doe',
      jobTitle: 'Frontend Developer',
      email: 'jane@example.com',
      phone: '',
      location: 'Bengaluru',
      linkedIn: '',
      gitHub: '',
      portfolio: '',
      profilePhoto: '',
    });
    app.saveBasicInformation();

    expect(state.resume().basicInformation.fullName).toBe('Jane Doe');
    expect(state.resume().basicInformation.jobTitle).toBe('Frontend Developer');
  });

  it('should support multiple work experiences in the global resume state', () => {
    const state = TestBed.inject(ResumeStateService);
    const experience = {
      company: 'Acme Inc.',
      jobTitle: 'Software Engineer',
      employmentType: 'Full-time',
      location: 'Remote',
      startDate: '2024-01',
      endDate: '',
      currentlyWorking: true,
      technologies: ['TypeScript'],
      responsibilities: ['Build products'],
      achievements: ['Improved performance'],
    };

    const firstId = state.addWorkExperience(experience);
    const secondId = state.addWorkExperience({ ...experience, company: 'Beta Labs' });

    expect(state.resume().workExperience).toHaveLength(2);
    state.updateWorkExperience(firstId, { jobTitle: 'Senior Software Engineer' });
    expect(state.resume().workExperience[0].jobTitle).toBe('Senior Software Engineer');
    state.removeWorkExperience(secondId);
    expect(state.resume().workExperience).toHaveLength(1);
  });
});
