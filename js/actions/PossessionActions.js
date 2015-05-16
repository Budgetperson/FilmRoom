var alt = require('../alt');

class PossessionActions {
  addPossession(game_id, existing_possessions) {
    this.dispatch({game_id, existing_possessions});
  }
}

export default alt.createActions(PossessionActions);