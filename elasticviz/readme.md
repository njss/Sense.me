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