(function () {
  'use strict';

  var app = angular.module('FacetedUI', [
    'elasticsearch',
    'elasticui',
    'dangle',
    'debounce',
    'rzModule', 'underscore'
  ]);

  // Config for elastic-UI
  app.constant('euiHost', 'http://138.68.90.110:9200'); // ACTION: change to cluster address

  // esFactory() creates a configured client instance. Turn that instance
  // into a service so that it can be required by other parts of the application
  app.service('esClient', function (esFactory) {
    return esFactory({
      host: '138.68.90.110:9200/eyedata',
      //apiVersion: '1.2',
      log: 'trace'
    });
  });

  /**
   * Map aggregation part of an elastic result to the format that
   * dangle wants for its date-historgram
   */
  function dangleMapHistoData(data) {
    return {
      _type: 'date_histogram',
      entries: data.buckets.map(function (r) {
        return {time: r.key, count: r.doc_count};
      })
    };
  }

  /**
   * Passing data to the Tree Diagram
   */
  function mainTreeMapDiagramData(data) {
    return {
      _type: 'userName',
      entries: data.buckets.map(function (r) {
        return {main: r};
      })
    };
  }

  /**
   * Passing data to the Tree Diagram
   */
  function mainParallelCoordinatesData(data) {
    return {
      _type: 'userName',
      entries: data.map(function (r) {
        return {main: r};
      })
    };
  }


  /**
   * Passing data to the Tree Diagram
   */
  function mainParallelCoordinatesAdvData(data) {
    return {
      _type: 'userName',
      entries: data.map(function (r) {
        return {main: r};
      })
    };
  }


  /**
   * Passing data to the Tree Diagram
   */
  function mainSpaceTimeCubeData(data) {
    return {
      _type: 'userName',
      entries: data.map(function (r) {
        return {main: r};
      })
    };
  }


  /**
   * Passing data to the Tree Diagram
   */
  function mainSankeyData(data) {
    return {
      _type: 'userName',
      entries: data.map(function (r) {
        return {main: r};
      })
    };
  }


  /**
   * Passing data to the Arc Diagram
   */
  function arcDiagramData(data) {
    return {
      _type: 'userName',
      entries: data.map(function (r) {
        return {main: r};
      })
    };
  }


  /**
   * Passing data to the Dateline Diagram
   */
  function datelineDiagramData(data) {
    return {
      _type: 'userName',
      entries: data.buckets.map(function (r) {
        return {main: r};
      })
    };
  }

  //
  // Demo controller
  app.controller('FacetedDemoController', ['$scope', '$log', '$filter', 'esClient',
    'queryBuilderService', 'debounce',
    function ($scope, $log, $filter, esClient, queryBuilderService, debounce) {
      var self = this;
      //var minValue = 0, maxValue = 100000;

      this.results = [];
      this.aggregations = {};
      this.query = {};
      this.queryDSL = {};
      //this.lastQueryTime = 0;
      //this.statusOk = true;
      //this.statusInProgress = false;
      this.tabsOpen = ['text'];

      // Constants
      //this.roleLongname = {
      //  abg: 'Member of Parl.',
      //  other: 'Other',
      //  pres: 'President'
      //};

      // Configure facets
      queryBuilderService.setFacetConfig('experiment',
        {field: 'experiment', type: 'multiTerm', key: 'experiment'},
        {terms: {field: 'experiment', size: 10}});


      queryBuilderService.setFacetConfig('ageAvg',
        {field: 'age', type: 'multiTerm', key: 'ageAvg'},
        {terms: {field: 'age', size: 100}});

      queryBuilderService.setFacetConfig('retAll',
        {field: 'aoi', type: 'multiTerm', key: 'retAll'},
        {terms: {field: 'aoi', size: 1000}});

      queryBuilderService.setFacetConfig('durationAoi',
        {field: 'durationAoi', type: 'multiTerm', key: 'durationAoi'},
        {terms: {field: 'durationAoi', size: 1000}});

      queryBuilderService.setFacetConfig('userName',
        {field: 'userName', type: 'multiTerm'},
        {terms: {field: 'userName', size: 100}});

      queryBuilderService.setFacetConfig('aoi',
        {field: 'aoi', type: 'multiTerm'},
        {terms: {field: 'aoi', size: 1000}});

      queryBuilderService.setFacetConfig('isTerminal',
        {field: 'isTerminal', type: 'term'},
        {terms: {field: 'isTerminal'}});

      queryBuilderService.setFacetConfig('isAnswer',
        {field: 'isAnswer', type: 'term'},
        {terms: {field: 'isAnswer'}});

      queryBuilderService.setFacetConfig('isComparison',
        {field: 'isComparison', type: 'term'},
        {terms: {field: 'isComparison'}});

      queryBuilderService.setFacetConfig('isSettings',
        {field: 'isSettings', type: 'term'},
        {terms: {field: 'isSettings'}});

      queryBuilderService.setFacetConfig('isOffscreen',
        {field: 'isOffscreen', type: 'term'},
        {terms: {field: 'isOffscreen'}});

      // Simple query config for role
      // queryBuilderService.setFacetConfig('role',
      //   {field: 'role', type: 'term'},
      //   {terms: {field: 'role'}
      // });

      //
      // Set up multiple configurations for the 'role' field (one has a nested
      // aggregation). Use the changeConfig method to switch between the two.
      //
      // var roleconfigs = {
      //   full: [
      //     {field: 'trial', type: 'term'},
      //     {terms: {
      //       field: 'trial',
      //       min_doc_count: 10
      //       }
      //        }],
      //   fast: [
      //     {field: 'trial', type: 'term'},
      //     {terms: {
      //       field: 'trial',
      //       min_doc_count: 10
      //       }}]
      // };


      // queryBuilderService.setFacetConfig('trial', roleconfigs.fast[0],
      //   roleconfigs.fast[1]);

      queryBuilderService.setFacetConfig('trial',
        {field: 'trial', type: 'term'},
        {terms: {field: 'trial'}});

      queryBuilderService.setFacetConfig('age',
        {field: 'age', type: 'term'},
        {terms: {field: 'age'}});

      queryBuilderService.setFacetConfig('freetext',
        {field: 'aoi', type: 'analysedTerm', key: 'freetext'},
        false);

      // //
      // // Query and aggregation by durationAoi
      // queryBuilderService.setFacetConfig('durationAoiFacet',
      //   {field: 'durationAoi', type: 'range', interval: 100},
      //   {
      //     histogram: {
      //       field: 'durationAoi', interval: 100
      //     }
      //   });


      queryBuilderService.setFacetConfig('datetime',
        {field: 'datetime', type: 'range'},
        {
          'date_histogram': {
            field: 'datetime',
            interval: 'month'
          }
        });


      //
      // This configuration is used by the tree-diagram !!!

      queryBuilderService.setFacetConfig('treediagram',
        {field: 'userName', type: 'term'},
        {
          terms: {
            field: "userName"
            // exclude: "",
            //size: 0
          },
          aggregations: {
            trials: {
              terms: {
                field: "trial",
                order: {"_term": "asc"}
                //include: "([a-z]?[.][a-z]+)",
                //size: 200
              },
              aggregations: {
                aoisDates: {
                  terms: {
                    field: "datetime",
                    order: {"_term": "asc"}

                  },
                  aggregations: {
                    durationAoi: {
                      terms: {
                        field: "durationAoi"
                      }
                    },
                    aoi: {
                      terms: {
                        field: "aoi"
                      }
                    }
                  }
                }
              }
            }
          }
        });

      queryBuilderService.setFacetConfig('parallelCoordinates',
        {field: 'aoi', type: 'term'},
        {
          terms: {
            field: "userName",
            field: "experiment",
            field: "trial"
            // exclude: "",
            //size: 0
          }
          //,
          // aggregations: {
          //   trials: {
          //     terms: {
          //       field: "trial",
          //       order: {"_term": "asc"}
          //       //include: "([a-z]?[.][a-z]+)",
          //       //size: 200
          //     },
          //     aggregations: {
          //       aois: {
          //         terms: {
          //           field: "datetime",
          //           order: {"_term": "asc"}

          //         },
          //         aggregations: {
          //           durationAoi: {
          //             terms: {
          //               field: "durationAoi"
          //             }
          //           },
          //           aoiDate: {
          //             terms: {
          //               field: "aoi"
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        });

      queryBuilderService.setFacetConfig('arcdiagram',
        {field: 'userName', type: 'term'},
        {
          terms: {
            field: "userName"
            // exclude: "",
            //size: 0
          },
          aggregations: {
            trials: {
              terms: {
                field: "trial",
                order: {"_term": "asc"}
              },
              aggregations: {
                aois: {
                  terms: {
                    field: "aoi"
                  },
                  aggregations: {
                    durationAoi: {
                      terms: {
                        field: "durationAoi"
                      }
                    }
                  }
                }
              }
            }
          }
        });


      queryBuilderService.setFacetConfig('datelinediagram',
        {field: 'userName', type: 'term'},
        {
          terms: {
            field: "userName"
            // exclude: "",
            //size: 0
          },
          aggregations: {
            trials: {
              terms: {
                field: "trial",
                order: {"_term": "asc"}
              },
              aggregations: {
                aois: {
                  terms: {
                    field: "datetime",
                    order: {"_term": "asc"}

                  },
                  aggregations: {
                    durationAoi: {
                      terms: {
                        field: "durationAoi"
                      }
                    },
                    aoiDate: {
                      terms: {
                        field: "aoi"
                      }
                    }
                  }
                }
              }
            }
          }
        });

      // Request the date once more ,  this time it will fetched from
      // the primary query-context and thus be affected by the query context
      queryBuilderService.setFacetConfig('dateLimited',
        false,
        {
          'date_histogram': {
            field: 'datetime',
            interval: 'month'
          }
        });

      /**
       * This is a demo method that shows that aggregations can easily be
       * changed on the fly.
       */
      //function useNestedAggregationForRoleFacet(status) {
      //  if (status) {
      //    queryBuilderService.setFacetConfig('trial',
      //      roleconfigs.full[0], roleconfigs.full[1]);
      //  } else {
      //    queryBuilderService.setFacetConfig('trial',
      //      roleconfigs.fast[0], roleconfigs.fast[1]);
      //  }
      //}

      //this.updateHiddenChartSetting = function () {
      //  useNestedAggregationForRoleFacet(this.showHiddenChart);
      //  this.refresh();
      //};


      /**
       * Set values/results from a es-result to the scope of the controller
       */
      function bringAggregationsIntoScope(agglist, aggResult) {
        var j;
        for (j = 0; j < agglist.length; j++) {
          if (agglist[j] in aggResult) {
            self.aggregations[agglist[j]] = aggResult[agglist[j]];
          }
        }
      }

      /**
       * Various stuff that we want to do with the query after it has
       * changed (+before actually submitting)
       *
       * Note : is now more like some kind of prepare-query method
       */
      function cleanQuery() {
        // Cleanup the experiment field
        if (self.query.experiment) {
          for (var pk in self.query.experiment) {
            if (!self.query.experiment[pk]) {
              delete self.query.experiment[pk];
            }
          }
          if (!Object.keys(self.query.experiment).length) {
            delete self.query.experiment;
          }
        }

        if (self.query.ageAvg) {
          for (var pk in self.query.ageAvg) {
            if (!self.query.ageAvg[pk]) {
              delete self.query.ageAvg[pk];
            }
          }
          if (!Object.keys(self.query.ageAvg).length) {
            delete self.query.ageAvg;
          }
        }

        if (self.query.retAll) {
          for (var pk in self.query.retAll) {
            if (!self.query.retAll[pk]) {
              delete self.query.retAll[pk];
            }
          }
          if (!Object.keys(self.query.retAll).length) {
            delete self.query.retAll;
          }
        }

        // Cleanup the userName field
        if (self.query.userName) {
          for (var pk in self.query.userName) {
            if (!self.query.userName[pk]) {
              delete self.query.userName[pk];
            }
          }
          if (!Object.keys(self.query.userName).length) {
            delete self.query.userName;
          }
        }

        // Cleanup the aoi field
        if (self.query.aoi) {
          for (var pk in self.query.aoi) {
            if (!self.query.aoi[pk]) {
              delete self.query.aoi[pk];
            }
          }
          if (!Object.keys(self.query.aoi).length) {
            delete self.query.aoi;
          }
        }

        // Cleanup the durationAoi field
        if (self.query.durationAoi) {
          for (var pk in self.query.durationAoi) {
            if (!self.query.durationAoi[pk]) {
              delete self.query.durationAoi[pk];
            }
          }
          if (!Object.keys(self.query.durationAoi).length) {
            delete self.query.durationAoi;
          }
        }

        // apply the slider settings to query - if something is set
        if (self.useDateSlider &&
          (self.dateSlider.min !== false || self.dateSlider.max !== false) &&
          (self.dateSlider.min !== self.dateSliderOptions.floor ||
          self.dateSlider.max !== self.dateSliderOptions.ceil)) {
          self.query.date = {
            min: self.dateSlider.min,
            max: self.dateSlider.max
          };
        } else {
          if (self.query.date) {
            delete self.query.date;
          }
        }
      }

      /**
       * Issue a separate call, excluding just one facet
       * (to have the full, non-restricted view on that facet
       */
      function extraFacetRequest(excludefacet, query) {
        var extraquery = {},
          queryitems = Object.keys(query);
        var dsl;


        // Copy the query except for the excludefacet
        for (var k = 0; k < queryitems.length; k++) {
          if (queryitems[k] !== excludefacet) {
            extraquery[queryitems[k]] = query[queryitems[k]];
          }
        }

        // TODO : we could build a different, stripped-down query, because
        // all we're interested is that one aggregation of the excludefacet
        dsl = queryBuilderService.buildQueryDSL(extraquery);
        return esClient.search(dsl)
          .then(function (body) {
            bringAggregationsIntoScope([excludefacet], body.aggregations);
          })
          .catch(function (error) {
            // self.statusOk = false;
            // self.statusInProgress = false;
            $log.error(error);
          });
      }

      function specialFacetRequest(excludefacet, query) {
        return esClient.search(query)
          .then(function (body) {
            bringAggregationsIntoScope([excludefacet], body.aggregations);
          })
          .catch(function (error) {
            // self.statusOk = false;
            // self.statusInProgress = false;
            $log.error(error);
          });
      }

      this.tabIsShown = function (what) {
        return this.tabsOpen.indexOf(what) !== -1;
      };

      this.showTab = function (what) {
        this.tabsOpen = [what];
      };

      /**
       * Return current content of freetext-search.
       */
      //this.getQueryText = function () {
      //  return (this.query.freetext);
      //};

      /**
       * remove a filter/facet from query context
       */
      this.resetField = function (name) {
        if (name in this.query) {
          delete this.query[name];
          this.refresh();
        }
      };

      /**
       * reset query context completely
       */
      this.resetQuery = function () {
        // Hack : also reset the slider value, that we keep separately
        // for now:
        this.dateSlider = {min: false, max: false};
        this.useDateSlider = false;

        this.query = {};
        this.refresh();
      };

      /**
       * test for empty/non-empty query context (are any filters set?)
       */
      this.queryIsEmpty = function () {
        return Object.keys(this.query).length === 0;
      };

      /**
       * test if a facet/field is set in the current query
       */
      this.queryContains = function (what) {
        return this.query.hasOwnProperty(what);
      };

      /**
       * refresh results / build query and issue a call to search-backend
       */
      this.refresh = function () {
        self.statusInProgress = true;

        // Apply some filters etc on query
        cleanQuery();

        // build queryDSL
        self.queryDSL = queryBuilderService.buildQueryDSL(self.query);

        // Make request to search-backend
        esClient.search(self.queryDSL)
          .then(function (body) {
            var mainaggs, specialaggs;
            self.statusOk = true;
            self.statusInProgress = false;
            self.results = body.hits.hits;
            self.lastQueryTime = body.took;
            self.hits = body.hits.total;

            // Find those aggregations that we really want to take
            // into scope with the first query
            specialaggs = queryBuilderService.getAggregationMultiKeys();
            mainaggs = queryBuilderService.getAggregationKeys()
              .filter(function (v) {
                return specialaggs.indexOf(v) === -1;
              });
            bringAggregationsIntoScope(
              mainaggs,
              body.aggregations
            );

            // Further prepare result as needed
            // (some components need the results in diferent form)
            self.dangleDateHisto = dangleMapHistoData(self.aggregations.dateLimited);
            self.mainTreeDiagram = mainTreeMapDiagramData(self.aggregations.treediagram);
            self.mainParallelCoordinates = mainParallelCoordinatesData(body.hits.hits);
            self.mainSpaceTimeCube = mainSpaceTimeCubeData(body.hits.hits);
            self.mainSankey = mainSankeyData(body.hits.hits);

            //self.mainParallelCoordinatesAdv = mainParallelCoordinatesAdvData(body.hits.hits);
            self.arcDiagram = arcDiagramData(body.hits.hits);
            self.datelineDiagram = datelineDiagramData(self.aggregations.datelinediagram);
          })
          .catch(function (error) {
            self.statusOk = false;
            self.statusInProgress = false;
            $log.error(error);
          });

        // Make separate requests for facets for which we want to
        // have the un-restricted bucket
        // TODO : read from configuration , i.e. do that for all facets
        // that are in  queryBuilderService.getAggregationMultiKeys()

        specialFacetRequest('ageAvg',
          {
            size: 0,
            body: {
              // Begin query.
              query: {match_all: {}},
              // Aggregate on the results
              aggs: {
                ageAvg: {
                  avg: {
                    field: "age"
                  }
                }
                // End query.
              }
            }
          })
          .then(function () {

            //var agg = self.aggregations.ageAvg, dummy;
            self.ageAvg = (self.aggregations.ageAvg.value).toFixed(2);

          });

        specialFacetRequest('retAll',
          {
            size: 10000,
            body: {
              // Begin query.
              query: {match_all: {}},
              aggs: {
                retAll: {
                  terms: {
                    field: "aoi",
                    order: {"_term": "asc"}
                  }
                }
              }
            }
          })
          .then(function () {

            self.retAll = self.aggregations.retAll;

          });

        extraFacetRequest('experiment', self.query);
        extraFacetRequest('durationAoi', self.query);
        extraFacetRequest('userName', self.query);
        extraFacetRequest('aoi', self.query);
        extraFacetRequest('datetime', self.query)
          .then(function () {
            // Separate request for the date
            // Set new values to our slider and the 'full-date' histogram
            // (which is not affected by the date query)
            var agg = self.aggregations.datetime, dummy;
            self.dangleFullDateHisto = dangleMapHistoData(agg);

            self.dateSliderOptions.floor =
              agg.buckets[0].key;
            self.dateSliderOptions.ceil =
              agg.buckets[agg.buckets.length - 1].key;

            if (self.dateSlider.min < self.dateSliderOptions.floor) {
              self.dateSlider.min = self.dateSliderOptions.floor;
            }

            if (self.dateSlider.max > self.dateSliderOptions.ceil) {
              self.dateSlider.max = self.dateSliderOptions.ceil;
            }

            if (self.dateSlider.min > self.dateSlider.max) {
              dummy = self.dateSlider.min;
              self.dateSlider.min = self.dateSlider.max;
              self.dateSlider.max = dummy;
            }

          });
      };

      // Convert party strings to proper case (available through scope)
      $scope.convertPartyCase = function (party) {
        if (party == 'grüne') {
          return 'Grüne';
        }
        if (party == 'none') {
          return 'None';
        }
        return party;
      };

      /**
       * Use debounce to make a refresh-function that will wait some time
       * before it actually triggers refresh (useful for fields with
       * text input to not trigger multiple requests when the user is still
       * typing.
       */
      this.debounceRefresh = debounce(this.refresh, 500);

      $scope.myController = this;

      //Fires every time the user changes the range value on the dc chart durationAoi histogram
      $scope.setMinMaxValues = function (min, max) {
        //debugger;
        $scope.myController.minValue = min;
        $scope.myController.maxValue = max;


        //$scope.myController.refresh();
      };


      // Init slider (TODO: do somewhere else)
      this.useDateSlider = false;
      this.dateSliderOptions = {
        floor: 0,
        ceil: 1,
        onChange: this.debounceRefresh,
        translate: function (v) {
          return v !== false ?
            $filter('date')(v, 'dd.MM.yy') : '-';
        }
      };
      this.dateSlider = {
        min: false,
        max: false
      };


      // Initialise with call to refresh
      this.refresh();
    }]);
})();
