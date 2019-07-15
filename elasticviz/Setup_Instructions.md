
# Setup using Elasticsearch

The main folder is the elasticviz folder and all relevant files are located there.

## 1. General Setup

### 1.1. The repository

Pull or download the Sense.me repository.
You need to install Git.

### 1.2. node.js

The first thing you need to do is install node.js.
Download and install the LTS version including npm.
https://nodejs.org/en/

### 1.3. Elasticsearch server

Download and install a standard Elasticsearch server.

Use this link: https://www.elastic.co/blog/elasticsearch-2-1-0-and-2-0-1-released

The folder you downloaded should contain the 'config' sub-folder which contains the 'elasticsearch.yml' file.
You need to add the following at the end of that file to allow the entire project to work:

    http.cors.enabled : true
    http.cors.allow-origin : "*"
    http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
    http.cors.allow-headers : X-Requested-With,X-Auth-Token,Content-Type, Content-Length

The folder also contains the folder 'bin' and in there should be the file 'elasticsearch.bat'.
Execute that file to start elasticsearch.

### 1.4. Bower and gulp

Use npm to install bower and gulp using `npm install --global gulp bower` in any folder you desire.

Next, you need to remove '"amd-d3-cloud": "~1.0.5"' from the 'bower.json' file found in the 'project' folder.

Run the following commands in the `project` folder to fetch dependencies:

    $ npm install
    $ bower install

Use `gulp serve` to start the web interface.

## 2. Elasticsearch Server

### 2.1. Import documents

Elasticsearch terminology : there is an index (we use 'eyedata') and inside
that, there are documents/items (we use 'statement')


To import a file 'data/convertcsv_user1.json' into 'eyedata', and into an
index/collection 'statement':

    curl -XPOST 127.0.0.1:9200/eyedata/statement/_bulk?pretty --data-binary @data/convertcsv_user1.json

    curl -XPOST 127.0.0.1:9200/eyedata/statement/_bulk?pretty --data-binary @data/convertcsv_user2.json

This simple way of importing is not going to be sufficient later on - a mapping file will
be needed to configure how some fields are imported and analyzed.

### 2.2. More commands

Delete an index (e.g. to start fresh import)

    curl -XDELETE 127.0.0.1:9200/eyedata/


### 2.3. Analyzers

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



### 2.4. Useful es configuring

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