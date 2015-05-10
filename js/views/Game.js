require("array.prototype.find");
import React from 'react';
import GameStore from '../stores/GameStore.js';

let Game = React.createClass({
  getInitialState() {
    var id = this.props.params.id;
    console.log(GameStore.getState().games);
    return GameStore.getState().games.find(game => game._id == id);
  },

  componentDidMount() {
    GameStore.listen(this.onChange);
  },

  componentWillUnmount() {
    GameStore.unlisten(this.onChange);
  },

  onChange(state) {
    var id = this.props.params.id;
    this.setState(state.games.find(game => game._id == id));
  },

  render() {
    //console.log(this.state.players);
    return (
      <h1>{this.state.opponent}</h1>

    );
  }
});

export default Game;