import React from 'react';
import GameStore from '../stores/GameStore.js';

let Games = React.createClass({
  getInitialState() {
    return GameStore.getState();
  },

  componentDidMount() {
    GameStore.listen(this.onChange);
  },

  componentWillUnmount() {
    GameStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    //console.log(this.state.players);
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Opponent</th>
            <th>Final Score</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {this.state.games.map(function(game) {
            return (
              <tr key={game._id}>
                <td>{game.opponent}</td>
                <td>{game.points_scored} - {game.opponent_points_scored}</td>
                <td>{game._id}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

    );
  }
});

export default Games; 