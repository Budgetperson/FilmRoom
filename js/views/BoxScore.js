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
  },

  onChange() {
    var _this = this;
    PossessionStore.getBoxScoreInfo(this.props.params.id, function(data) {
      _this.setState({
        box_info: data
      });
    });
  },

  componentWillUnmount() {
    PossessionStore.unlisten(this.onChange);
  },

  render() {
    //console.log(this.state.players);
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
      points: 0
    };

    _.keys(totals).forEach(function(stat) {
      totals[stat] = _this.state.box_info.reduce(function(prev, current) {
        return prev + current[stat];
      }, 0);
    });
    totals.efg = (totals.fgm + 0.5 * totals.threepm) / totals.fga;

    return (
      <table id="box" className="pure-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>FG</th>
            <th>3PT</th>
            <th>FT</th>
            <th>EFG%</th>
            <th>AST</th>
            <th>TO</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {this.state.box_info.map(function(player) {
            return (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.fgm}-{player.fga}</td>
                <td>{player.threepm}-{player.threepa}</td>
                <td>{player.ftm}-{player.fta}</td>
                <td>{(player.efg * 100).toFixed(2)}%</td>
                <td>{player.assists}</td>
                <td>{player.turnovers}</td>
                <td>{player.points}</td>
              </tr>
            )
          })}
          <tr id="last_box">
            <td>Totals:</td>
            <td>{totals.fgm}-{totals.fga}</td>
            <td>{totals.threepm}-{totals.threepa}</td>
            <td>{totals.ftm}-{totals.fta}</td>
            <td>{(totals.efg * 100).toFixed(2)}%</td>
            <td>{totals.assists}</td>
            <td>{totals.turnovers}</td>
            <td>{totals.points}</td>
          </tr>
        </tbody>
      </table>
    );
  }
});

export default BoxScore; 