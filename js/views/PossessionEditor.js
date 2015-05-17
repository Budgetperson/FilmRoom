import React from 'react';
import YouTube from 'react-youtube';
import GameStore from '../stores/GameStore.js';
import PossessionStore from '../stores/PossessionStore.js';
import PossessionActions from '../actions/PossessionActions';
import PlayerSelector from './PlayerSelector';

let PossessionEditor = React.createClass({

  setStartTime() {
    var pos = this.props.possession;
    var current_time = window.player.getCurrentTime();
    var update = { $set: {start_time: current_time } };
    PossessionActions.updatePossession(pos, update);
  },

  setEndTime() {
    var pos = this.props.possession;
    var current_time = window.player.getCurrentTime();
    var update = { $set: { end_time: current_time } };
    PossessionActions.updatePossession(pos, update);
  },

  lineupChange(position, player_id) {
    var pos = this.props.possession;
    var field_to_update = "lineup." + (position - 1);
    var update = { $set: {} };
    update.$set[field_to_update] = player_id;
    PossessionActions.updatePossession(pos, update);
  },

  setResult(event) {
    // values: {turnover: t/f, shot_attempt_value: 2/3, shot_made: t/f/undefined, }
    var pos = this.props.possession;
    var val = event.target.value;
    var update = { $set: {} };
    switch(val) {
      case "turnover":
        update.$set = {turnover: true, shot_attempt_value: null, shot_made: null, result: val };
        break;
      case "made2":
        update.$set = {turnover: false, shot_attempt_value: 2, shot_made: true, result: val };
        break;
      case "missed2":
        update.$set = {turnover: false, shot_attempt_value: 2, shot_made: false, result: val };
        break;
      case "made3":
        update.$set = {turnover: false, shot_attempt_value: 3, shot_made: true, result: val };
        break;
      case "missed3":
        update.$set = {turnover: false, shot_attempt_value: 3, shot_made: false, result: val };
        break;
    }
    PossessionActions.updatePossession(pos, update);
  },

  setFreeThrowsMade(event) {
    var pos = this.props.possession;
    var ftm = event.target.value;
    var update = { $set: {
      ftm: ftm
    }};
    PossessionActions.updatePossession(pos, update);
  },

  setFreeThrowsAttempted(event) {
    var pos = this.props.possession;
    var fta = event.target.value;
    var update = { $set: {
      fta: fta
    }};
    PossessionActions.updatePossession(pos, update);
  },

  setShotBy(player_id) {
    var pos = this.props.possession;
    var update = { $set: {
      shot_by: player_id
    }};
    PossessionActions.updatePossession(pos, update);
  },
  
  setAssist(player_id) {
    var pos = this.props.possession;
    var update = { $set: {
      assist: player_id
    }};
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

        <ul id="result">
          <li><button onClick={this.setResult} value="turnover" className={pos.result == 'turnover' ? 'pure-button pure-button-active' : 'pure-button' }>Turnover</button></li>
          <li><button onClick={this.setResult} value="made2" className={pos.result == 'made2' ? 'pure-button pure-button-active' : 'pure-button' }>Made 2</button></li>
          <li><button onClick={this.setResult} value="missed2" className={pos.result == 'missed2' ? 'pure-button pure-button-active' : 'pure-button' }>Missed 2</button></li>
          <li><button onClick={this.setResult} value="made3" className={pos.result == 'made3' ? 'pure-button pure-button-active' : 'pure-button' }>Made 3</button></li>
          <li><button onClick={this.setResult} value="missed3" className={pos.result == 'missed3' ? 'pure-button pure-button-active' : 'pure-button' }>Missed 3</button></li>
        </ul>

        <section id="free_throws">
          <span>FTM:</span><input defaultValue={pos.ftm || 0} onChange={this.setFreeThrowsMade} type="number" name="ftm" min="0" max="3" />
          <span>FTA:</span><input defaultValue={pos.fta || 0} onChange={this.setFreeThrowsAttempted} type="number" name="ftm" min="0" max="3" />
        </section>

        <section id="player_credit">
          <span>Shot By:</span><PlayerSelector selected={pos.shot_by} onChange={this.setShotBy} />
          <span>Assist By:</span><PlayerSelector selected={pos.assist} onChange={this.setAssist} />
        </section>

        <section id="end_time">
          <button onClick={_this.setEndTime} className="pure-button button-add">Set End Time</button>
          <span>{pos.end_time ? pos.end_time : "Not Set"}</span>
        </section>
      </div>

    );
  }
});

export default PossessionEditor;