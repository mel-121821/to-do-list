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
const taskDisplay = (function() {

    // cacheDOM
    const addTaskBtn = document.querySelector(".title > button")
    const content = document.querySelector("#content")

    // get data
    const allTasks = toDoManager.getMasterTaskList();
    const allCategories = toDoManager.getCategories(); 
    const allPriorities = toDoManager.getPriorities();

    // render

    function renderTaskList (allTasks) {
        content.innerHTML = "";
        allTasks.forEach((task, index) => {

            // create div for each task
            const taskDiv = document.createElement("div");
            taskDiv.dataset.index = index;
            taskDiv.dataset.project = task.category

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
            // change event listeners to submit rather than change
            // category dropdown
            const categoryDropdown = createCategoryDropdown(task)
            categoryDropdown.addEventListener("change", changeCategory) 

            // date picker
            const datePicker = createDatePicker(task);
            datePicker.addEventListener("change", changeDueDate)

            // priority dropdown
            const priorityDropdown = createPriorityDropdown(task);
            priorityDropdown.addEventListener("change", changePriority)

            // 3rd row - description
            const taskDescription = createDescription(task);

            // 4th row - user checklist
            const checklistDiv = createUserChecklistDiv(task);
            
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
            taskDetails.appendChild(categoryDropdown);
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
    renderTaskList(allTasks)
    return{ renderTaskList }
})();


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
    taskDisplay.renderTaskList(toDoManager.getMasterTaskList())
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
    const userChecklistDiv = e.target.parentNode.children.item(6);
    if (description.style.display !== "none" && userChecklistDiv.style.display !== "none") {
        description.style.display = "none"
        userChecklistDiv.style.display = "none"
    } else {
        description.style.display = "block"
        userChecklistDiv.style.display = "flex"
    };
};

function deleteTask() {
    const index = this.parentNode.dataset.index;
    console.log(`User has removed the following task: ${toDoManager.getMasterTaskList()[index].title} at index: ${index}`)
    removeTaskFromList(index)
}

function createCategoryDropdown(task) {
    const allProjectCategories = toDoManager.getCategories();
    const categoryDropdown = document.createElement("select");
    // categoryDropdown.id = "category-dropdown";
    for (const category of allProjectCategories) {
        const option = document.createElement("option")
        option.value = category;
        option.textContent = category;
        if (option.textContent === task.category) {
            option.selected = true;
        } else {
            // do nothing
        }
        categoryDropdown.appendChild(option);
    }
    return categoryDropdown;
}

function changeCategory() {
    // this = dropdown > parentNode = categoriesDiv > parentNode = TaskDiv > dataset > index
    toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index].category = this.value;
    console.log(`Category has been updated to: ${this.value}`);
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

// can't select createUserChecklistDiv according to proximity of other elements as it has not been appended to the DOM yet. May change to append to DOM before selecting due to proximity. Can put userChecklistDiv into renderTaskList and then use other fn()s to add elements to it.

function createUserChecklistDiv (task) {
    const userChecklistDiv = document.createElement("div");
    userChecklistDiv.classList.add("user-checklist-div");
    console.log()
    // userChecklistDiv.style.display = "none"

    // create legend
    const legend = document.createElement("legend");
    legend.textContent = "Your checklist items";    
    
    // create checklist items section
    const checklistItemsDiv = document.createElement("div")
    createUserChecklistItems(task, checklistItemsDiv)

    // create btn to add checklist item
    const addBtn = document.createElement("button");
    addBtn.textContent = "+"
    addBtn.addEventListener("click", addChecklistItem)

    // append items to checklist div
    userChecklistDiv.appendChild(legend);
    userChecklistDiv.appendChild(checklistItemsDiv);
    userChecklistDiv.append(addBtn);
    return userChecklistDiv;
} 

// Needs decoupling

function createUserChecklistItems(task, checklistItemsDiv) {
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

    createUserChecklistItems(toDoManager.getMasterTaskList()[parentDivIndex], this.parentNode.parentNode)

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
    createUserChecklistItems(selectedTask, checklistItemsDiv);

    // To be replaced with a fn() to get user input   
    console.log("User added a new checklist item:")
    console.log(toDoManager.getMasterTaskList()[parentDivIndex].userChecklist)   
}

function saveTaskInfo() {
    console.log("User saves task info for the following task:")
    console.log(toDoManager.getMasterTaskList()[this.parentNode.parentNode.dataset.index].title)
    // re-render when clicked
    // taskDisplay.renderTaskList(toDoManager.getMasterTaskList())
}


function refreshTaskData() {
    while (content.firstChild) {
        content.removeChild(content.lastChild);
    }
}








//__________Unused Code (Delete when finished)__________


// console.log(masterTaskList);
// console.log(categories)
// const date = format(new Date(2014, 4, 4), "MM/dd/yyyy");
// console.log(date)
// console.log(getPriorities())

// const expBtns = document.querySelectorAll(".expand");
// console.log(expBtns);
// console.log(typeof(expBtns))
// for (const expBtn of expBtns) {
//     expBtn.addEventListener("click", function(e) {
//         getIndexOfTask(expBtns)
//         console.log("expand button clicked")
//     });
// }

// function getIndexOfTask(taskList, index) {
//     console.log(index);
// }

//function renderTaskList(obj) {
    //     const content = document.querySelector("#content");
    //     for (const task of obj) {
    //         // create elements
    //         const taskDiv = document.createElement("div");
    //         const taskCheckbox = document.createElement("input");
    //         taskCheckbox.setAttribute("type", "checkbox");
    //         const title = document.createElement("h3");
    //         const expandBtn = document.createElement("button");
    //         const deleteBtn = document.createElement("button");
    //         const taskDetails = document.createElement("div")
    //         const category = document.createElement("div");
    //         const dueDate = document.createElement("div");
    //         const priority = document.createElement("div");
    //         const btnDiv = document.createElement("div");
    //         const saveBtn = document.createElement("button");
    //         const cancelBtn = document.createElement("button");
    
    //         // populate info
    //         title.textContent = `${task.title}`;
    //         expandBtn.textContent = "exp";
    //         deleteBtn.textContent = "del";
    //         category.textContent = `${task.category}`;
    //         dueDate.textContent = `${task.dueDate}`;
    //         priority.textContent = `${task.priority}`;
    //         saveBtn.textContent = "Save"
    //         cancelBtn.textContent = "Cancel"
    
    //         // append
    //         taskDetails.append(category, dueDate, priority);
    //         btnDiv.append(saveBtn, cancelBtn)
    //         taskDiv.append(taskCheckbox, title, expandBtn, deleteBtn, taskDetails, btnDiv);
    //         content.appendChild(taskDiv);
    //     }
    // }