import React from 'react';
import PossessionStore from '../stores/PossessionStore.js';
import PlayerActions from '../actions/PlayerActions.js';
var _ = require("lodash");

let BoxScore = React.createClass({
  getInitialState() {
    return { box_info: [] };
  },

  componentDidMount() {
    PossessionStore.listen(this.onChange);
    var _this = this;
    PossessionStore.getBoxScoreInfo(this.props.params.id, function(data) {
      _this.setState({
        box_info: data
      });
    });
    PossessionStore.getStatistics(this.props.params.id, function(stats) {
      _this.setState({
        stats: stats
      });
    });
    PossessionStore.getOpponentStatistics(this.props.params.id, function(stats) {
      _this.setState({
        opponent_stats: stats
      });
    });
  },

  onChange() {
    var _this = this;
    PossessionStore.getBoxScoreInfo(this.props.params.id, function(data) {
      _this.setState({
        box_info: data
      });
    });
    PossessionStore.getStatistics(this.props.params.id, function(stats) {
      _this.setState({
        stats: stats
      });
    });
    PossessionStore.getOpponentStatistics(this.props.params.id, function(stats) {
      _this.setState({
        opponent_stats: stats
      });
    });
  },

  componentWillUnmount() {
    PossessionStore.unlisten(this.onChange);
  },

  render() {
    var _this = this;
    var totals = {
      fgm: 0,
      fga: 0,
      threepa: 0,
      threepm: 0,
      efg: 0,
      fta: 0,
      ftm: 0,
      assists: 0,
      turnovers: 0,
      points: 0,
      rebounds: 0,
    };

    _.keys(totals).forEach(function(stat) {
      totals[stat] = _this.state.box_info.reduce(function(prev, current) {
        return prev + current[stat];
      }, 0);
    });
    totals.efg = (totals.fgm + 0.5 * totals.threepm) / totals.fga;
    totals.ts = (totals.points) / (2 * (totals.fga + 0.5 * totals.fta));

    return (
      <div>
        <h2>Box Score</h2>
        <table id="box" className="pure-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>MIN</th>
              <th>FG</th>
              <th>3PT</th>
              <th>FT</th>
              <th>EFG%</th>
              <th>TS%</th>
              <th>AST</th>
              <th>REB</th>
              <th>TO</th>
              <th>+/-</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {this.state.box_info.map(function(player) {
              return (
                <tr key={player._id}>
                  <td>{player.name}</td>
                  <td>{player.minutes}</td>
                  <td>{player.fgm}-{player.fga}</td>
                  <td>{player.threepm}-{player.threepa}</td>
                  <td>{player.ftm}-{player.fta}</td>
                  <td>{(player.efg * 100).toFixed(2)}%</td>
                  <td>{(player.ts * 100).toFixed(2)}%</td>
                  <td>{player.assists}</td>
                  <td>{player.rebounds}</td>
                  <td>{player.turnovers}</td>
                  <td>{player.plus_minus}</td>
                  <td>{player.points}</td>
                </tr>
              )
            })}
            <tr id="last_box">
              <td>Totals:</td>
              <td>--</td>
              <td>{totals.fgm}-{totals.fga}</td>
              <td>{totals.threepm}-{totals.threepa}</td>
              <td>{totals.ftm}-{totals.fta}</td>
              <td>{(totals.efg * 100).toFixed(2)}%</td>
              <td>{(totals.ts * 100).toFixed(2)}%</td>
              <td>{totals.assists}</td>
              <td>{totals.rebounds}</td>
              <td>{totals.turnovers}</td>
              <td>--</td>
              <td>{totals.points}</td>
            </tr>
          </tbody>
        </table>
        <h2>Opponent Stats</h2>
        {this.state.opponent_stats ?
        <table className="pure-table">
          <thead>
            <tr>
              <th>FG</th>
              <th>3PT</th>
              <th>FT</th>
              <th>TS%</th>
              <th>REB</th>
              <th>TO</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.opponent_stats.fgm}-{this.state.opponent_stats.fga}</td>
              <td>{this.state.opponent_stats.threepm}-{this.state.opponent_stats.threepa}</td>
              <td>{this.state.opponent_stats.ftm}-{this.state.opponent_stats.fta}</td>
              <td>{(this.state.opponent_stats.ts * 100).toFixed(2)}%</td>
              <td>{this.state.opponent_stats.rebounds}</td>
              <td>{this.state.opponent_stats.turnovers}</td>
              <td>{this.state.opponent_stats.points}</td>
            </tr>
          </tbody>
        </table>
        : null }
        <h2>Other Stats</h2>
        <ul id="stats">
          {_.pairs(this.state.stats).map(function(stat) {
            return (<li>{stat[0]}:{stat[1]}</li>)
          })}
        </ul>
      </div>
    );
  }
});

export default BoxScore; 