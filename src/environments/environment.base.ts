export const environment = {
  production: false,

  appName: 'Recordnise',
  
  // Location of folder with recording data files on server
  dataFolder: 'assets/', 
  
  // Default options related to data responses
  defaultParse: {header: true, skipEmptyLines: true},
  defaultFetch: {responseType: 'text'},

  // Default fields recordings are sorted by
  defaultSort: ['title', 'artist'],

  // Default options for the fuzzy search engine
  defaultFuse: {
    keys: [
      {
        name: 'title',
        weight: 0.9
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
    threshold: 0.7,

    // Custom threshold for post-search bubbling by duration difference
    bubbleCutoff: 0.16
  },

  // Time in milliseconds before notifications are auto-dismissed, if at all.
  snackbarDelay: 4000,

  // Regular expression for standard ISRC IDs.
  isrcRegex: /[A-Z0-9]{12}/g,

  // Default behaviour when selecting an input recording
  defaultAutoSearch: true
};