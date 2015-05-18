import React from 'react';
import Router from 'react-router';  
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import PlayersHandler from './views/Players.js';
import GamesHandler from './views/Games.js';
import GameView from './views/Game.js';
import BoxScoreView from './views/BoxScore.js';
import alt from './alt.js';
import db from './stores/db.js';

let App = React.createClass({
  render() {
    return (
      <div>
        <div className="nav pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading">Film Room</a>
          <ul className="pure-menu-list">
            <li className="pure-menu-item"><Link className="pure-menu-link" to="app">Home</Link></li>
            <li className="pure-menu-item"><Link className="pure-menu-link" to="players">Players</Link></li>
            <li className="pure-menu-item"><Link className="pure-menu-link" to="games">Games</Link></li>
          </ul>
        </div>
        <RouteHandler/>
      </div>
    );
  }
});

let routes = (  
  <Route name="app" path="/" handler={App}>
    <Route name="players" path="/players" handler={PlayersHandler}/>
    <Route name="games" path="/games" handler={GamesHandler} />
    <Route name="game" path="/game/:id" handler={GameView} />
    <Route name="box" path="/box/:id" handler={BoxScoreView} />
  </Route>
);

db.loadDatabase(function(err) {
  Router.run(routes, function (Handler) {  
    React.render(<Handler/>, document.body);
  });
});
