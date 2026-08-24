import { effect, Injectable, signal } from '@angular/core';

export interface BasicInformation {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  gitHub: string;
  portfolio: string;
  profilePhoto: string;
}

export interface ProfessionalSummary {
  yearsOfExperience: string;
  primaryRole: string;
  mainTechnologies: string[];
  industry: string;
  keyStrengths: string[];
  generatedSummary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
}

export interface TechnicalSkills {
  programmingLanguages: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  tools: string[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  keyContributions: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  date: string;
  credentialUrl: string;
}

export interface AdditionalInformation {
  awards: string[];
  publications: string[];
  openSourceContributions: string[];
  hackathons: string[];
  languages: string[];
  volunteerExperience: string[];
  interests: string[];
}

export interface ResumeState {
  basicInformation: BasicInformation;
  professionalSummary: ProfessionalSummary;
  workExperience: WorkExperience[];
  workExperienceDraft: Omit<WorkExperience, 'id'>;
  technicalSkills: TechnicalSkills;
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  additionalInformation: AdditionalInformation;
}

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const emptyWorkExperience: Omit<WorkExperience, 'id'> = {
  company: '', jobTitle: '', employmentType: '', location: '', startDate: '', endDate: '',
  currentlyWorking: false, technologies: [], responsibilities: [], achievements: [],
};

const emptyState: ResumeState = {
  basicInformation: {
    fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedIn: '',
    gitHub: '', portfolio: '', profilePhoto: '',
  },
  professionalSummary: {
    yearsOfExperience: '', primaryRole: '', mainTechnologies: [], industry: '', keyStrengths: [], generatedSummary: '',
  },
  workExperience: [],
  workExperienceDraft: emptyWorkExperience,
  technicalSkills: {
    programmingLanguages: [], frontend: [], backend: [], database: [], tools: [],
  },
  projects: [],
  education: [],
  certifications: [],
  additionalInformation: {
    awards: [], publications: [], openSourceContributions: [], hackathons: [], languages: [],
    volunteerExperience: [], interests: [],
  },
};

@Injectable({ providedIn: 'root' })
export class ResumeStateService {
  private readonly storageKey = 'resume-builder-state';
  private readonly state = signal<ResumeState>(this.loadState());
  readonly resume = this.state.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state()));
    });
  }

  private loadState(): ResumeState {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) {
        return structuredClone(emptyState);
      }

      const parsed = JSON.parse(saved) as Partial<ResumeState>;
      return {
        ...structuredClone(emptyState),
        ...parsed,
        basicInformation: { ...emptyState.basicInformation, ...parsed.basicInformation },
        professionalSummary: {
          ...emptyState.professionalSummary,
          ...parsed.professionalSummary,
          yearsOfExperience: String(parsed.professionalSummary?.yearsOfExperience ?? ''),
        },
        technicalSkills: { ...emptyState.technicalSkills, ...parsed.technicalSkills },
        additionalInformation: { ...emptyState.additionalInformation, ...parsed.additionalInformation },
        workExperience: Array.isArray(parsed.workExperience) ? parsed.workExperience : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        workExperienceDraft: { ...emptyWorkExperience, ...parsed.workExperienceDraft },
      };
    } catch {
      return structuredClone(emptyState);
    }
  }

  updateBasicInformation(value: BasicInformation): void {
    this.state.update((current) => ({ ...current, basicInformation: { ...value } }));
  }

  updateProfessionalSummary(value: Partial<ProfessionalSummary>): void {
    this.state.update((current) => ({
      ...current,
      professionalSummary: { ...current.professionalSummary, ...value },
    }));
  }

  updateWorkExperienceDraft(value: Omit<WorkExperience, 'id'>): void {
    this.state.update((current) => ({
      ...current, workExperienceDraft: { ...value, technologies: [...value.technologies], responsibilities: [...value.responsibilities], achievements: [...value.achievements] },
    }));
  }

  updateTechnicalSkills(value: Partial<TechnicalSkills>): void {
    this.state.update((current) => ({
      ...current,
      technicalSkills: { ...current.technicalSkills, ...value },
    }));
  }

  addWorkExperience(value: Omit<WorkExperience, 'id'>): string {
    const id = createId();
    this.state.update((current) => ({
      ...current, workExperience: [...current.workExperience, { ...value, id }], workExperienceDraft: { ...emptyWorkExperience },
    }));
    return id;
  }

  updateWorkExperience(id: string, value: Partial<WorkExperience>): void {
    this.state.update((current) => ({
      ...current,
      workExperience: current.workExperience.map((item) => item.id === id ? { ...item, ...value } : item),
    }));
  }

  removeWorkExperience(id: string): void {
    this.state.update((current) => ({
      ...current, workExperience: current.workExperience.filter((item) => item.id !== id),
    }));
  }

  addProject(value: Omit<Project, 'id'>): string {
    const id = createId();
    this.state.update((current) => ({ ...current, projects: [...current.projects, { ...value, id }] }));
    return id;
  }

  updateProject(id: string, value: Partial<Project>): void {
    this.state.update((current) => ({
      ...current,
      projects: current.projects.map((item) => item.id === id ? { ...item, ...value } : item),
    }));
  }

  removeProject(id: string): void {
    this.state.update((current) => ({
      ...current, projects: current.projects.filter((item) => item.id !== id),
    }));
  }

  updateProjects(projects: Project[]): void {
    this.state.update((current) => ({ ...current, projects: [...projects] }));
  }

  updateEducation(education: Education[]): void {
    this.state.update((current) => ({ ...current, education: [...education] }));
  }

  updateCertifications(certifications: Certification[]): void {
    this.state.update((current) => ({ ...current, certifications: [...certifications] }));
  }

  updateAdditionalInformation(value: Partial<AdditionalInformation>): void {
    this.state.update((current) => ({
      ...current,
      additionalInformation: { ...current.additionalInformation, ...value },
    }));
  }

  reset(): void {
    this.state.set(structuredClone(emptyState));
  }
}