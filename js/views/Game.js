require("array.prototype.find");
import React from 'react';
import YouTube from 'react-youtube';
import GameStore from '../stores/GameStore.js';
import PossessionStore from '../stores/PossessionStore.js';
import PossessionActions from '../actions/PossessionActions';
import GameActions from '../actions/GameActions';
import PossessionEditor from './PossessionEditor';

let Game = React.createClass({
  getInitialState() {
    var id = this.props.params.id;
    var game_properties = GameStore.getState().games.find(game => game._id == id);
    var possessions = PossessionStore.getState().possessions[id] || [];
    return {
      game_info: game_properties,
      possessions: possessions
    };
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
    this.setState({possessions: PossessionStore.getState().possessions[id] || [] }, function() {
      console.log("fuck");
      console.log(this.state);
    });
  },

  onChange(state) {
    console.log("trololol");
    console.log(this.state);
    var id = this.props.params.id;
    this.setState({game_info: state.games.find(game => game._id == id) });
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
    var possession_view;
    if(current_possession_id !== undefined) {
      var current_possession = this.state.possessions.find(pos => pos._id == current_possession_id);
      possession_view = <PossessionEditor possession={current_possession} />;
    } else {
      possession_view = <h3>No Posession Selected</h3>;
    }

    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        enablejsapi: 1,
        listType: 'playlist',
        list: 'PLh8e-_BCEBVlZc6ANlajflKB4rhxt6dMT'
      }
    };

    var player_select = (
      <select>
        <option value="Yash Aggarwal">Yash</option>
        <option value="Quinn McNamara">Quinn</option>
        <option value="Nimish Kumar">Nishan</option>
        <option value="Nishan Gajjar">Nimish</option>
        <option value="Siddharth Kumar">Siddharth</option>
        <option value="Tariq Zahroof">Tariq</option>
        <option value="Brian Hoang">Brian</option>
        <option value="Darshil Choksi">Darshil</option>
      </select>
    );

    var player_selects = [];
    for(var i = 0; i < 5; ++i) {
      player_selects.push(<li>{player_select}</li>);
    }
    var _this = this;
    return (
      <div className="pure-g">
        <div className="pure-u-1-2">
          <YouTube id="player" opts={opts} />
          <h3>Possessions</h3>
          <ul id="possession_list">
            {this.state.possessions.map(function(pos) {
              return (<li onClick={_this.setCurrentPossession.bind(_this, pos._id)} key={pos._id}>Possession {pos.number}</li>)
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