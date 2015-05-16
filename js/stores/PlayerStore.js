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
                    {type: 'player', name: 'Jonathan Ibers'},
                    {type: 'player', name: 'Sajid Leelani'},
                    {type: 'player', name: 'Siddharth Kumar'},
                    {type: 'player', name: 'Brian Hoang'},
                    {type: 'player', name: 'Tariq Zahroof'},
                    {type: 'player', name: 'Nimish Kumar'},
                    {type: 'player', name: 'Nishan Gajjar'},
                    {type: 'player', name: 'Darshil Choksi'}], function(err, newDocs) {
          _this.players = newDocs;
        });
      } else {
        _this.players = docs;
      }
    });
  }

  deletePlayer(id) {
    //console.log("here");
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