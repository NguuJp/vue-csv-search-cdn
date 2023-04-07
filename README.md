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
- Within a Vue.js instance, use Axios to retrieve data from the specified CSV file URL, process it, and store store store information in an array.
- The papaparse library was considered but not used for this implementation.

## Summary
Rather than loading from CDN, setting up a local development environment with node.js and installing Vue would require less development cost. Putting the built static files on a shared rental server would be better. Leaving commands and other information to enable anyone to set up the local development environment would be beneficial in the end.