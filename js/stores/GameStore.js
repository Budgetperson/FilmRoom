import alt from '../alt';
import db from './db';
import GameActions from '../actions/GameActions';
import PossessionActions from '../actions/PossessionActions';
 
class GameStore {
  constructor() {
    this.bindListeners({
      setCurrentPossession: GameActions.setCurrentPossession
    });
    this.games = [];
    var _this = this;
    db.find({type: 'game'}, function(err, docs) {
      if (docs.length === 0) {
        db.insert([ {type: 'game', opponent: 'Rack City', points_scored: 10, opponent_points_scored: 20, playlist: 'PLh8e-_BCEBVm8R5csC3z5qsmSsO83B5fC'},
                    {type: 'game', opponent: 'The Tropics', points_scored: 40, opponent_points_scored: 70, playlist: 'PLh8e-_BCEBVlZc6ANlajflKB4rhxt6dMT'},
                    {type: 'game', opponent: 'Delta Chi', points_scored: 20, opponent_points_scored: 40, playlist: 'PLh8e-_BCEBVnmqkZw6gsSgVMvySPezV4C'}], function(err, newDocs) {
          _this.games = newDocs;
          _this.emitChange();
        });
      } else {
        _this.games = docs;
        _this.emitChange();
      }
    });
  }

  setCurrentPossession({game_id, possession_id}) {
    var _this = this;
    db.update({_id: game_id}, { $set: {current_possession: possession_id} }, {}, function() {
      _this.update();
    });
    return false;
  }

  update() {
    // lol what is performance anyways
    var _this = this;
    db.find({type: 'game'}, function(err, docs) {
      _this.games = docs;
      _this.emitChange();
    });
    return false;
  }

  gameWithId(id) {
    db.findOne({_id: id}, function(err, docs) {
      return docs;
    });
    return false;
  }
 
  // updateTodo({ id, text }) {
  //   const todos = this.todos;
 
  //   todos[id] = todos[id] || {};
  //   todos[id].text = text;
 
  //   this.setState({ todos });
  // }
}
 
export default alt.createStore(GameStore, 'GameStore');