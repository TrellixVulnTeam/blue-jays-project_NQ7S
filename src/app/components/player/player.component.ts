import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MLBStatsService } from 'src/app/services/mlbStats.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  // for rendering
  isLoading = true;
  isError = false;

  // player data
  player: any = null;
  stats: any = null;
  logoUrl: string = "";
  logoAlt: string = "";
  playerUrl: string = "";
  playerAlt: string = "";
  teamId: string = "";

  // data table
  showStatType: string = 'hitting';
  displayedColumns: string[] = [];
  statDataSource: MatTableDataSource<any> = new MatTableDataSource( [''] ); 


  constructor(
    private _Activatedroute: ActivatedRoute,
    private mlbStatsService: MLBStatsService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    // get URL params
    const paramMap = this._Activatedroute.snapshot.paramMap
    const id = paramMap.get( 'id' );

    // retrieve player data
    await this.getPlayerData( id );
    this.setPlayerImages();
    this.setDefaultStatType();
    this.setDataTable();

    this.isLoading = false;
  }

  async getPlayerData( id: any ) {
    try { 

      // get palyer data
      const playerResponse = await this.mlbStatsService.getPlayerData( id );

      if ( playerResponse.people ) {

        this.player = playerResponse.people[ 0 ];
        this.teamId = this.player.currentTeam.id;

        console.log('++player', this.player);

        if ( this.player.stats ) {
          this.stats = this.player.stats
        }
      } else {
        throw new Error( 'Unable to retrieve teams data.' );
      }

    } catch ( error ) {
      console.log( 'ERROR:', error );
      this.isLoading = false;
      this.onError();
    }
  }

  setPlayerImages() {

    // team and player images
    if ( this.player && this.player.currentTeam ) {

      this.playerUrl = `https://content.mlb.com/images/headshots/current/60x60/${this.player.id}@4x.png`
      
      // if player is on a minor league affiliate, show parent team logo and update teamid
      if ( this.player.currentTeam.parentOrgId ) {
        this.logoUrl = `https://www.mlbstatic.com/team-logos/${this.player.currentTeam.parentOrgId}.svg`
        this.teamId = this.player.currentTeam.parentOrgId;
      } else {
        this.logoUrl = `https://www.mlbstatic.com/team-logos/${this.player.currentTeam.id}.svg`
      }
      
    }
    this.logoAlt = `${this.player.currentTeam.name} Logo`
    this.playerAlt = 'Player Photo'
  }

  setDefaultStatType() {

    // default to pitching stats for pitchers and hitting stats for position players
    const primaryPositionAbbr = this.player.primaryPosition.abbreviation;
    if ( primaryPositionAbbr == "P" ) {
      this.showStatType = 'pitching';
    } else {
      this.showStatType = 'hitting';
    } 
  }

  setDataTable() {

    let displayStats;

    if ( this.stats ) {
      // update stat group data for table
      for ( let i = 0; i < this.stats.length; i++ ) {
        const statGroup = this.stats[ i ];
        const statGroupName = statGroup.group.displayName;

        if ( statGroupName == this.showStatType ) {
          displayStats = statGroup.splits;
          break;
        }
      }

      this.statDataSource = new MatTableDataSource( displayStats );

      // update display columns for stat group
      if ( this.showStatType == 'hitting' ) {
        this.displayedColumns = [ 'season', 'gamesPlayed', 'atBats', 'plateAppearances', 'hits', 'runs', 'homeRuns', 
          'rbi', 'avg', 'obp', 'slg', 'ops', 'babip', 'strikeOuts', 'stolenBases', 'atBatsPerHomeRun' ]
      }

      if ( this.showStatType == 'pitching' ) {
        this.displayedColumns = [ 'season', 'gamesPitched', 'gamesStarted', 'inningsPitched', 'wins', 'losses', 'saves', 
          'earnedRuns', 'battersFaced', 'era', 'whip', 'avg', 'obp', 'walksPer9Inn', 'strikeoutsPer9Inn', 'homeRunsPer9', 
          'strikeoutWalkRatio', 'strikeOuts', 'baseOnBalls' ]
      }

      if ( this.showStatType == 'fielding' ) {
        this.displayedColumns = [ 'season', 'position', 'games', 'gamesStarted', 'chances', 'errors', 'fielding', 'assists', 
          'putOuts', 'throwingErrors', 'rangeFactorPer9Inn', 'innings' ]
      }
    }
  }


  capitalizeFirstLetter( str: string ) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // update data table on stat type change
  onStatTypeChange( $event: any ) {
    this.showStatType = $event.value;
    this.setDataTable()
    this.cdr.markForCheck();
  }

  onError() {
    this.isError = true;
  }

}


