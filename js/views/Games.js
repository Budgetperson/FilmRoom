import React from 'react';
import GameStore from '../stores/GameStore.js';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

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
            <th>Box Score</th>
            <th>Edit Metadata</th>
          </tr>
        </thead>
        <tbody>
          {this.state.games.map(function(game) {
            return (
              <tr key={game._id}>
                <td>{game.opponent}</td>
                <td>{game.points_scored} - {game.opponent_points_scored}</td>
                <td><Link to="box" params={{id: game._id}}>Box</Link></td>
                <td><Link to="game" params={{id: game._id}}>Edit</Link></td>
              </tr>
            )
          })}
        </tbody>
      </table>

    );
  }
});

export default Games; 