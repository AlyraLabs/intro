import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { DevelopersComponent } from './developers/developers.component';
import { CommunityComponent } from './community/community.component';

export const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'community', component: CommunityComponent },
  { path: '**', redirectTo: '' }
];
