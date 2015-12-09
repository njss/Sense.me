(function(){
    var app = angular.module('store-directives', []);

    app.directive("./templates/productDescription", function() {
      return {
        restrict: 'E',
        templateUrl: "./templates/product-description.html"
      };
    });

    app.directive("./templates/productReviews", function() {
      return {
        restrict: 'E',
        templateUrl: "./templates/product-reviews.html"
      };
    });

    app.directive("productSpecs", function() {
      return {
        restrict:"A",
        templateUrl: "./templates/product-specs.html"
      };
    });

    app.directive("productTabs", function() {
      return {
        restrict: "E",
        templateUrl: "./templates/product-tabs.html",
        controller: function() {
          this.tab = 1;

          this.isSet = function(checkTab) {
            return this.tab === checkTab;
          };

          this.setTab = function(activeTab) {
            this.tab = activeTab;
          };
        },
        controllerAs: "tab"
      };
    });

    app.directive("productGallery", function() {
      return {
        restrict: "E",
        templateUrl: "./templates/product-gallery.html",
        controller: function() {
          this.current = 0;
          this.setCurrent = function(imageNumber){
            this.current = imageNumber || 0;
          };
        },
        controllerAs: "gallery"
      };
    });
  })();
