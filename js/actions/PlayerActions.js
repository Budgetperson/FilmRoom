var alt = require('../alt');

class PlayerActions {
  deletePlayer(id) {
    this.dispatch(id);
  }
}

export default alt.createActions(PlayerActions);