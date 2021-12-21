import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MLBStatsService } from 'src/app/services/mlbStats.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-teams',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  // for rendering
  isLoading = true;
  isError = false;

  // team data
  roster: any[] = [];
  team: any = null
  logoUrl: string = "";
  logoAlt: string = "";
  venueUrl: string = "";
  venueAlt: string = "";

  // table data
  displayedColumns: string[] = ['jerseyNumber', 'position', 'name', 'splits', 'height', 'weight', 'age', 'status' ];
  rosterDataSource: MatTableDataSource<any> = new MatTableDataSource( [''] ); 

  constructor(     
    private _Activatedroute: ActivatedRoute,
    private mlbStatsService: MLBStatsService,
  ) { }

  async ngOnInit() {
    // URL vars
    const paramMap = this._Activatedroute.snapshot.paramMap
    const id = paramMap.get( 'id' );

    // get and set data
    await this.getTeamData( id );
    this.setTeamImages();
    this.isLoading = false;
  }

  async getTeamData( id: any ) {
    try { 

      // get roster data
      const teamResponse = await this.mlbStatsService.getTeamData( id )

      // get team data
      const rosterResponse = await this.mlbStatsService.getTeamActiveRoster( id )
      
      // set data if returned
      if ( teamResponse.teams && rosterResponse.roster ) {
        this.team = teamResponse.teams[ 0 ];
        this.roster = rosterResponse.roster;

      } else {
        throw new Error( 'Unable to retrieve teams data.' );
      }

    } catch ( error ) {
      console.log( 'ERROR:', error );
      this.isLoading = false;
      this.onError();
    }

    this.rosterDataSource = new MatTableDataSource( this.roster );

  }

  onError() {
    this.isError = true;
  }

  setTeamImages() {

    if ( this.team ) {
      this.logoUrl = `https://www.mlbstatic.com/team-logos/${this.team.id}.svg`

      if ( this.team.venue ) {
        this.venueUrl= `https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/fields/${this.team.venue.id}.svg`
      }
    }
    this.logoAlt = `${this.team.abbreviation} Logo`
    this.venueAlt = `${this.team.abbreviation} Venue`
  }

}

