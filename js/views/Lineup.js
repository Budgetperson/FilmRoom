import React from 'react';
import PlayerStore from '../stores/PlayerStore.js';
import PlayerActions from '../actions/PlayerActions.js';
import PossessionStore from '../stores/PossessionStore.js';

let Lineup = React.createClass({
  getInitialState() {
    return { lineup_data: []}
  },

  componentDidMount() {
    PossessionStore.getLineupData((data) => {
      this.setState({ lineup_data: data });
    });
  },

  componentWillUnmount() {
    PlayerStore.unlisten(this.onChange);
  },

  render() {
    return (
      <table id="lineups" className="pure-table pure-table-bordered">
        <thead>
          <tr>
            <th>Lineup</th>
            <th>Minutes</th>
            <th>PPP</th>
            <th>OPP PPP</th>
            <th>DREB%</th>
            <th>OREB%</th>
            <th>REB%</th>
            <th>TOV%</th>
          </tr>
        </thead>
        <tbody>
          {this.state.lineup_data.map((lineup) => {
            return (
              <tr key={lineup.names}>
                <td>{lineup.names.join(", ")}</td>
                <td>{(lineup.minutes / 60).toFixed(2)}</td>
                <td>{lineup.ppp}</td>
                <td>{lineup.opponent_ppp}</td>
                <td>{lineup.defensive_rebound_percentage}</td>
                <td>{lineup.offensive_rebound_percentage}</td>
                <td>{lineup.rebound_percentage}</td>
                <td>{lineup.turnover_percentage}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

    );
  }
});

export default Lineup; 