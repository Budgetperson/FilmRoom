import React from 'react';
import YouTube from 'react-youtube';
import GameStore from '../stores/GameStore.js';
import PossessionStore from '../stores/PossessionStore.js';
import PossessionActions from '../actions/PossessionActions';
let PossessionEditor = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {

  },

  componentWillUnmount() {
  },

  render() {
    var pos = this.props.possession;
    return (
      <h1>Possession {pos.number}</h1>
    );
  }
});

export default PossessionEditor;