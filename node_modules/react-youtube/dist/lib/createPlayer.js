"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/**
 * Module dependencies
 */

var load = _interopRequire(require("require-sdk"));

var assign = _interopRequire(require("object-assign"));

var getYouTubeId = _interopRequire(require("get-youtube-id"));

/**
 * Create a new `player` by requesting and using the YouTube Iframe API
 *
 * @param {Object} props
 *   @param {String} url - url to be loaded
 *   @param {String} id - id of div container
 *   @param {Object} playerVars - https://developers.google.com/youtube/player_parameters
 *
 * @param {Function} cb
 */

var createPlayer = function (props, cb) {
  var sdk = loadApi();

  var params = assign({}, props.opts, {
    videoId: getYouTubeId(props.url)
  });

  return sdk(function (err) {
    // need to handle err better.
    if (err) {
      console.error(err);
    }

    return cb(new window.YT.Player(props.id, params));
  });
};

/**
 * Load the YouTube API
 *
 * @returns {Function}
 */

var loadApi = function () {
  var sdk = load("https://www.youtube.com/iframe_api", "YT");
  var loadTrigger = sdk.trigger();

  /**
   * The YouTube API requires a global ready event handler.
   * The YouTube API really sucks.
   */

  window.onYouTubeIframeAPIReady = function () {
    loadTrigger();
    delete window.onYouTubeIframeAPIReady;
  };

  return sdk;
};

/**
 * Expose `createPlayer`
 */

module.exports = createPlayer;