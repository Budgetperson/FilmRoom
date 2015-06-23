require("array.prototype.find");
import React from 'react';
import YouTube from 'react-youtube';
import GameStore from '../stores/GameStore.js';
import PossessionStore from '../stores/PossessionStore.js';
import PossessionActions from '../actions/PossessionActions';
import GameActions from '../actions/GameActions';
import PossessionEditor from './PossessionEditor';
import Utils from '../logic.js';


let Game = React.createClass({
  getInitialState() {
    var id = this.props.params.id;
    var game_properties = GameStore.getState().games.find(game => game._id == id);
    var possessions = PossessionStore.getState().possessions[id] || [];
    if(game_properties === undefined || possessions === undefined) {
      return {
        game_info: {},
        possessions: []
      };
    } else {
      return {
        game_info: game_properties,
        possessions: possessions
      };
    }

  },

  componentDidMount() {
    GameStore.listen(this.onChange);
    PossessionStore.listen(this.onPossessionChange);
  },

  componentWillUnmount() {
    GameStore.unlisten(this.onChange);
    PossessionStore.unlisten(this.onPossessionChange);
  },

  onPossessionChange(state) {
    var id = this.props.params.id;
    this.setState({possessions: PossessionStore.getState().possessions[id] || [] });
  },

  onChange(state) {
    //console.log(state);
    //console.log(this.props.params.id);
    var id = this.props.params.id;
    this.setState({game_info: state.games.find(game => game._id == id) }, function() {
      var current_possession_id = this.state.game_info.current_possession;
      var current_possession = this.state.possessions.find(pos => pos._id == current_possession_id);
      if(current_possession !== undefined) {
        var start_time = current_possession.start_time;
        if(start_time) { window.player.seekTo(start_time, true); }
      }
    });
  },

  addPossession(ev) {
    var existing_possessions = this.state.possessions.length;
    var game_id = this.props.params.id;
    PossessionActions.addPossession(game_id, existing_possessions);
  },

  setCurrentPossession(possession_id, ev) {
    var game_id = this.props.params.id;
    GameActions.setCurrentPossession(game_id, possession_id);
  },

  render() {
    var current_possession_id = this.state.game_info.current_possession;
    var current_possession = this.state.possessions.find(pos => pos._id == current_possession_id);

    var possession_view;
    if(current_possession !== undefined) {
      possession_view = <PossessionEditor possession={current_possession} />;
    } else {
      possession_view = <h3>No Posession Selected</h3>;
    }

    const opts = {
      height: '390',
      width: '640',
      //videoId: 'RsN2d33Do68',
      playerVars: {
        enablejsapi: 1,
        listType: 'playlist',
        list: this.state.game_info.playlist
      }
    };

    var youtube_element;
    if(this.state.game_info.playlist !== undefined) {
      youtube_element = <YouTube id="player" opts={opts} />;
    } else {
      youtube_element = <h2></h2>;
    }

    var _this = this;
    return (
      <div className="pure-g">
        <div className="pure-u-1-2">
          {youtube_element}
          <h3>Possessions</h3>
          <ul id="possession_list">
            {this.state.possessions.map(function(pos) {
              return (<li onClick={_this.setCurrentPossession.bind(_this, pos._id)} key={pos._id}><strong>{pos.possession_type.charAt(0)}</strong> Possession {pos.number}: {pos.start_time.toFixed(1)}, {pos.result ? pos.result : ''}, ftm: {pos.ftm}</li>)
            })}
            <li><button onClick={_this.addPossession} className="pure-button button-add">Add Possession</button></li>
          </ul>
        </div>

        <div className="pure-u-1-2">
          {possession_view}
        </div>
      </div>
    );
  }
});

export default Game;