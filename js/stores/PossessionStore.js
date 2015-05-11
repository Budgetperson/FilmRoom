import alt from '../alt';
import db from './db';
import PlayerActions from '../actions/PlayerActions';
 
class PosessionStore {
  constructor() {
    // this.bindListeners({
    //   deletePlayer: PlayerActions.deletePlayer
    // });
    this.possessions = [];
    var _this = this;
    db.find({type: 'possession'}, function(err, docs) {
      if (docs.length === 0) {
      } else {
        _this.posessions = docs;
      }
    });
  }

  static possessionsFromGame(game_id) {
    db.find({type: 'possession', game_id: game_id}, function(err, docs) {
      return docs;
    });
  }

}
 
export default alt.createStore(PosessionStore, 'PossessionStore');