(function() {

'use strict';

angular
  .module('jukeboxApp')
  .controller('JukeCtrl', JukeCtrl);

  JukeCtrl.$inject['$scope', "$http", "Spotify", "JukeService"];

  function JukeCtrl($scope, $http, Spotify, JukeService) {

    init();

    function init() {
      fetchPlaylist()
    }

    function fetchPlaylist() {
      JukeService.getPlaylist().then(function(res) {
        $scope.playlist = res.data.tracks.items;
      });
    }

    $scope.searchArtist = function () {
      Spotify.search($scope.searchartist, 'artist').then(function (data) {
        $scope.artists = data.artists.items;
      });
    };

  };//JukeCtrl
})();
