import React from 'react';
import YouTube from 'react-youtube';
import GameStore from '../stores/GameStore.js';
import PossessionStore from '../stores/PossessionStore.js';
import PossessionActions from '../actions/PossessionActions';
import PlayerSelector from './PlayerSelector';

let PossessionEditor = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {

  },

  componentWillUnmount() {
  },

  setStartTime() {
    var pos = this.props.possession;
    var current_time = window.player.getCurrentTime();
    var update = { $set: {start_time: current_time } };
    PossessionActions.updatePossession(pos, update);
  },

  lineupChange(position, player_id) {
    var pos = this.props.possession;
    var field_to_update = "lineup." + (position - 1);
    var update = { $set: {} };
    update.$set[field_to_update] = player_id;
    PossessionActions.updatePossession(pos, update);
  },

  render() {
    var pos = this.props.possession;
    var _this = this;
    return (
      <div>
        <section id="start_time">
          <button onClick={_this.setStartTime} className="pure-button button-add">Set Start Time</button>
          <span>{pos.start_time ? pos.start_time : "Not Set"}</span>
        </section>

        <ul id="lineup">
          {pos.lineup.map(function(player_id, index) {
            return (<li key={player_id + index}><PlayerSelector selected={player_id} onChange={_this.lineupChange.bind(this, index + 1)} /></li>)
          })}
        </ul>
      </div>
    );
  }
});

export default PossessionEditor;