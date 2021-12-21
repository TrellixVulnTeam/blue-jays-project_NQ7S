import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MLBStatsService {

  statsApiBaseUrl =  'https://statsapi.mlb.com/api/v1/';

  constructor(
    private http: HttpClient,
  ) { }

  async getTeams(): Promise<any> {
    const res$ = this.http.get( this.statsApiBaseUrl + 'teams?sportId=1' );
    const res = await lastValueFrom( res$ );
    return res;
  }

  async getTeamData( id: number ): Promise<any> {
    const res$ = this.http.get( this.statsApiBaseUrl + `teams/${id}` );
    const res = await lastValueFrom( res$ );
    return res;
  }

  async getTeamActiveRoster( id: number ): Promise<any> {
    const res$ = this.http.get( this.statsApiBaseUrl + 
      `teams/${id}/roster/active?hydrate=person(stats(type=season))`
    );
    const res = await lastValueFrom( res$ );
    return res;
  }

  async getPlayerData( id: number ): Promise<any> {
    const res$ = this.http.get( this.statsApiBaseUrl + 
      `people/${id}?hydrate=currentTeam,stats(group=[hitting,pitching,fielding],type=[yearByYear])`
    );
    const res = await lastValueFrom( res$ );
    return res;
  }
}
