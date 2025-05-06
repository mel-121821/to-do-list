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


// display obj IIFE
const domManipulator = (function() {

    // cacheDOM
    const addTaskBtn = document.querySelector(".title > button")
    const content = document.querySelector("#content")

    // get data
    const allTasks = toDoManager.getMasterTaskList();
    const allProjects = toDoManager.getProjects(); 
    const allPriorities = toDoManager.getPriorities();

    // render

    function renderTaskList (allTasks) {
        content.innerHTML = "";
        allTasks.forEach((task, index) => {

            // create div for each task
            const taskDiv = document.createElement("div");
            taskDiv.dataset.index = index;
            taskDiv.dataset.project = task.project

            // 1st row
            // task checkbox
            const taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            taskCheckbox.addEventListener("click", completeTask)
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
            deleteBtn.addEventListener("click", deleteTask)
            
            // 2nd row - details section in own div 
            const taskDetails = document.createElement("div")

            // keeping these fn()s seperate from render fn() as they are more complex
            // will eventually need to change event listeners to submit rather than change
            // project dropdown
            const projectDropdown = createProjectDropdown(task)
            projectDropdown.addEventListener("change", changeProject) 

            // date picker
            const datePicker = createDatePicker(task);
            datePicker.addEventListener("change", changeDueDate)

            // priority dropdown
            const priorityDropdown = createPriorityDropdown(task);
            priorityDropdown.addEventListener("change", changePriority)

            // 3rd row - description
            const taskDescription = createDescription(task);

            // 4th row - user checklist
            const checklistDiv = createChecklistDiv(task);
            
            // 5th row save and cancel section - has own  div
            const btnDiv = document.createElement("div");

            // save btn
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "Save"
            saveBtn.addEventListener("click", saveTaskInfo)

            // cancel btn
            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "Cancel"

            // append first row
            taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(expandBtn);
            taskDiv.appendChild(deleteBtn);

            // append details row in own div
            taskDetails.appendChild(projectDropdown);
            taskDetails.appendChild(datePicker);
            taskDetails.appendChild(priorityDropdown);
            taskDiv.appendChild(taskDetails);

            // append description
            taskDiv.appendChild(taskDescription);

            // append user checklist
            taskDiv.appendChild(checklistDiv);

            // append btns
            btnDiv.append(saveBtn, cancelBtn)
            taskDiv.append( btnDiv);
            content.appendChild(taskDiv);
        })  
    }

    function completeTask() {
        const index = this.parentNode.dataset.index;
        const taskRemoved = removeTaskFromList(index)
        // need spread syntax here, otherwise taskRemoved will be placed into the completed list as an array of one
        moveTaskToCompleted(...taskRemoved);
        console.log(toDoManager.getMasterTaskList())
    }

    function removeTaskFromList(index) {
        const removed = toDoManager.getMasterTaskList().splice(index, 1)
        console.log("Updated masterTaskList:")
        console.log(toDoManager.getMasterTaskList())
        console.log("The following task has been removed:")
        console.log(removed)
        domManipulator.renderTaskList(toDoManager.getMasterTaskList())
        return removed
    }

    function moveTaskToCompleted(removed) {
        toDoManager.getCompletedTaskList().push(removed)
        console.log("The following task has been moved to the completedTaskList:")
        console.log(toDoManager.getCompletedTaskList())
    }      
        
    function collapseTask(e) {
        // considered adding save/cancell btns to collapsable items, but decided against it, as the user may still want to save task details without expanding the menu
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

    function deleteTask() {
        const index = this.parentNode.dataset.index;
        console.log(`User has removed the following task: ${toDoManager.getMasterTaskList()[index].title} at index: ${index}`)
        removeTaskFromList(index)
    }

    function createProjectDropdown(task) {
        const allProjects = toDoManager.getProjects();
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

    function changeProject() {
        // this = dropdown > parentNode = ProjectsDiv > parentNode = TaskDiv > dataset > index
        toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index].project = this.value;
        console.log(`Project has been updated to: ${this.value}`);
        console.log(toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index])
    }

    function createDatePicker(task) {
        const datePicker = document.createElement("input")
        datePicker.setAttribute("type", "date");
        datePicker.defaultValue = task.dueDate;
        return datePicker;
    }

    function changeDueDate() {
        toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index].dueDate = this.value;
        console.log(`dueDate has been updated to: ${this.value}`);
        console.log(toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index])
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

    function changePriority() {
        toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index].priority = this.value;
        console.log(`Priority has been updated to: ${this.value}`);
        console.log(toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index])
    }

    function createDescription (task) {
        const description = document.createElement("textarea")
        description.maxLength = 3000;
        description.rows = 30;
        description.textContent = task.description;
        // description.style.display = "none"
        return description;
    }

    // can't select createChecklistDiv according to proximity of other elements as it has not been appended to the DOM yet. May change to append to DOM before selecting due to proximity. Can put checklistDiv into renderTaskList and then use other fn()s to add elements to it.

    function createChecklistDiv (task) {
        const checklistDiv = document.createElement("div");
        checklistDiv.classList.add("user-checklist-div");
        console.log()
        // checklistDiv.style.display = "none"

        // create legend
        const legend = document.createElement("legend");
        legend.textContent = "Your checklist items";    
        
        // create checklist items section
        const checklistItemsDiv = document.createElement("div")
        createChecklistItems(task, checklistItemsDiv)

        // create btn to add checklist item
        const addBtn = document.createElement("button");
        addBtn.textContent = "+"
        addBtn.addEventListener("click", addChecklistItem)

        // append items to checklist div
        checklistDiv.appendChild(legend);
        checklistDiv.appendChild(checklistItemsDiv);
        checklistDiv.append(addBtn);
        return checklistDiv;
    } 

    // Needs decoupling

    function createChecklistItems(task, checklistItemsDiv) {
        // remove existing elements before adding updated list to page
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
            itemCheckbox.addEventListener("change", strikethroughChecklistItem)

            // create checkbox label
            const label = document.createElement("label");
            label.setAttribute("for", `${item}`)
            label.innerHTML = `${item}`;
            // event listener, set display to strikethrough item

            // create delete btn
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "-"
            deleteBtn.addEventListener("click", deleteUserChecklistItem)

            // append items
            userItemDiv.append(itemCheckbox, label, deleteBtn)
            checklistItemsDiv.appendChild(userItemDiv);
        })
    }

    function deleteUserChecklistItem() {
        const parentDivIndex = this.parentNode.parentNode.parentNode.parentNode.dataset.index;
        const checklistIndex = this.parentNode.dataset.itemNum;
        toDoManager.getMasterTaskList()[parentDivIndex].userChecklist.splice(checklistIndex, 1)

        createChecklistItems(toDoManager.getMasterTaskList()[parentDivIndex], this.parentNode.parentNode)

        console.log(`User deleted checklist item at index: ${checklistIndex}`)
        console.log("New list of user items:")
        console.log(toDoManager.getMasterTaskList()[parentDivIndex].userChecklist)
    }

    function strikethroughChecklistItem() {
        console.log(this.parentNode.children.item(1))
        const itemLabel = this.parentNode.children.item(1);
        // itemLabel.style.textDecoration = "line-through"
        itemLabel.style.textDecoration !== "line-through" ? itemLabel.style.textDecoration = "line-through" : itemLabel.style.textDecoration = "none"
    }

    function addChecklistItem() {
        const parentDivIndex = this.parentNode.parentNode.dataset.index;
        const selectedTask = toDoManager.getMasterTaskList()[parentDivIndex]
        const checklistItemsDiv = this.previousSibling
        console.log(this.previousSibling)
        console.log(checklistItemsDiv)
        console.log(selectedTask)
        selectedTask.userChecklist.push("Checklist item added")
        createChecklistItems(selectedTask, checklistItemsDiv);

        // To be replaced with a fn() to get user input   
        console.log("User added a new checklist item:")
        console.log(toDoManager.getMasterTaskList()[parentDivIndex].userChecklist)   
    }

    function saveTaskInfo() {
        console.log("User saves task info for the following task:")
        console.log(toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index].title)
        // re-render when clicked
        // domManipulator.renderTaskList(toDoManager.getMasterTaskList())
    }


    // Project elements and event listeners (left sidebar)
    
    // Today tasks
    const todayTasksBtn = document.querySelector(".today > button");
    todayTasksBtn.addEventListener("click", getTodayTasks)

    // This week tasks
    const thisWeekTasksBtn = document.querySelector(".this-week > button")
    thisWeekTasksBtn.addEventListener("click", getThisWeekTasks)

    // Completed tasks
    const completeBtn = document.querySelector(".complete > button")
    completeBtn.addEventListener("click", getCompletedTasks)

    // Important tasks
    const importantBtn = document.querySelector(".important > button")
    importantBtn.addEventListener("click", getImportantTasks)

    // Overdue tasks
    const overdueBtn = document.querySelector(".overdue > button")
    overdueBtn.addEventListener("click", getOverdueTasks)
    
    // Important notes about date formats: 
    // months are indexed at zero! January == 00
    // .getDay() doesn't return the day of the week but the location of the weekday related to the week, use .getDate() instead

    function getFormattedDate() {
        const todaysDate = new Date()
        const year = todaysDate.getFullYear();
        let month = todaysDate.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`
        } else {
            // do nothing
        }
        let day = todaysDate.getDate();
        if (todaysDate.getDate() < 10) {
            day = `0${todaysDate.getDate()}`
        } else {
            // do nothing
        }
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }

    // Event listener fn()s
    function getTodayTasks() {
        // get masterTaskList
        const allTasks = toDoManager.getMasterTaskList();
        // get current date
        const today = getFormattedDate();
         // filter list by due date
        const filteredTaskList = allTasks.filter((task) => task.dueDate === `${today}`)
        // call renderTaskList with new filtered list as argument
        renderTaskList(filteredTaskList);
        console.log("User clicks todayTasks")
        console.log(allTasks)
        console.log(today)
        console.log(filteredTaskList)
    }

    function getThisWeekTasks() {
        console.log("User clicks this WeekTasks")
    }

    function getCompletedTasks() {
        console.log("User clicks completedTasks")
    }

    function getImportantTasks() {
        console.log("User clicks importantTasks")
    }

    function getOverdueTasks() {
        console.log("User clicks overdueTasks")
    }

    function renderMyProjectsList() {

    }

    // Initial render
    renderTaskList(allTasks);

    return{ renderTaskList }
})();






//__________Unused Code (Delete when finished)__________


