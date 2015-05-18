import React from 'react';
import PossessionStore from '../stores/PossessionStore.js';
import PlayerActions from '../actions/PlayerActions.js';

let BoxScore = React.createClass({
  getInitialState() {
    return { box_info: [] };
  },

  componentDidMount() {
    var _this = this;
    PossessionStore.getBoxScoreInfo(this.props.params.id, function(data) {
      _this.setState({
        box_info: data
      });
    });
  },

  render() {
    //console.log(this.state.players);
    var _this = this;
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>FG</th>
            <th>3PT</th>
            <th>FT</th>
            <th>AST</th>
            <th>TO</th>
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
                <td>{player.assists}</td>
                <td>{player.turnovers}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }
});

export default BoxScore; 