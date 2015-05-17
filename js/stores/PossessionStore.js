import alt from '../alt';
import db from './db';
import PlayerActions from '../actions/PlayerActions';
import PossessionActions from '../actions/PossessionActions';

class PossessionStore {
  constructor() {
    this.bindListeners({
      addPossession: PossessionActions.addPossession,
      updatePossession: PossessionActions.updatePossession
    });
    this.possessions = {};
    var _this = this;
    // todo bug fixme: bootstrap the possessions
    // db.find({type: 'possession'}, function(err, docs) {
    //   if (docs.length === 0) {
    //   } else {
    //     _this.possessions = docs;
    //   }
    // });
  }

  addPossession({game_id, existing_possessions}) {
    // todo prefill lineup from previous possession
    var _this = this;
    db.findOne({game_id: game_id, type: 'possession', number: existing_possessions}, function(err, doc) {
      var lineup = ["", "", "", "", ""];
      if(doc !== null) {
        lineup = doc.lineup;
      }
      var new_possession = {
        type: 'possession',
        game_id: game_id,
        number: existing_possessions + 1,
        lineup: lineup,
        ftm: 0,
        fta: 0,
        shot_by: "",
        assist: ""
      };
      db.insert(new_possession, function(err, new_doc) {
        _this.updatePossessionsForGame(game_id);
      });
    });
    return false;
  }

  updatePossession({possession, update}) {
    var _this = this;
    db.update({ _id: possession._id }, update, {}, function() {
      _this.updatePossessionsForGame(possession.game_id);
    });
    return false;
  }

  updatePossessionsForGame(game_id) {
    var _this = this;
    // todo sort first by time start, then by possession #
    db.find({type: 'possession', game_id: game_id}).sort({number: 1}).exec(function(err, docs) {
      console.log(docs);
      _this.possessions[game_id] = docs;
      _this.emitChange();
    });
    return false;
  }

}
 
export default alt.createStore(PossessionStore, 'PossessionStore');