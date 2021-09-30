# InteractiveMatcher

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.3.


## Matching candidates

Matching depends on comparison and both tasks are made simpler if their targets are visible at the same time. Hence the 3-column layout on desktop with the lists at the end and the actions affecting both of them in the middle. The layout coincides with the user's workflow, train of thought and natural direction of attention: from selecting an input from the list on the left through the action of matching in the center to the database where a similar recording should live. The action of adding also goes only from left (the inputs) to the right (the database). Given the positioning of the "registered" list to the right, "register" also points in the right direction. 

Notice also how colours are used to connect the actions to the selected items and how backgrounds are strategically used to highlight the difference between the database list and that of inputs. The lists are kept sorted alphabetically by default as an aid for the user to know how far down in the list they are. The sorting changes in the case of the database list to a score-based one when filtering by a selected input or search query. While the implementation of the fuzzy search is crude (eg there is no difference in weight among recording properties resulting in exact ISRC matches sometimes not coming up on top), it is decent enough to get a big picture of the user's position in the list. 

Apart from improving the fuzzy search, other enhancements to the current design would necessarily include the use of sticky headers to keep elements such as the name of the lists and the search box within view at all times while on a mobile device.


## Search the whole database

The field was positioned above the database list since, similarly to the spatial coherence mentioned before, the action of searching is performed first and then it affects the list: the action is performed on the list, it goes from top to bottom. The logic behind the functionality is the same one used for filtering on input selection. This ensures there is coherence across features, making them more intuitive and learn-able.


## Create a new sound recording in the database

The register button's position after the list of inputs but before the database is is aimed at reinforcing the idea that a input should be selected first (left-to-right).When adding, the app automatically takes all the metadata from the input for the new entry in the database without the user's intervention...

... Which is both convenient but also wholly inflexible. An edit view is needed so that either during or after the addition the entry could be modified if needed. For now, the user in this case is trapped by a prescribed journey.


## Implementation assumptions

- The app has only been tested on the latest version of Chrome. Brace yourself for some issues on mobile Safari and/or IE 11/early Edge.
- The site has been designed following the recommended mobile-first pattern. Notice though that corners have been cut in terms of UX. For example, inter-list actions (ie matching recordings) are initially below the fold on mobile and move with scrolling. Only one breakpoint has been added at 1024px for a landscape 3-column layout with the recording lists alongside each other, which is ideal for comparing and matching (as mentioned above). All in all, the app only begins to be usable on devices like the iPad. Breaking points beyond 1024px for multi-column lists should be desirable.
- Some provision has been made for global sorting on demand. A "sort" method in the app's shared service `recordings.service.ts` aims to provide the necessary logic for a dropdown box on either list so that the user can choose however best each list should be ordered.
- All data transactions have been coded with the view that the source will eventually be a server. Hence the use of Observables everywhere. Regarding a higher number of database fields, the present design could be enhanced by means of collapsible elements that initially conceal any extra fields. Cards being the unit of design here, they scale by vertical expansion and can thus follow the principles of progressive reveal. Tables however do not lend themselves to that strategy. Perhaps, a combined approach would work for cases where the number of fields is greater than in this challenge but not too high. Since the database is less likely than the inputs to have incomplete data, the input list could be rendered as cards and the database as a table. Ideally, the table should have collapsible columns too.
- As for major vocabulary, "unmatched" has been used to designate the input list since it helps conjure up the idea of the todo list it represents: recordings to match. "Registered" is used for the database since matching is really the equivalent to identifying an input relative to recordings previously identified in the same manner and saved. It conveys the idea of a process going in the same direction as registering an input, hinting at the app's workflow.
- The groundwork for allowing the matching of more than one input recording has been laid: the input list supports multiple selection but that support is disabled. Validation logic would be needed for UX checks and balances such as a modal asking for confirmation if several entries in the inputs list were to be deleted as a consequence of matching. More generally, validation and modals have been ignored in this iteration.


## Instructions for local deployment

- Git clone the project under a folder of your choice.
- Assuming NPM is already installed, CD into the folder and execute the command `npm install`. This will get all the necessary dependencies off the web.
- Once package install is complete, execute the command `ng serve —open`. This will compile the code and automatically bring up the web browser with interactive matcher’s page. Should the browser or the page not open, you can always do it manually and head to the URL http://localhost:4200.


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
