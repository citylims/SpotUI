(function() {
  'use strict';

  /**
  * @desc directive for audioplayer
  * @example <audio-player></audio-player>
  */

  angular
    .module('jukeboxApp')
    .directive('audioplayer', audioplayer);

  function audioplayer() {
    var directive = {
      restrict: 'E',
      templateUrl: '/templates/audioplayer.html',
      scope: true,
      controller: audioplayerCtrl,
      bindToController: true,
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
    };
  }

  audioplayerCtrl.$inject = ['$scope', '$http', '$timeout', 'JukeService', '$rootScope'];

  function audioplayerCtrl($scope, $http, $timeout, JukeService, $rootScope) {

    var overlayButton = angular.element(document.getElementById("overlayBtn"));
    var iframe = angular.element(document.getElementById("spotifyPlayer"));
    var iframeContainer = angular.element(document.getElementById("iframeContainer"));
    $scope.timeCodes = [];

    init();

    function init() {
      embedIframe();
      fetchPlaylist();
      fetchGradients();
    }

    function embedIframe() {
      //hardcoding this per development
      var embedUrl = "https://embed.spotify.com/?uri=";
      var playlistUri = "spotify%3Auser%3Acitylims%3Aplaylist%3A7Iu50rZxm3R0nciFzISZLd";
      var targetUrl = embedUrl += playlistUri;
      console.log(targetUrl);
      var template = "<iframe src='" + targetUrl + "' width='300' height='80' frameborder='0' allowtransparency='true'></iframe>";
      iframeContainer.append(template);
    }

    function fetchPlaylist() {
      JukeService.getPlaylist().then(function(res) {
        var data = res.data;
        var tracks = data.tracks.items;
        for (var i = 0; i < tracks.length; i++) {
          var track = {
            duration: tracks[i].track.duration_ms,
            artist: tracks[i].track.artists[0].name
          };
        $scope.timeCodes.push(track);
        }
      })
    }

    function fetchGradients() {
      JukeService.getGradients().then(function(res) {
        $scope.gradients = res.data
      })
    }

    function trackCalc(index) {
      var index = index ? index : 0;
      $rootScope.$broadcast('active track', index);

      var duration = $scope.timeCodes[index].duration;

      var soundTrack = $timeout(function() {
        trackCalc(index + 1);
        $timeout.cancel(soundTrack)
        JukeService.palleteRefresh($scope.gradients);
      }, duration);
    }

    $scope.pressPlay = function() {
      overlayButton.css("display", "none");
      $timeout(function(){
        trackCalc();
      }, 1000)
    }

  }

})();
