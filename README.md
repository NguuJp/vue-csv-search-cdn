# Implementing a CSV file (store list) loading, display, and search functionality using Vue (CDN version)

## Requirements
- A local government agency wants to create a cashless campaign website
- They have prepared a large store list data in CSV format that needs to be displayed on the website
- They require a search function for the various fields in the store list
- Previous implementations with around 100,000 store lists showed slow loading times, so they want to improve the performance.

## Basic Design

### Non-functional requirements
- The project needs to use a shared rental server that does not support node.js.
- The main contractor does not have the knowledge to set up a development environment with node.js.

### Functional requirements
- The existing page uses jQuery, so the implementation will use Vue and build it as a single-page application.
- The Vue CDN version will be used as node.js is not an option for the development environment.
- The CSV loading and search functions will be developed using Vue.

## Notes
- The papaparse library was considered but not used for this implementation.

## Summary
The decision was made to use the Vue CDN version as it is easier to implement and requires less development cost than setting up a local development environment with node.js. To enable anyone to set up the local development environment easily, commands and other information will be provided. The static files generated from the build will be uploaded to the shared rental server.

