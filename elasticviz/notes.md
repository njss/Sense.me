
# Javascript client

## Install

To use the JS client, it should be made a dependency of the bower project.
Use `bower install elasticsearch` ( `bower install 'git://github.com/elastic/elasticsearch-js.git#10.0.1'` )

Three separate 'build' (js-files that can be included in the index.html)
exist, next to the native version, there exist special builds for angular and
jQuery.
https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/browser-builds.html

## Example for Elasticsearch in Angular

https://github.com/spalger/elasticsearch-angular-example


## Using the JS client

https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html


Query client using promises instead of callbacks.

    client.search({
      q: 'pants'
    }).then(function (body) {
      var hits = body.hits.hits;
    }, function (error) {
      console.trace(error.message);
    });


# Elasticsearch Server

## Import documents

Elasticsearch terminology : there is an index (we use 'eyedata') and inside
that, there are documents/items (we use 'statement')

Data exists as import instructions for elasticsearch in 'data/', for every
debate there is a file. 'export-24-218.json' contains data from legislative
period 24, debate no. 218 . Files like 'export-23.json' contain the complete
legislative period.

To import a file 'data/export-24-218.json' into 'eyedata', and into an
index/collection 'statement':

    curl -XPOST localhost:9200/eyedata/statement/_bulk?pretty --data-binary @data/export-24-218.json

    curl -XPOST localhost:9200/eyedata/statement/_bulk?pretty --data-binary @data/export-23.json

This simple way of importing is not going to be sufficient later on - a mapping file will
be needed to configure how some fields are imported and analyzed.

## More commands

Delete an index (e.g. to start fresh import)

    curl -XDELETE 'http://localhost:9200/eyedata/'


## Analyzers

Problem : default is to tokenize all input fields.
We wanted use occupation as facet, get the most common occupations etc.
Instead we got "Präsidentin", "des", "Nationalrats" as common terms of that
field.

Solution : use no analyzer , or a different analyzer when importing the
data into elasticsearch.

First, to inspect the current mappings of an index:

    GET /opendat/_mapping/statement

A mappings file looks like : see the file 'mapping.json' .

To *not* use a tokenizer, configure a field like this :

    "occupation": {
                  "type": "string",
                  "index": "not_analyzed"
               },

We use this for occupation and name of speaker.

So , to properly import:

0) delete an index (if you want to reload)
curl -XDELETE 'localhost:9200/eyedata?pretty'

1) create the index
curl -XPUT 'localhost:9200/eyedata?pretty'

2) create and load the mapping file
curl -XPUT localhost:9200/eyedata/statement/_mapping?pretty -d @mapping.json

3) load the json dataset
curl -XPOST localhost:9200/eyedata/statement/_bulk?pretty --data-binary @convertcsv1.json



## Useful es configuring

For cors, see https://www.elastic.co/guide/en/elasticsearch/reference/1.4/modules-http.html
Part of the settings below should be default.


Done in `config/elasticsearch.yml`

    # Set my own datadir (completely  optional)
    path.data: /var/elasticsearch

    # Enable cors to be able to talk directly to elasticsearch from our frontend
    http.cors.enabled: true
    http.cors.allow-origin : "*"
    http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
    http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length


# JS Implementation

## Elastic search client

https://www.elastic.co/guide/en/elasticsearch/reference/1.4/_executing_searches.html

A more complex query

    "query": {
        "bool": {
            "must": [
                {"term": {"current_party":"grüne"}},
                {"term": {"text":"umweltschutz"}}
            ]
        }


Example of query with aggregations (=facets)

    {"body":{
        "aggregations":
            {"duration":{"histogram":{"field":"duration","interval":180}},
            "party":{"terms":{"field":"current_party"}}},
        "query":{
            "bool":{
                "must":[
                    {"term":{"current_party":"spö"}}
                ]}}}}


//Everytime we run bower we have to remove from index.html
<!--<script src="/bower_components/heatmap.js-amd/plugins/gmaps-heatmap.js"></script>
<script src="/bower_components/heatmap.js-amd/plugins/leaflet-heatmap.js"></script>
<script src="/bower_components/heatmap.js-amd/plugins/svg-area-heatmap.js"></script>-->