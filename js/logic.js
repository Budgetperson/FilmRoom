import PlayerStore from './stores/PlayerStore';
require("array.prototype.find");

class Logic {
  static reboundOpportunityExists(possession) {
    return (possession.shot_made === false && possession.fta === 0) ||
            possession.fta > possession.ftm;
  }

  static reboundOccurred(possession) {
    return possession.rebound_type.length > 0;
  }

  static reboundByUs(possession) {
    // lol shitty-ish
    return this.reboundOpportunityExists(possession) && 
          (possession.rebound_type[0] === possession.possession_type[0]);
  }
  static reboundByThem(possession) {
    // lol shitty-ish
    return this.reboundOpportunityExists(possession) &&
          !this.reboundByUs(possession);
  }

  static nextPosessionTypeIsOffensive(previous_possession) {
    return this.reboundByUs(previous_possession) || 
          (previous_possession.rebound_type === "" && this.defensivePossession(previous_possession));
  }

  static nextPossessionType(previous_possession) {
    return this.nextPosessionTypeIsOffensive(previous_possession) ? 'offense' : 'defense';
  }

  static offensivePossession(possession) {
    return possession.possession_type === "offense";
  }

  static defensivePossession(possession) {
    return possession.possession_type === "defense";
  }

  static points(possession) {
    var result = 0;
    if(possession.shot_made) result += Number(possession.shot_attempt_value);
    result += Number(possession.ftm);
    return result;
  }

  static turnoverPercentage(possessions) {
    var all_offensive_possessions = possessions.filter(p => this.offensivePossession(p)) || [];
    if(all_offensive_possessions.length === 0) { return 0; }
    var turnover_possessions = all_offensive_possessions.filter(p => p.turnover === true ) || [];
    return ((turnover_possessions.length / all_offensive_possessions.length) * 100).toFixed(2);
  }

  static reboundPercentage(possessions) {
    if(possessions.length === 0) return 0;
    var opportunities = 0;
    var rebounds = 0;
    var _this = this;
    possessions.forEach(function(pos) {
      if(_this.reboundOccurred(pos)) {
        opportunities++;
        if(_this.reboundByUs(pos)) rebounds++;
      }
    });
    return ((rebounds / opportunities) * 100).toFixed(2);
  }

  static timeOfPossession(possession) {
    return Number(possession.end_time) - Number(possession.start_time);
  }

  static defensiveReboundingPercentage(possessions) {
    if(possessions.length === 0) return 0;
    var opportunities = 0;
    var rebounds = 0;
    var _this = this;
    possessions.forEach(function(pos) {
      if(_this.reboundOccurred(pos) && _this.defensivePossession(pos)) {
        opportunities++;
        if(_this.reboundByUs(pos)) rebounds++;
      }
    });
    return ((rebounds / opportunities) * 100).toFixed(2);
  }

  static offensiveReboundingPercentage(possessions) {
    if(possessions.length === 0) return 0;
    var opportunities = 0;
    var rebounds = 0;
    var _this = this;
    possessions.forEach(function(pos) {
      if(_this.reboundOccurred(pos) && _this.offensivePossession(pos)) {
        opportunities++;
        if(_this.reboundByUs(pos)) rebounds++;
      }
    });
    return ((rebounds / opportunities) * 100).toFixed(2);
  }


  static opponentPoints(possessions) {
    var _this = this;
    var all_defensive_possessions = possessions.filter(p => this.defensivePossession(p)) || [];
    return all_defensive_possessions.reduce(function(prev, current) {
      return prev + _this.points(current);
    }, 0);
  }

  static ourPoints(possessions) {
    var _this = this;
    var all_offensive_possessions = possessions.filter(p => this.offensivePossession(p)) || [];
    return all_offensive_possessions.reduce(function(prev, current) {
      return prev + _this.points(current);
    }, 0);
  }


  static createGraphPoints(possessions) {
    var our_points = 0;
    var opponent_points = 0;
    var time_baseline = 0;
    var _this = this;
    var result = possessions.map(function(possession, index, array) {
      if(index > 0 && array[index - 1].end_time > possession.end_time) time_baseline = array[index - 1].end_time;
      if(_this.offensivePossession(possession)) {
        our_points += _this.points(possession);
      } else {
        opponent_points += _this.points(possession);
      }
      var differential = our_points - opponent_points;
      return [time_baseline + Number(possession.end_time), our_points, opponent_points, differential];
      // return [time_baseline, differential];
    });
    result.unshift([0,0,0,0]);
    return result;
  }

  static opponentPointsOffTurnovers(possessions) {
    var points_off_turnovers = 0;
    var _this = this;
    possessions.forEach(function(possession, index, array) {
      var previous_possession = array[index - 1];
      if(previous_possession &&
        _this.offensivePossession(previous_possession) &&
        previous_possession.turnover === true &&
        _this.defensivePossession(possession)) {
          points_off_turnovers += _this.points(possession);
      }
    });
    return points_off_turnovers;
  }

  static opponentSecondChancePoints(possessions) {
    var second_chance_points = 0;
    var _this = this;
    possessions.forEach(function(possession, index, array) {
      var previous_possession = array[index - 1];
      if(previous_possession &&
        _this.defensivePossession(previous_possession) &&
        previous_possession.rebound_type === "oreb" &&
        _this.defensivePossession(possession)) {
          second_chance_points += _this.points(possession);
      }
    });
    return second_chance_points;
  }

