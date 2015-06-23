import React from 'react';
import PossessionStore from '../stores/PossessionStore.js';
import PlayerActions from '../actions/PlayerActions.js';
var _ = require("lodash");

let GameFlow = React.createClass({
  getInitialState() {
    return { ready: false, points: [] };
  },

  componentDidMount() {
    var _this = this;

    PossessionStore.getGraphPoints(this.props.params.id, (data) => {
      this.setState({ points: data }, function() {
        google.load('visualization', '1', {packages: ['corechart', 'line'], callback:
          function() {
            _this.drawChart();
          }
        });
      });
    });
  },

  drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Us');
      data.addColumn('number', 'Them');
      data.addColumn('number', 'Difference');
      data.addRows(this.state.points);
      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Points'
        },
      };

      var chart = new google.visualization.LineChart(document.getElementById('graph'));
      chart.draw(data, options);
  },

  render() {
    return (
      <div id="graph">Loading...</div>
    );
  }
});

export default GameFlow; 