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

}

export default Logic;