  static ourSecondChancePoints(possessions) {
    var second_chance_points = 0;
    var _this = this;
    possessions.forEach(function(possession, index, array) {
      var previous_possession = array[index - 1];
      if(previous_possession &&
        _this.offensivePossession(previous_possession) &&
        previous_possession.rebound_type === "oreb" &&
        _this.offensivePossession(possession)) {
          second_chance_points += _this.points(possession);
      }
    });
    return second_chance_points;
  }

  static numberOfSquashedPosessions(possessions, us) {
    var _this = this;
    var func = us ? this.offensivePossession : this.defensivePossession;
    return possessions
            .filter(p => func(p))
            .reduce(function(prev, current) {
              if(current.rebound_type == "oreb") {
                return prev;
              } else {
                return ++prev;
              }
            }, 0);
  }
  static numberOfShots(possessions, us) {
    var _this = this;
    var func = us ? this.offensivePossession : this.defensivePossession;
    return possessions
            .filter(p => func(p))
            .reduce(function(prev, current) {
              if(current.turnover) {
                return prev;
              } else {
                return ++prev;
              }
            }, 0);
  }


  static squashedPointsPerPossession(possessions, us) {
    var _this = this;
    var points = _.bind(us ? this.ourPoints : this.opponentPoints, this);
    return points(possessions) / this.numberOfSquashedPosessions(possessions, us);
  }

  static pointsPerPossession(possessions, us) {
    var func = us ? this.offensivePossession : this.defensivePossession;
    var numberPossessions = possessions.filter(p => func(p)).length
    var pointsFunction = _.bind(us ? this.ourPoints : this.opponentPoints, this);
    return pointsFunction(possessions) / numberPossessions;
  }

  static pointsPerShot(possessions, us) {
    var _this = this;
    var points = _.bind(us ? this.ourPoints : this.opponentPoints, this);
    return points(possessions) / this.numberOfShots(possessions, us);
  }

  static opponentStats(possessions) {
    var _this = this;
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
        rebounds: 0,
      };
    possessions.forEach(function(possession) {
      if(_this.defensivePossession(possession)) {
        if(possession.turnover) {
          // Tabulate Turnovers
          box_score_info.turnovers++;
        } else {
          // Tabulate traditional box scores
          box_score_info["fga"]++;
          if(possession.shot_made) box_score_info["fgm"]++;
          if(possession.shot_attempt_value === 3) box_score_info["threepa"]++;
          if(possession.shot_made && possession.shot_attempt_value === 3) box_score_info["threepm"]++;
          box_score_info["fta"] += Number(possession.fta);
          if(possession.fta > 0 && !possession.shot_made) {
            box_score_info["fga"]--;
            if(possession.shot_attempt_value == 3) box_score_info["threepa"]--;
          }
          box_score_info["ftm"] = Number(box_score_info["ftm"]) + Number(possession.ftm);
          if(possession.assist !== "") box_score_info["assists"]++;
        }
      }

      // Tabulate Rebounds
      if(_this.reboundByThem(possession)) {
        if(possession.rebounder) box_score_info["rebounds"]++;
      }
      box_score_info.points = (box_score_info.fgm * 2) + (box_score_info.threepm) + box_score_info.ftm;
      box_score_info.ts = (box_score_info.points) / (2 * (box_score_info.fga + 0.5 * box_score_info.fta));
    });
    return box_score_info;
  }

  static minutes(possessions) {
    return possessions.reduce((prev, current) => {
      return prev + this.timeOfPossession(current);
    }, 0);
  }

  static byLineup(possessions) {
    var sorted = possessions.map(function(pos) {
      pos.lineup = pos.lineup.sort();
      return pos;
    });

    return _.values(_.groupBy(sorted, function(pos) { return pos.lineup; }));
  }

  static lineupData(raw_possessions) {
    var possessions_grouped = this.byLineup(raw_possessions);
    var players = _.indexBy(PlayerStore.getState().players, '_id');

    return possessions_grouped.map((possessions) => {
      return {
        names: possessions[0].lineup.map((player) => players[player].name),
        minutes: this.minutes(possessions),
        defensive_rebound_percentage: this.defensiveReboundingPercentage(possessions),
        offensive_rebound_percentage: this.offensiveReboundingPercentage(possessions),
        rebound_percentage: this.reboundPercentage(possessions),
        turnover_percentage: this.turnoverPercentage(possessions),
        ppp: this.pointsPerPossession(possessions, true).toFixed(3),
        opponent_ppp: this.pointsPerPossession(possessions, false).toFixed(3),
        possessions: possessions
      };
    });
  }

  static onOffStats(player_id, raw_possessions) {
    var grouped = _.groupBy(raw_possessions, (pos) => {
      if(_.indexOf(pos.lineup, player_id) === -1) {
        return "off";
      } else {
        return "on";
      }
    });

    return _.mapValues(grouped, (possessions) => {
      return {
        player_id: player_id,
        minutes: this.minutes(possessions),
        defensive_rebound_percentage: this.defensiveReboundingPercentage(possessions),
        offensive_rebound_percentage: this.offensiveReboundingPercentage(possessions),
        rebound_percentage: this.reboundPercentage(possessions),
        turnover_percentage: this.turnoverPercentage(possessions),
        ppp: this.squashedPointsPerPossession(possessions, true).toFixed(3),
        opponent_ppp: this.squashedPointsPerPossession(possessions, false).toFixed(3)
      }
    });
  }

}

export default Logic;