export const environment = {
  production: false,
  
  // Location of folder with recording data files on server
  dataFolder: 'assets/', 
  
  // Default options for the parsing during fetch.
  defaultFetch: {header: true, skipEmptyLines: true},

  // Default fields recordings are sorted by
  defaultSort: ['title', 'artist'],

  // Default options for the fuzzy search engine
  defaultFuzzy: {
    keys: [
      {
        name: 'title',
        weight: 0.8
      },
      {
        name: 'artist',
        weight: 0.8
      },
      {
        name: 'isrc',
        weight: 1
      }
    ],
    threshold: 0.7
  },

  // Time in milliseconds before notifications are auto-dismissed, if at all.
  snackbarDelay: 3000,

  acronyms: ['isrc']
};