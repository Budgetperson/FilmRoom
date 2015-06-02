import React from 'react';
import PlayerStore from '../stores/PlayerStore.js';

let PlayerSelector = React.createClass({
  getInitialState() {
    return PlayerStore.getState();
  },

  getDefaultProps() {
    return {
      selected: "",
      defaultText: "Player: "
    };
  },

  componentDidMount() {
    PlayerStore.listen(this.onChange);
  },

  componentWillUnmount() {
    PlayerStore.unlisten(this.onChange);
  },

  onChange(state) {
    //console.log(state);
    this.setState(state);
  },

  playerChange(event) {
    var player_id = event.target.value;
    this.props.onChange(player_id);
  },

  render() {
    var _this = this;
    return (
      <select value={_this.props.selected} onChange={this.playerChange}>
          <option value="">{this.props.defaultText}</option>
          {this.state.players.map(function(player) {
            return (
              <option key={player._id} value={player._id}>
                {player.name.split(" ")[0]}
              </option>
            )
          })}
      </select>

    );
  }
});

export default PlayerSelector; 