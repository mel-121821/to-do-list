# to-do-list

Instructions

[x] Your ‘todos’ are going to be objects that you’ll want to dynamically create, which means either using factories or constructors/classes to generate them.


[x] Brainstorm what kind of properties your todo-items are going to have. At a minimum they should have a title, description, dueDate and priority. You might also want to include notes or even a checklist.


[x] Your todo list should have projects or separate lists of todos. When a user first opens the app, there should be some sort of ‘default’ project to which all of their todos are put. Users should be able to create new projects and choose which project their todos go into.


[] You should separate your application logic (i.e. creating new todos, setting todos as complete, changing todo priority etc.) from the DOM-related stuff, so keep all of those things in separate modules.


[x] The look of the User Interface is up to you, but it should be able to do the following:
- View all projects.
- View all todos in each project (probably just the title and duedate… perhaps changing color for different priorities).
- Expand a single todo to see/edit its details.
- Delete a todo.


[] Since you are probably already using webpack, adding external libraries from npm is a cinch! You might want to consider using the following useful library in your code:
- date-fns gives you a bunch of handy functions for formatting and manipulating dates and times.


[x] We haven’t learned any techniques for actually storing our data anywhere, so when the user refreshes the page, all of their todos will disappear! You should add some persistence to this todo app using the Web Storage API.


[xx] localStorage allows you to save data on the user’s computer. The downside here is that the data is ONLY accessible on the computer that it was created on. Even so, it’s pretty handy! Set up a function that saves the projects (and todos) to localStorage every time a new project (or todo) is created, and another function that looks for that data in localStorage when your app is first loaded.


[x] Additionally, here are a couple of quick tips to help you not get tripped up:
Make sure your app doesn’t crash if the data you may want to retrieve from localStorage isn’t there!


[x] You can inspect data you saved in localStorage using DevTools! To do this, open the Application tab in DevTools and click on the Local Storage tab under Storage. Every time you add, update and delete data from localStorage in your app, those changes will be reflected in DevTools.


[x] localStorage uses JSON to send and store data, and when you retrieve the data, it will also be in JSON format. Keep in mind you cannot store functions in JSON, so you’ll have to figure out how to add methods back to your object properties once you fetch them.


_______________________________________________


Images:


Bg Images:

Theme 1: Northern Lights

Image: northern-lights.jpg
Artist: Vincent Guth
Url:https://unsplash.com/photos/silhouette-of-trees-near-aurora-borealis-at-night-62V7ntlKgL8


Theme 2: Blue Wave

Image: blue-wave.jpg
Artist: DrSJS
Url: https://pixabay.com/illustrations/abstract-lines-curve-wave-design-267056/

_______________________________________________


Tools:


Pull color palette from an image: https://coolors.co/image-picker

Color filter for SVGs: https://codepen.io/sosuke/pen/Pjoqqp

VS Keyboard Shortcuts: Use Ctrl + h to replace multiple words at once https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf


__________________________________________________


Resources:


When starting webpack always use the filename: webpack.config.js
https://stackoverflow.com/questions/53039834/webpack-not-reading-webpack-config-js/53039960

Add a checkbox to DOM with JS:
https://www.w3schools.com/jsref/dom_obj_checkbox.asp

Remove an item from an array by its value:
https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value

Setting div size to match its content (fit-content)
https://stackoverflow.com/questions/450903/how-can-i-make-a-div-not-larger-than-its-contents

fit-content
https://developer.mozilla.org/en-US/docs/Web/CSS/fit-content

https://www.yahubaba.com/css/css-grid-fit-content

How to create a collapsable section:
https://www.w3schools.com/howto/howto_js_collapsible.asp

Selecting read-only elements on the Dom (used to expand/collapse tasks)
https://developer.mozilla.org/en-US/docs/Web/API/Element/children

https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection/item

Add a dropdown list with JS:
https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically

Event listener not working with select element:
https://www.tutorialspoint.com/why-addeventlistener-to-select-element-does-not-work-in-javascript

Filtering duplicates from an array:
https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array

Add a default value to a date picker:
https://www.w3schools.com/jsref/prop_date_defaultvalue.asp

Create a checkbox with label using JS:
https://stackoverflow.com/questions/7608266/how-to-create-label-and-check-box-dynamically-in-javascript/7608609

Using an array inside a constructor:
https://stackoverflow.com/questions/50032748/using-an-array-inside-a-constructor-using-javascript/50032773#50032773

Create a new array by extracting object values:
https://www.youtube.com/watch?v=zGxREak6DQs

How to get the value out of a key value pair in an obj:
https://stackoverflow.com/questions/24927783/how-to-get-the-value-of-the-only-key-value-pair-in-object

Spread syntax:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

Removing the parent node of an event.target
https://stackoverflow.com/questions/46665554/remove-parent-element-on-click-with-plain-javascript

How to align one flex item to the right:
https://www.geeksforgeeks.org/how-to-align-one-item-to-the-right-using-css-flexbox/

Array.find() method
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find

JS get date methods:
https://www.w3schools.com/js/js_date_methods.asp

How to format a date in JS:
https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript

MDN Date object: See toISOString()
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

Get a date string in the format: yyyy-mm-dd from toISOString()
https://stackoverflow.com/questions/25159330/how-to-convert-an-iso-date-to-the-date-format-yyyy-mm-dd

Get future date from current date:
https://stackoverflow.com/questions/18583715/javascript-adding-time-for-a-future-date

How to filter an array without losing the index value:
https://stackoverflow.com/questions/49482946/how-can-i-filter-an-array-without-losing-the-index

https://stackoverflow.com/questions/7536993/how-can-i-filter-a-javascript-array-and-maintain-its-indices/72139728

PubSub Pattern:
https://gist.github.com/learncodeacademy/777349747d8382bfb722

.some() method
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some

Toggle a class:
https://www.w3schools.com/howto/howto_js_toggle_class.asp

Selecting multiple unrelated elements with querySelectorAll:
https://stackoverflow.com/questions/34001917/queryselectorall-with-multiple-conditions-in-javascript

Changing button states (to only have one selected in a group at a time):
https://stackoverflow.com/questions/27271440/javascript-for-changing-button-states

ClassList.contains():
https://stackoverflow.com/questions/5898656/check-if-an-element-contains-a-class-in-javascript

Linking an event listener to several btns:
https://forum.freecodecamp.org/t/linking-an-eventlistener-to-multiple-buttons/333174

How to find the closest parent of a selected type/class/id:
https://gomakethings.com/how-to-get-a-parent-element-with-vanilla-js/

Get the value of a radio btn:
https://stackoverflow.com/questions/15839169/how-to-get-the-value-of-a-selected-radio-button

How to convert an array into object keys
https://stackoverflow.com/questions/54789406/convert-array-to-object-keys

More info: using Object.fromEntries() to create an obj from a list of key:value pairs
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries

Using Object.entries to extract iterable keys and values from an obj:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries

Remove a key:value pair from an obj:
https://www.geeksforgeeks.org/how-to-remove-a-key-from-javascript-object/

Add a key:value pair to an existing obj (Obj.assign):
https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object

How to remove a border from dropdowns.
https://stackoverflow.com/questions/14639638/how-to-remove-border-of-drop-down-list-css