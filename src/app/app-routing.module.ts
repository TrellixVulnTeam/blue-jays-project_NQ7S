import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueComponent } from './components/league/league.component';
import { TeamComponent } from './components/team/team.component';
import { PlayerComponent } from './components/player/player.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { 
    path: '', 
    component: LeagueComponent 
  },
  { 
    path: 'team/:id', 
    component: TeamComponent 
  },
  { 
    path: 'player/:id', 
    component: PlayerComponent 
  },
  { 
    path: '**', 
    component: ErrorComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }