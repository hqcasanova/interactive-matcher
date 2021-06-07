export const environment = {
  production: false,
  
  // Location of folder with recording data files on server
  dataFolder: '/assets/', 
  
  // A header in the CSV file specifying field names is assumed.
  csvHeader: true,

  // Default fields recordings are sorted by
  defaultSort: ['title', 'artist'],

  // Default options for the fuzzy search engine
  defaultFuzzy: {threshold: 0.6, keys: ['title', 'artist', 'isrc']}
};