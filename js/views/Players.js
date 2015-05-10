import React from 'react';
import PlayerStore from '../stores/PlayerStore.js';
import PlayerActions from '../actions/PlayerActions.js';

let Players = React.createClass({
  getInitialState() {
    return PlayerStore.getState();
  },

  componentDidMount() {
    PlayerStore.listen(this.onChange);
  },

  componentWillUnmount() {
    PlayerStore.unlisten(this.onChange);
  },

  onChange(state) {
    console.log(state);
    this.setState(state);
  },

  deletePlayer(id, ev) {
    console.log(id);
    PlayerActions.deletePlayer(id);
  },

  render() {
    //console.log(this.state.players);
    var _this = this;
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Delete?</th>
          </tr>
        </thead>
        <tbody>
          {this.state.players.map(function(player) {
            return (
              <tr key={player._id}>
                <td>{player.name}</td>
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