var alt = require('../alt');

class PossessionActions {
  addPossession(game_id, existing_possessions) {
    this.dispatch({game_id, existing_possessions});
  }

  updatePossession(possession, update) {
    this.dispatch({possession, update})
  }
}

export default alt.createActions(PossessionActions);