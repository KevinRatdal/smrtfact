### Stripped log of commits on original repository
Most recent to most recent commits, Split by author, merges omitted.

Kevin:

v2 milestone, name changed, new icon
Update README.md
Update README.md
Update README.md
alias panel restyled
simplified redundant code
Update README.md
Update README.md
Update README.md
logo for readme
Alias routing fixed
overlay slightly improved
errorhandling fixed
errorMessage gets reset when clearing history
error handling broken
error rework
Reactivesettings
logov2
history limit fixed
settings and history fixes
styling
simplified regex
settings working
typo in settings
reactive claims fixed
latest claim clean up
settings reactive, claim not working
settings and history
settings for background implemented, non-functionally
fix viewport size
icons styled
removed gutter from history
history improvements
result styling
todo checklist
Create TODO.md
logo, and whitetheme?
navbar css
navbar component
icons
simplified regex
reset settings button implemented
settings cleanup
removed redundant redirects, fixed routing for related claims
settings loading
settings detect changes
True message promise
save to settings
default settings loads on install
store implemntation fixed
vuex implemented without node
Revert "vuex implemented"
Revert "Revert "removed old buttontemplate""
Revert "removed old buttontemplate"
removed old buttontemplate
cleaned up history clear button
settings page cleanup
commented our leftovers from testing, incremented to V1.0
Cosine similarity
fixed function name
implemented alt checking mim, reverted alias reversing, minor
fixed for loop in popup, typo in loading
for loop consistensy
forcestore route implemented
update sequence implemented, fixes error from first startup
Fixed merge conflict
renamed localstorage key, old results will be gone
cosineClaimCheck moved outside of eventlistener
renamed background routes
statement rendering implemented
simmila icons, spawn of simmilar popup
added loading screen animation, loading route button for testing
result: Added date, increased claim font weight
Fixed misplaced bracket in tools component
fixed loading route
removed misplaced bracket
popover in result
Result page
Autocheck
History fixed, cleaned up website detection, added support for auto on all supported sites, renamed helpers...
rename
changed default history sorting to newest first
automatic timed requests implemented
eventlistener
icon change is now indepentent, and textfrom field also independent correctly
fixed typo in history
fixed typo in history
Update README.md
twitterdependencies fixed
twitterdependencies fixed
directory cleanup
directory cleanup
contentscript listener cleanup
Mockresults re-implemented
Fixed type
Website support
fixed buttoncheck
Improved twitter behavior
removed DS_Stores
button spawn improved, and gitignore added
styling
comments, and removed redundent code
Popup rewrite
enhanced storage checking
fixed color of result
color coded articles
added html tag ot result and settings
settings page start
subwindow scrolling
fixed bootstrap
color override
result page beginning
storage handeling changes
fixed size
changed button handeling
split into components
swapped from vue3 to vue2, and implemented vuerouter
added vue router
added vue app, and basic requrements in manifest
bootstrap5 added
fixed implementation of readmore button
added possible truth gauge assets, cleaned up image handeling
removed redundant variable in buttongenerator
removed jsonprint
twitter support semi-working
implemented einars button into extension
div changes
buttontemplatechanges
buttontemplate
Update meetingnotes.md
Update meetingnotes.md
semiworking overlay, code factorization
semiworking overlay, code factorization
shadow dom - analysis page
building blocks for analysiswindow
Selection request
added redesigned icon
clean up
api calls now work, needs cleaning up
Request seems to be working
Request still broken
fixed folder structure
fixed proof of concept of selection
added possible start files of chrome extension
removed bindestrek
Update README.md
Edited requirements
Update README.md
minor
Update README.md
Layout fix
Update README.md
Update README.md
Added basic requirements and ideas
Initial commit


Mustafa:

grammarly in work
removed vuex code
- removed store from #app
small adjustments
- new message on loading page
- edited claim evaluation on result
removed br lines from settings
send claim on enter. removed general from settings
history buttons style
resultpage
-claim text centered
tools v.1
-stats added
- recent claims added
send claim is now reactive
- changes if url
fixed wrong function name
logo and tabs small fix
related claims dropdown v1
History link and navbar on hover styling
changed alias to related claims
adjustments to expand popup
- simplified
new settings template
- for user defined truth and false
implemented watcher
user defined truth/false v.1
user defined truth/false in result
lower and upper boundry created
settings template update
persistent setting boilerplate
alias handling for popup implemented
result page - slow to update, need to tab back and forth for it to update
vuex implemented
fixed text message
Showed "somewhat true" when no claims were made
dropdown for current claim with aliases
boilerplate for aliases dropdown
missing function name change
changed variable names in cosinesimilarity function
rename Functions
input handling on send claim
all cases simplified
updating storage key
addAlias case added
implemented button communication
cosineSimilarity
added condition
missing bracket...
url needs "https://www
duplicate bug fixes
duplicate entries fix
-sends message from background to popup, if duplicate is found before sending to api. -> redirects to result page
upps missing case
:P
input in tools v.2
can take in url claims and text claims
Error handling
url validation
-url gets validate
removed reduntant code
-error is already caught in fetchErrorHandling
fixed bug
- wouldnt redirect to result page on real claim
ErrorHandling
-Errors from server handled
- Error messages stored in own array at chrome storage
- Somewhat error handling functionality to end user
Url api
implemented factcheck currentpage by click
created additional button on send claim for url, where it factchecks the page you are on.
new functions for sort, and cleaner buttons for show(claimtype)
url claim, and filtering history
-url claim are now up and running.
- history has now an added functionality where you can differentiate between the different types of claim.
bounty hunting
- if you can find out why its not working like intended. Honor and praise awaits.
storing url data
storing url claims seperately from textfield claims
url-api
factcheking url is now possible
alertbox
Sanitiation of input
implemented sanitizeClaim
fixed duplicate entries
checking if claim is already made - if so sendresponse directly - else send to api
youtube overlay button fix
up and running
youtube-overlay button
-button seems to be functioning. needs to be tested when api is up and running.
clean up/comments
-removed unused code
-added comments for easier continuation of code
css adjustment
-adjusted positioning of "?" in button
facebook factcheck button
button pops up in text fields
fixed bug in history
after sorting, clicking on an item would refer you to the last item which had that position
loading page
redirect to loading page when new claim is sent.
history more functionality to view more
can now decide how many claims to show. however last option should not show what the limit, but rather stay null untill event happens
history page view button
viewMore and viewLess button implemented
added functionality to history page
can sort claims by, newst/latest and highest/lowest final_score
result page
result page display by default the last item that was factchecked
history update view
previous claims show up in colors based on their truthfulness and links to result page
popup window components v.0.0.1
result component: result template needs to be properly populated.
history component: data is overwritten when new data arrives.
added comments
added "redundant" commentation on code for easier transission
view more function
bug: "undefined"
Added items to fact-check-page
missing styling
created draggable html
made it so the header is draggable. seems to be disrupting styling, but im out peace on the street son
Shadowdom
adding functionality to expand
Update meetingnotes.md
Update meetingnotes.md
shadow dom - analysis page
implemented shadow dom to analysis page to behave independetly from light dom
Mockpopup
prototype fact analysis page
implemented simple functionality to display information about the results received from the server
fixed selection across elements
slight editing of function
fixed selection across elements
removed bindestrek
Update README.md
Update README.md


