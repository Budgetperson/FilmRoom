var alt = require('../alt');

class GameActions {
  setCurrentPossession(game_id, possession_id) {
    this.dispatch({game_id, possession_id});
  }
}

export default alt.createActions(GameActions);