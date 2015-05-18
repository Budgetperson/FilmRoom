import alt from '../alt';
import db from './db';
import PlayerActions from '../actions/PlayerActions';
import PossessionActions from '../actions/PossessionActions';
import PlayerStore from './PlayerStore';
var _ = require("lodash");

class PossessionStore {
  constructor() {
    this.bindListeners({
      addPossession: PossessionActions.addPossession,
      updatePossession: PossessionActions.updatePossession
    });
    this.possessions = {};
    var _this = this;
    //todo bug fixme: bootstrap the possessions
    db.find({type: 'possession'}).sort({game_id: 1, number: 1}).exec(function(err, docs) {
      if (docs.length === 0) {
      } else {
        docs.forEach(function(pos) {
          _this.possessions[pos.game_id] = docs;
        });
      }
    });
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

  // start_time, end_time, lineup, turnover, shot_attempt_value, shot_made,
  // ftm, fta, "shot_by", assist
  // in box: FG make-attmepts, 3PT make-atempts, efg%, FTA-FTM, AST, TO, PTS
  static getBoxScoreInfo(game_id, callback) {
    db.find({type: 'possession', game_id: game_id}).sort({number: 1}).exec(function(err, docs) {
      var result = PlayerStore.getState().players;
      var box_score_info = {
        fgm: 0,
        fga: 0,
        threepa: 0,
        threepm: 0,
        efg: 0,
        fta: 0,
        ftm: 0,
        assists: 0,
        turnovers: 0,
        points: 0
      };
      result.map(function(possession) {
        return _.extend(possession, box_score_info);
      });
      result = _.indexBy(result, '_id');
      docs.forEach(function(possession) {
        if(possession.turnover) {
          var playerCausingTurnover = possession.shot_by;
          result[playerCausingTurnover]["turnovers"]++;
        } else {
          var playerShot = possession.shot_by;
          result[playerShot]["fga"]++;
          if(possession.shot_made) result[playerShot]["fgm"]++;
          if(possession.shot_attempt_value === 3) result[playerShot]["threepa"]++;
          if(possession.shot_made && possession.shot_attempt_value === 3) result[playerShot]["threepm"]++;
          result[playerShot]["fta"] += possession.fta;
          result[playerShot]["ftm"] += possession.ftm;
          if(possession.assist !== "") result[possession.assist]["assists"]++;
        }
      });

      result = _.values(result);
      result.forEach(function(player, index, array) {
        array[index].points = (player.fgm * 2) + (player.threepm) + player.ftm;
        array[index].efg = (player.fgm + 0.5 * player.threepm) / player.fga;
      });

      callback(result);
    });
    return false;
  }

}
 
export default alt.createStore(PossessionStore, 'PossessionStore');