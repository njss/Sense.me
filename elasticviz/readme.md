# Faceted Search with Elasticsearch, Angular.js and D3.js
### Authors:
* Nelson Silva
* Mathias Blum
* Matthias Frey
* Daniel Lamprecht

> This project was the result from the lecture: **Information Architecture and Web Usability**.

> Delivered by: **Prof. Keith Andrews**, at TU Graz, Austria ([IAWEB](http://www.iicm.tugraz.at/keith "IAWEB")).

# Web Project

In `/project`, a generic web-project with bower and npm is set up.

## Installation

NodeJS and NPM are needed to install the rest, so first install

 - nodejs https://nodejs.org/en/download/
 - npm https://docs.npmjs.com/cli/install

Then, install node packages for gulp and bower with something like
`npm install --global gulp bower` (it might be necessary to run this as
superuser).

Then, change into poject folder and start npm and bower to fetch dependencies:

    $ cd project
    $ npm install
    $ bower install

This will install the project dependencies, after which you should be
able to start the developmend server with

    $ gulp serve


## Elasticsearch Server

Elasticsearch binaries are available at the Elasticsearch website: 
[https://www.elastic.co/products/elasticsearch](https://www.elastic.co/products/elasticsearch "Elasticsearch Server Download")

Find the executables in `elasticsearch-2.1.0/bin` .

### Elasticsearch Server - Windows
exectue the file `elasticsearch-2.1.0\bin\elasticsearch.bat`


# Project Screenshots:
<img src="/report/images/screenshots/application_native.png" width="380" height="450">
<img src="/report/images/screenshots/application_elasticui.png" width="380" height="450">
<img src="/report/images/screenshots/histogram_diagram.png" width="380" height="450">
<img src="/report/images/screenshots/top_words.png" width="200" height="400">