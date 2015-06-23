import React from 'react';
import PlayerStore from '../stores/PlayerStore.js';
import PossessionStore from '../stores/PossessionStore.js';

import PlayerActions from '../actions/PlayerActions.js';
import Utils from '../logic.js';


let Players = React.createClass({
  getInitialState() {
    return PlayerStore.getState();
  },

  componentDidMount() {
    PlayerStore.listen(this.onChange);
    this.state.players.forEach((player) => {
      PossessionStore.getOnOffData(player._id, (data) => {
        console.log(data);
      });
    });
  },

  componentWillUnmount() {
    PlayerStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  deletePlayer(id, ev) {
    PlayerActions.deletePlayer(id);
  },

  render() {
    var _this = this;
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Delete?</th>
          </tr>
        </thead>
        <tbody>
          {this.state.players.map(function(player) {
            return (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player._id}</td>
                <td onClick={_this.deletePlayer.bind(_this, player._id)}>del</td>
              </tr>
            )
          })}
        </tbody>
      </table>

    );
  }
});

export default Players; 