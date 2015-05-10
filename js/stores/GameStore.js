import alt from '../alt';
import db from './db';
// import TodoActions from '../TodoActions'
 
class GameStore {
  constructor() {
    // this.bindListeners({
    //   updateTodo: TodoActions.updateTodo
    // });
    this.games = [];
    var _this = this;
    db.find({type: 'game'}, function(err, docs) {
      if (docs.length === 0) {
        db.insert([ {type: 'game', opponent: 'AT Squad', points_scored: 10, opponent_points_scored: 20},
                    {type: 'game', opponent: 'The Tropics', points_scored: 40, opponent_points_scored: 70},
                    {type: 'game', opponent: 'Delta Chi', points_scored: 20, opponent_points_scored: 40}], function(err, newDocs) {
          _this.games = newDocs;
        });
      } else {
        _this.games = docs;
      }
    });
  }

  gameWithId(id) {
    db.findOne({_id: id}, function(err, docs) {
      return docs;
    });
    return false;
  }
 
  // updateTodo({ id, text }) {
  //   const todos = this.todos;
 
  //   todos[id] = todos[id] || {};
  //   todos[id].text = text;
 
  //   this.setState({ todos });
  // }
}
 
export default alt.createStore(GameStore, 'GameStore');