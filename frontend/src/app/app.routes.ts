import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { DevelopersComponent } from './developers/developers.component';
import { CommunityComponent } from './community/community.component';
import { MediakitComponent } from './mediakit/mediakit.component';
import { TermsComponent } from './terms of use/terms.component';
import { PolicyComponent } from './privacy policy/policy.component';

export const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'community', component: CommunityComponent },
	{ path: 'mediakit', component: MediakitComponent },
	{ path: 'terms', component: TermsComponent },
	{ path: 'policy', component: PolicyComponent },
  { path: '**', redirectTo: '' }
];
