require("array.prototype.find");
import React from 'react';
import YouTube from 'react-youtube';
import GameStore from '../stores/GameStore.js';
import PossessionStore from '../stores/PossessionStore.js';

let Game = React.createClass({
  getInitialState() {
    var id = this.props.params.id;
    var game_properties = GameStore.getState().games.find(game => game._id == id);
    var possessions = PossessionStore.possessionsFromGame(id);
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
    this.setState({possessions: PossessionStore.possessionsFromGame(id) });
  },

  onChange(state) {
    var id = this.props.params.id;
    this.setState({game_info: state.games.find(game => game._id == id) });
  },

  render() {
    //console.log(this.state.players);
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
        <option value="Yash Aggarwal">Yash Aggarwal</option>
        <option value="Quinn McNamara">Quinn McNamara</option>
        <option value="Nimish Kumar">Nishan Gajjar</option>
        <option value="Nishan Gajjar">Nimish Kumar</option>
        <option value="Siddharth Kumar">Siddharth Kumar</option>
        <option value="Tariq Zahroof">Tariq Zahroof</option>
        <option value="Brian Hoang">Brian Hoang</option>
        <option value="Darshil Choksi">Darshil Choksi</option>
      </select>
    );

    var player_selects = [];
    for(var i = 0; i < 5; ++i) {
      player_selects.push(<li>{player_select}</li>);
    }
    return (
      <div className="pure-g">
        <div className="pure-u-1-2">
          <YouTube id="player" opts={opts} />
          <h3>Possessions</h3>
          <ul id="possession_list">
            <li className="selected">Possession 1: 0:46-0:50</li>
            <li>Possession 2: 0:46-0:50</li>
            <li>Possession 3: 0:46-0:50</li>
            <li>Possession 4: 0:46-0:50</li>
            <li>Possession 5: 0:46-0:50</li>
            <li>Possession 6: 0:46-0:50</li>
            <li><button className="pure-button button-add">Add Possession</button></li>
          </ul>
        </div>

        <div className="pure-u-1-2">
          <section id="start_time">
            <button className="pure-button button-add">Click to Start</button>
            <span>8:04</span>
          </section>

          <section id="lineup">
            <ul id="lineup">
              {player_selects}
            </ul>
          </section>
        </div>
      </div>
    );
  }
});

export default Game;