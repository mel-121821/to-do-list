//__________index.js__________
//__________DOM Manipulation__________

// Reassessed plan, set index.js to only do the following:
// interact with DOM via query selectors
// generate popups to gather user data
// local storage??
// event listeners

// home.js should include logic in the following categories:
// DOM manipulation
// To-do data managment

// Have all elements render on page whether they are displayed or not

import "./styles.css";

// packages
import { format } from "date-fns"

// logic functions
import { toDoManager } from "./home.js";
import { projectManager } from "./projects.js";
import { pubSub } from "./home.js";


// display obj IIFE
const domManipulator = (function() {

    // cacheDOM
    const addTaskBtn = document.querySelector(".title > button")
    const content = document.querySelector("#content")

    // get data
    const allTasks = toDoManager.getMasterTaskList();
    const allProjects = projectManager.getProjects(); 
    const allPriorities = toDoManager.getPriorities();

    // render

    function renderTaskList (allTasks) {
        content.innerHTML = "";
        allTasks.forEach((task, index) => {

            // create div for each task
            const taskDiv = document.createElement("div");

            // check if index of masterTaskList already exists, if not, assign it

            // needed to remove this as it causes the index to be preserved when a task is complete, which throws off indexes of remaining elements

            // if (!task.index){
            //         task.index = index
            // } else if (task.index) {
            //     // do nothing
            // }
            taskDiv.dataset.index = index;
            // console.log(`When renderTaskList is called , the index of ${task.title} is ${index}`)
            // console.log(task.index)
            // console.log(taskDiv.dataset.index)
            // taskDiv.dataset.project = task.project;

            // 1st row
            const taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            taskCheckbox.addEventListener("click", toDoManager.completeTask)
            // no brackets after completeTask, otherwise the function will be called immediately   

            // task title
            const taskTitle = document.createElement("h3");
            taskTitle.textContent = `${task.title}`
            taskTitle.addEventListener("click", collapseTask)
            
            // expand/collapse btn
            const expandBtn = document.createElement("button");
            expandBtn.textContent = "exp";
            expandBtn.classList.add("exp-col-btn")
            expandBtn.addEventListener("click", collapseTask)

            // delete btn
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "del"
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", toDoManager.deleteTask)
            
            // 2nd row - details section in own div 
            // keeping these fn()s seperate from render fn() as they are more complex
            const taskDetails = document.createElement("div")

            // project dropdown
            const projectDiv = document.createElement("div");
            const projectLabel = document.createElement("label");
            projectLabel.innerHTML = "Project:";
            taskDetails.appendChild(projectLabel);
            const projectDropdown = createProjectDropdown(task)
            
            // date picker
            const dateDiv = document.createElement("div")
            const dateLabel = document.createElement("label")
            dateLabel.innerHTML = "Due date:"
            const datePicker = createDatePicker(task);

            // priority dropdown
            const priorityDiv = document.createElement("div");
            const priorityLabel = document.createElement("label");
            priorityLabel.innerHTML = "Priority:"
            const priorityDropdown = createPriorityDropdown(task);

            // 3rd row - description
            const taskDescription = createDescription(task);

            // 4th row - user checklist
            const checklistDiv = createChecklistDiv(task);
            
            // 5th row save and cancel section - has own  div
            const btnDiv = document.createElement("div");

            // save btn
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "Save"
            saveBtn.addEventListener("click", toDoManager.updateTask)

            // cancel btn
            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancel"

            // append first row
            taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(expandBtn);
            taskDiv.appendChild(deleteBtn);

            // append details row in own div
            projectDiv.append(projectLabel, projectDropdown)
            dateDiv.append(dateLabel, datePicker)
            priorityDiv.append(priorityLabel, priorityDropdown)

            taskDetails.appendChild(projectDiv);
            taskDetails.appendChild(dateDiv);
            taskDetails.appendChild(priorityDiv);
            taskDiv.appendChild(taskDetails);

            // append description and checklist
            taskDiv.appendChild(taskDescription);
            taskDiv.appendChild(checklistDiv);

            // append btns
            btnDiv.append(saveBtn, cancelBtn)
            taskDiv.append(btnDiv);
            content.appendChild(taskDiv);
        })  
    }  
        
    function collapseTask(e) {
        // considered adding save/cancel btns to collapsable items, but decided against it, as the user may still want to save task details without expanding the menu
        const description = e.target.parentNode.children.item(5);
        const checklistDiv = e.target.parentNode.children.item(6);
        if (description.style.display !== "none" && checklistDiv.style.display !== "none") {
            description.style.display = "none"
            checklistDiv.style.display = "none"
        } else {
            description.style.display = "block"
            checklistDiv.style.display = "flex"
        };
    };

    function createProjectDropdown(task) {
        const allProjects = projectManager.getProjects();
        const projectDropdown = document.createElement("select");
        // projectDropdown.id = "project-dropdown";
        for (const project of allProjects) {
            const option = document.createElement("option")
            option.value = project;
            option.textContent = project;
            if (option.textContent === task.project) {
                option.selected = true;
            } else {
                // do nothing
            }
            projectDropdown.appendChild(option);
        }
        
        return projectDropdown;
    }

    function createDatePicker(task) {
        const datePicker = document.createElement("input")
        datePicker.setAttribute("type", "date");
        datePicker.defaultValue = task.dueDate;
        return datePicker;
    }

    function createPriorityDropdown (task) {
    const priorities = toDoManager.getPriorities();
        const priorityDropdown = document.createElement("select");
        for (const priority of priorities) {
            const option = document.createElement("option");
            option.value = priority;
            option.textContent = priority;
            if (option.textContent === task.priority) {
                option.selected = true;
            } else {
                // do nothing
            }
            priorityDropdown.appendChild(option)
        }
        return priorityDropdown;
    }

    function createDescription (task) {
        const description = document.createElement("textarea")
        description.maxLength = 3000;
        description.rows = 30;
        description.textContent = task.description;
        // description.style.display = "none"
        return description;
    }

    function createChecklistDiv (task) {
        const checklistDiv = document.createElement("div");
        checklistDiv.classList.add("user-checklist-div");
        // checklistDiv.style.display = "none"

        // create legend
        const legend = document.createElement("legend");
        legend.textContent = "Your checklist items";    
        
        // create checklist items section
        const checklistItemsDiv = document.createElement("div")

        // need to have everything appended to the DOM before calling this, otherwise you can't access the div as it doesn't exist yet
        // renderChecklistItems(task, checklistItemsDiv)

        // create btn to add checklist item
        const addBtn = document.createElement("button");
        addBtn.textContent = "+"
        addBtn.addEventListener("click", toDoManager.addChecklistItem)

        // append items to checklist div
        checklistDiv.appendChild(legend);
        checklistDiv.appendChild(checklistItemsDiv);
        checklistDiv.append(addBtn);
        return checklistDiv;
    } 

    // Needs decoupling

    function renderChecklistItems(allTasks) {
        // remove existing elements before adding updated list to page
        console.log(allTasks)
        allTasks.forEach((task, index) => {
            // console.log(`When renderChecklistItems is called , the index of ${task.title} is ${index}`)
            // console.log(index)
            const checklistItemsDiv = content.children.item(index).children.item(6).children.item(1)
            checklistItemsDiv.innerHTML = ""
            const checklist = task.userChecklist;
            checklist.forEach((item, index) => {
                const userItemDiv = document.createElement("ol");
                userItemDiv.dataset.itemNum = index
                // console.log(userItemDiv.dataset.itemNum)

                // create checkbox
                const itemCheckbox = document.createElement("input");
                itemCheckbox.setAttribute("type", "checkbox");
                itemCheckbox.id = item;
                itemCheckbox.addEventListener("change", toDoManager.completeChecklistItem)

                // create checkbox label
                const label = document.createElement("label");
                label.setAttribute("for", `${item}`)
                label.innerHTML = `${item}`;
                
                // create delete btn
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "-"
                deleteBtn.addEventListener("click", toDoManager.deleteUserChecklistItem)

                // append items
                userItemDiv.append(itemCheckbox, label, deleteBtn)
                checklistItemsDiv.appendChild(userItemDiv);
            })
        })
    }

    function renderFullTasks(allTasks) {
        renderTaskList(allTasks)
        renderChecklistItems(allTasks)
    }


    // Project elements and event listeners (left sidebar)
    
    // wrap this
    // Today tasks
    const todayTasksBtn = document.querySelector(".today > button");
    todayTasksBtn.addEventListener("click", renderTodayTasks)

    // This week tasks
    const thisWeekTasksBtn = document.querySelector(".this-week > button")
    thisWeekTasksBtn.addEventListener("click", renderThisWeekTasks)

    // Completed tasks
    const completeBtn = document.querySelector(".complete > button")
    completeBtn.addEventListener("click", renderCompletedTasks)

    // Important tasks
    const importantBtn = document.querySelector(".important > button")
    importantBtn.addEventListener("click", renderImportantTasks)

    // Overdue tasks
    const overdueBtn = document.querySelector(".overdue > button")
    overdueBtn.addEventListener("click", renderOverdueTasks)
    
    // Important notes about date formats: 
    // months are indexed at zero! January == 00
    // .getDay() doesn't return the day of the week but the location of the weekday related to the week, use .getDate() instead

    function getFormattedDate() {
        const formattedDate = new Date().toISOString().substring(0, 10);
        return formattedDate
    }

    // Event listener fn()s
    function renderTodayTasks() {
        const allTasks = toDoManager.getMasterTaskList();
        const today = getFormattedDate();
        const filteredToToday = allTasks.filter(function(task, index){ 
            // preserve original index on masterTaskList
            task.index = index;
            return task.dueDate === `${today}`
        })

        // call renderTaskList with new filtered list as argument
        renderTaskList(filteredToToday);
        console.log("User clicks todayTasks")
        console.log(`Date: ${today}`)
        console.log("Current listed filtered to today:")
        console.log(filteredToToday)
        console.log(`Original index of the task: "${filteredToToday[0].title}" in masterTaskList is ${filteredToToday[0].index}`)
    }


    function getDateInOneWeek() {
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() + 7)).toISOString().substring(0, 10);
        return nextWeek
    }

    function renderThisWeekTasks() {
        const allTasks = toDoManager.getMasterTaskList();
        const today = getFormattedDate();
        const oneWeekFromToday = getDateInOneWeek()
        const filteredToWeek = allTasks.filter((task) => task.dueDate >= `${today}` && task.dueDate <= `${oneWeekFromToday}`) 
        renderTaskList(filteredToWeek);
        console.log("User clicks this WeekTasks")
        console.log(`Date range: ${today} to ${oneWeekFromToday}`);
        console.log(filteredToWeek)
    }

    function renderCompletedTasks() {
        console.log("User clicks completedTasks")
    }

    function renderImportantTasks() {
        console.log("User clicks importantTasks")
    }

    function renderOverdueTasks() {
        console.log("User clicks overdueTasks")
    }

    function renderMyProjectsList() {

    }

    // pubSubs
    pubSub.on("taskRemoved", renderFullTasks)
    pubSub.on("taskUpdated", renderFullTasks)
    pubSub.on("checklistItemRemoved", renderChecklistItems)
    pubSub.on("checklistItemAdded", renderChecklistItems)

    // Initial render
    // renderTaskList(allTasks);
    // renderChecklistItems(allTasks)
    renderFullTasks(allTasks)

    return{ renderTaskList }
})();






//__________Unused Code (Delete when finished)__________


