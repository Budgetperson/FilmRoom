import alt from '../alt';
import db from './db';
import PlayerActions from '../actions/PlayerActions';
 
class PlayerStore {
  constructor() {
    this.bindListeners({
      deletePlayer: PlayerActions.deletePlayer
    });
    this.players = [];
    var _this = this;
    db.find({type: 'player'}, function(err, docs) {
      if (docs.length === 0) {
        db.insert([ {type: 'player', name: 'Yash Aggarwal'},
                    {type: 'player', name: 'Quinn McNamara'},
                    {type: 'player', name: 'Eamon Dowd'},
                    {type: 'player', name: 'Akshay Daga'},
                    {type: 'player', name: 'Tej Singh'},
                    {type: 'player', name: 'Nicolas Lavigne'},
                    {type: 'player', name: 'Sam Allen'},
                    {type: 'player', name: 'Subbu Kumar'},
                    {type: 'player', name: 'Sajid Leelani'}], function(err, newDocs) {
          _this.players = newDocs;
          _this.emitChange();
        });
      } else {
        _this.players = docs;
        _this.emitChange();
      }
    });
  }

  deletePlayer(id) {
    var _this = this;
    db.remove({ _id: id }, {}, function(err, numRemoved) {
      _this.updatePlayers();
    });
    return false;
  }

  updatePlayers() {
    var _this = this;
    db.find({type: 'player'}, function(err, docs) {
      _this.players = docs;
      _this.emitChange();
    });
    return false;
  }

}
 
export default alt.createStore(PlayerStore, 'PlayerStore');