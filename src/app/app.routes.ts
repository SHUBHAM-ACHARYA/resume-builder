import { Routes } from '@angular/router';
import { BasicInformationRoute } from './basic-information-route';
import { ProfessionalSummary } from './professional-summary';
import { WorkExperience } from './work-experience';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', component: BasicInformationRoute },
	{ path: 'professional-summary', component: ProfessionalSummary },
	{ path: 'work-experience', component: WorkExperience },
];
