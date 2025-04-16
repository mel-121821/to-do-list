# to-do-list

Instructions

[] Your ‘todos’ are going to be objects that you’ll want to dynamically create, which means either using factories or constructors/classes to generate them.


[] Brainstorm what kind of properties your todo-items are going to have. At a minimum they should have a title, description, dueDate and priority. You might also want to include notes or even a checklist.


[] Your todo list should have projects or separate lists of todos. When a user first opens the app, there should be some sort of ‘default’ project to which all of their todos are put. Users should be able to create new projects and choose which project their todos go into.


[] You should separate your application logic (i.e. creating new todos, setting todos as complete, changing todo priority etc.) from the DOM-related stuff, so keep all of those things in separate modules.


[] The look of the User Interface is up to you, but it should be able to do the following:
- View all projects.
- View all todos in each project (probably just the title and duedate… perhaps changing color for different priorities).
- Expand a single todo to see/edit its details.
- Delete a todo.


[] Since you are probably already using webpack, adding external libraries from npm is a cinch! You might want to consider using the following useful library in your code:
- date-fns gives you a bunch of handy functions for formatting and manipulating dates and times.


[] We haven’t learned any techniques for actually storing our data anywhere, so when the user refreshes the page, all of their todos will disappear! You should add some persistence to this todo app using the Web Storage API.


[] localStorage allows you to save data on the user’s computer. The downside here is that the data is ONLY accessible on the computer that it was created on. Even so, it’s pretty handy! Set up a function that saves the projects (and todos) to localStorage every time a new project (or todo) is created, and another function that looks for that data in localStorage when your app is first loaded.


[] Additionally, here are a couple of quick tips to help you not get tripped up:
Make sure your app doesn’t crash if the data you may want to retrieve from localStorage isn’t there!


[] You can inspect data you saved in localStorage using DevTools! To do this, open the Application tab in DevTools and click on the Local Storage tab under Storage. Every time you add, update and delete data from localStorage in your app, those changes will be reflected in DevTools.


[] localStorage uses JSON to send and store data, and when you retrieve the data, it will also be in JSON format. Keep in mind you cannot store functions in JSON, so you’ll have to figure out how to add methods back to your object properties once you fetch them.


_______________________________________________


Images:


Bg Images:


_______________________________________________


Tools:


Pull color palette from an image: https://coolors.co/image-picker


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

Selecting read-only elements on the Dom (used to expand/collapse tasks)
https://developer.mozilla.org/en-US/docs/Web/API/Element/children