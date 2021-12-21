import { Component, OnInit } from '@angular/core';
import { MLBStatsService } from 'src/app/services/mlbStats.service';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit {

  // for rendering
  isLoading = true;
  isError = false;

  // teams data
  teams: any[] = [];

  constructor(
    private mlbStatsService: MLBStatsService,
  ) { }

  async ngOnInit() {

    await this.getLeagueData();
    this.setImageFields();
    this.isLoading = false;
  }

  async getLeagueData() {
    try { 

      // get MLB teams
      const resp = await this.mlbStatsService.getTeams();
      
      if ( resp.teams ) {
        this.teams = resp.teams;

        // sort alphabetically
        this.teams.sort( (a, b) => ( a.name > b.name ) ? 1 : -1)

      } else {
        throw new Error( 'Unable to retrieve teams list.' );
      }

    } catch ( error ) {
      console.log( 'ERROR:', error );
      this.isLoading = false;
      this.onError();
    }
  }

  setImageFields() {
    for ( let i = 0; i < this.teams.length; i++ ) {
      const team = this.teams[ i ];
      team[ 'imageUrl' ] = `https://www.mlbstatic.com/team-logos/${team.id}.svg`
      team[ 'imageAlt' ] = `${team.abbreviation} Logo`
    }
  }

  onError() {
    this.isError = true;
  }

}
