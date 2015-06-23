import alt from '../alt';
import db from './db';
import PlayerActions from '../actions/PlayerActions';
import PossessionActions from '../actions/PossessionActions';
import PlayerStore from './PlayerStore';
import Utils from '../logic.js';
var _ = require("lodash");
var moment = require("moment");

class PossessionStore {
  constructor() {
    this.bindListeners({
      addPossession: PossessionActions.addPossession,
      updatePossession: PossessionActions.updatePossession
    });
    this.possessions = {};
    var _this = this;

    db.find({type: 'game'}, function(err, docs) {
      docs.forEach(function(game) {
        _this.updatePossessionsForGame(game._id);
      });
    });
  }

  addPossession({game_id, existing_possessions}) {
    // todo prefill lineup from previous possession
    var _this = this;
    db.findOne({game_id: game_id, type: 'possession', number: existing_possessions}, function(err, doc) {
      var lineup = ["", "", "", "", ""];
      var possession_type = "";
      var start_time = null;
      if(doc !== null) {
        lineup = doc.lineup;
        possession_type = Utils.nextPossessionType(doc);
        start_time = doc.end_time;
      }
      var new_possession = {
        type: 'possession',
        game_id: game_id,
        number: existing_possessions + 1,
        lineup: lineup,
        ftm: 0,
        fta: 0,
        shot_by: "",
        assist: "",
        possession_type: possession_type,
        rebound_type: "",
        start_time: start_time
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
        points: 0,
        rebounds: 0,
        plus_minus: 0,
        minutes: 0
      };
      result.map(function(possession) {
        return _.extend(possession, box_score_info);
      });
      result = _.indexBy(result, '_id');
      docs.forEach(function(possession) {
        if(Utils.offensivePossession(possession)) {
          if(possession.turnover) {
            // Tabulate Turnovers
            var playerCausingTurnover = possession.shot_by;
            result[playerCausingTurnover]["turnovers"]++;
          } else {
            // Tabulate traditional box scores
            var playerShot = possession.shot_by;
            result[playerShot]["fga"]++;
            if(possession.shot_made) result[playerShot]["fgm"]++;
            if(possession.shot_attempt_value === 3) result[playerShot]["threepa"]++;
            if(possession.shot_made && possession.shot_attempt_value === 3) result[playerShot]["threepm"]++;
            result[playerShot]["fta"] += Number(possession.fta);
            if(possession.fta > 0 && !possession.shot_made) {
              result[playerShot]["fga"]--;
              if(possession.shot_attempt_value == 3) result[playerShot]["threepa"]--;
            }
            result[playerShot]["ftm"] = Number(result[playerShot]["ftm"]) + Number(possession.ftm);
            if(possession.assist !== "") result[possession.assist]["assists"]++;
          }
        }

        // Tabulate Rebounds
        if(Utils.reboundByUs(possession)) {
          if(possession.rebounder) result[possession.rebounder]["rebounds"]++;
        }

        // Tabulate +/- & minutes
        var factor = Utils.offensivePossession(possession) ? 1 : -1;
        var points_scored = Utils.points(possession);
        var plus_minus = points_scored * factor;
        var time_of_possession = Utils.timeOfPossession(possession);

        possession.lineup.forEach(function(player_id) {
          result[player_id]["plus_minus"] += plus_minus;
          result[player_id]["minutes"] += time_of_possession;
        });
      });

      result = _.values(result);
      result.forEach(function(player, index, array) {
        array[index].points = (player.fgm * 2) + (player.threepm) + player.ftm;
        array[index].efg = (player.fgm + 0.5 * player.threepm) / player.fga;
        // for true shooting %, assume no and1s right now
        array[index].ts = (player.points) / (2 * (player.fga + 0.5 * player.fta));
        array[index].minutes = moment().startOf('day').seconds(player.minutes).format('mm:ss');
      });

      callback(result);
    });
    return false;
  }

  static getStatistics(game_id, callback) {
    db.find({type: 'possession', game_id: game_id}).sort({number: 1}).exec(function(err, docs) {
      var stats = {};
      stats.turnover_percentage = Utils.turnoverPercentage(docs);
      stats.rebound_percentage = Utils.reboundPercentage(docs);
      stats.defensive_rebounding_percentage = Utils.defensiveReboundingPercentage(docs);
      stats.offensive_rebounding_percentage = Utils.offensiveReboundingPercentage(docs);
      stats.opponent_points = Utils.opponentPoints(docs);
      stats.opponent_points_off_turnovers = Utils.opponentPointsOffTurnovers(docs);
      stats.opponent_second_chance_points = Utils.opponentSecondChancePoints(docs);
      stats.our_second_chance_points = Utils.ourSecondChancePoints(docs);
      stats.our_squashed_possessions = Utils.numberOfSquashedPosessions(docs, true);
      stats.our_squashed_ppp = Utils.squashedPointsPerPossession(docs, true).toFixed(3);
      stats.opponent_squashed_possessions = Utils.numberOfSquashedPosessions(docs, false);
      stats.opponent_squashed_ppp = Utils.squashedPointsPerPossession(docs, false).toFixed(3);
      callback(stats);
    });
    return false;
  }

  static getOpponentStatistics(game_id, callback) {
    db.find({type: 'possession', game_id: game_id}).sort({number: 1}).exec(function(err, docs) {
      callback(Utils.opponentStats(docs));
    });
    return false;
  }

  static getGraphPoints(game_id, callback) {
    db.find({type: 'possession', game_id: game_id}).sort({number: 1}).exec(function(err, docs) {
      callback(Utils.createGraphPoints(docs));
    });
    return false;
  }

  static getLineupData(callback) {
    db.find({type: 'possession'}).exec((err, docs) => {
      callback(Utils.lineupData(docs));
    });
  }

  static getOnOffData(player_id, callback) {
    db.find({type: 'possession'}).exec((err, docs) => {
      callback(Utils.onOffStats(player_id, docs));
    });
  }

}
 
export default alt.createStore(PossessionStore, 'PossessionStore');