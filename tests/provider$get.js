module.exports = {
  name: "Provider $get",
  tests: [
  {
    name: "No dependencies",
    input: function(){
      myMod.provider("foo", function() {
          this.$get = function() {
              bar;
          };
      });
    },
    expected: function(){
      myMod.provider("foo", function() {
          this.$get = function() {
              bar;
          };
      });
    }
  },
  {
    name: "Simple { $get }",
    input: function(){
      myMod.provider("foo", {
          $get: function() {
              bar;
          }
      });
      myMod.provider("foo", {
          $get: function($scope, $timeout) {
              bar;
          }
      });
      myMod.provider("foo", {
          "$get": function($scope, $timeout) {
              bar;
          }
      });
      myMod.provider("foo", {
          '$get': function($scope, $timeout) {
              bar;
          }
      });
    },
    expected: function(){
      myMod.provider("foo", {
          $get: function() {
              bar;
          }
      });
      myMod.provider("foo", {
          $get: ["$scope", "$timeout", function($scope, $timeout) {
              bar;
          }]
      });
      myMod.provider("foo", {
          "$get": ["$scope", "$timeout", function($scope, $timeout) {
              bar;
          }]
      });
      myMod.provider("foo", {
          '$get': ["$scope", "$timeout", function($scope, $timeout) {
              bar;
          }]
      });
    }
  },
  {
    name: "Simple this.$get",
    input: function(){
      myMod.provider("foo", function() {
          this.$get = function() {
              bar;
          };
      });
      myMod.provider("foo", function(x) {
          this.$get = function(a,b) {};
      });
    },
    expected: function(){
      myMod.provider("foo", function() {
          this.$get = function() {
              bar;
          };
      });
      myMod.provider("foo", ["x", function(x) {
          this.$get = ["a", "b", function(a,b) {}];
      }]);
    }
  },
  {
    name: "Simple return { $get }",
    input: function(){
      myMod.provider("foo", function() {
          return {
              $get: function($scope, $timeout) {
                  bar;
              }};
      });
      myMod.provider("foo", function() {
          return {
              $get: function() {
                  bar;
              }};
      });
    },
    expected: function(){
      myMod.provider("foo", function() {
          return {
              $get: ["$scope", "$timeout", function($scope, $timeout) {
                  bar;
              }]};
      });
      myMod.provider("foo", function() {
          return {
              $get: function() {
                  bar;
              }};
      });
    }
  },
  {
    name: "this.$get w/ reference-following",
    input: function(){
      myMod.provider("foo", function($scope) {
          this.$get = function($scope, $timeout) {
              bar;
          };
          self.$get = function($scope) {};
          that.$get = function($scope) {};
          ignore.$get = function($scope) {};
      });
    },
    expected: function(){
      myMod.provider("foo", ["$scope", function($scope) {
          this.$get = ["$scope", "$timeout", function($scope, $timeout) {
              bar;
          }];
          self.$get = ["$scope", function($scope) {}];
          that.$get = ["$scope", function($scope) {}];
          ignore.$get = function($scope) {};
      }]);
    }
  },
  {
    name: "this.$get w/ reference-following and hoisting",
    input: function(){
      myMod.provider("foo", extprov);
      function extprov(x) {
          this.$get = function(a,b) {};
          this.$get = fooget;
          this.$get = inner;

          function inner(c, d) {
          }
      }

      function fooget(b) {
          this.$get = fooget2;
      }

      function fooget2(c) {
      }
    },
    expected: function(){
      fooget2.$inject = ["c"];
      fooget.$inject = ["b"];
      extprov.$inject = ["x"];

      myMod.provider("foo", extprov);
      function extprov(x) {
          inner.$inject = ["c", "d"];

          this.$get = ["a", "b", function(a,b) {}];
          this.$get = fooget;
          this.$get = inner;

          function inner(c, d) {
          }
      }

      function fooget(b) {
          this.$get = fooget2;
      }

      function fooget2(c) {
      }
    }
  },
  // {
  //   name: "",
  //   input: function(){

  //   },
  //   expected: function(){

  //   }
  // },

  ]
};