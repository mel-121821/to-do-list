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
        allTasks.forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.dataset.index = index;
            taskDiv.dataset.project = task.category

            // first row
            const taskCheckbox = createTaskCheckbox();
            const taskTitle = createTaskTitle(task);
            const ExpColBtn = createExpandCollapseBtn(taskDiv);
            const deleteBtn = createDeleteBtn(index, allTasks);

            // second row
            const taskDetails = document.createElement("div")
            const categoryDropdown = createCategoryDropdown(task)
            const datePicker = createDatePicker(task);
            const priorityDropdown = createPriorityDropdown(task);

            // third row
            const taskDescription = createDescription(task);

            // fourth row
            const checklistDiv = createUserChecklistDiv(task);
        
            const btnAddChecklistItem = document.createElement("button");
            const btnDiv = document.createElement("div");
            const saveBtn = document.createElement("button");
            const cancelBtn = document.createElement("button");

            saveBtn.textContent = "Save"
            cancelBtn.textContent = "Cancel"

            // append first row
            taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild(taskTitle);
            taskDiv.appendChild(ExpColBtn);
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


            btnDiv.append(saveBtn, cancelBtn)
            taskDiv.append( btnDiv);
            content.appendChild(taskDiv);
        })  
    }
    renderTaskList(allTasks, allCategories)
})();

// renderTaskList(allTasks, categories);


// create taskDiv components

function createTaskCheckbox() {
    // add function to subscribe to completed taskList
    const taskCheckbox = document.createElement("input");
    taskCheckbox.setAttribute("type", "checkbox");

    // make this into a seperate fn
    taskCheckbox.addEventListener("click", completeTask)
    // no brackets after completeTask, otherwise the function will be called immediately   
    return taskCheckbox
}

function completeTask() {
    // get the index from dataset
    const taskSelected = this.parentNode
    const dataObj = this.parentNode.dataset
    // it's given as a DOMStringMap (which is an obj), so you need to get the val from the key:val pair
    Object.keys(dataObj)[0]
    let key = Object.keys(dataObj)[0];
    let index = dataObj[key]
    console.log(taskSelected)
    console.log(index)
    
    const removed = toDoManager.getMasterTaskList().splice(index, 1)
    console.log(toDoManager.getMasterTaskList())
    console.log(removed)
    // need spread syntax here, otherwise removed will be placed into the completed list as an array of one
    moveTaskToCompleted(...removed);

    console.log(`This fn when called will send index ${index} to the completed tasks list `)
}

function updateMasterTaskList () {

}

function moveTaskToCompleted(removed) {
    toDoManager.getCompletedTaskList().push(removed)
    console.log(toDoManager.getCompletedTaskList)
}

function createTaskTitle(task) {
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = `${task.title}`
    return taskTitle
}

function createExpandCollapseBtn(taskDiv) {
    const expandBtn = document.createElement("button");
    expandBtn.textContent = "exp";
    expandBtn.classList.add("exp-col-btn")
    expandBtn.addEventListener("click", function(e) {      console.log("Expand/Collapse btn clicked");
        console.log(taskDiv.dataset.index)
        collapseTask(taskDiv);
    });
    return expandBtn;   
}

function collapseTask(taskDiv) {
    taskDiv.classList.toggle("active");
    const description = taskDiv.children.item(5);
    const userChecklistDiv = taskDiv.children.item(6)
    if (description.style.display !== "none" && userChecklistDiv.style.display !== "none") {
        description.style.display = "none"
        userChecklistDiv.style.display = "none"
    } else {
        description.style.display = "block"
        userChecklistDiv.style.display = "flex"
    };
};

function createDeleteBtn (index, allTasks) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "del"
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function (e) {
        console.log("Delete btn clicked");
        // console.log(taskDiv.dataset.index);
        console.log(`User wishes to remove the following task: ${e.target.parentNode} at index: ${e.target.parentNode.dataset.index}`)
        deleteTask(allTasks, e);
        console.log(allTasks);
        // function to re-render taskList
    })
    return deleteBtn
}

function deleteTask(allTasks, e) {
    allTasks.splice(e.target.parentNode.dataset.index, 1);
    return allTasks;
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
    categoryDropdown.addEventListener("change", (e) => {
        task.category = e.target.value
        console.log(e.target.value);
        console.log(task.category)
    })
    return categoryDropdown;
}

function createDatePicker(task) {
    const datePicker = document.createElement("input")
    datePicker.setAttribute("type", "date");
    datePicker.defaultValue = task.dueDate;
    datePicker.addEventListener("change", function(e) {
        task.dueDate = e.target.value
        console.log(task.dueDate)
    })
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
    priorityDropdown.addEventListener("change", (e) => {
        task.priority = e.target.value
        console.log(e.target.value);
        console.log(task.priority)
    })
    return priorityDropdown;
}

function createDescription (task) {
    const description = document.createElement("textarea")
    description.maxLength = 3000;
    description.rows = 30;
    description.textContent = task.description;
    return description;
}

function createUserChecklistDiv (task) {
    const userChecklistDiv = document.createElement("div");
    userChecklistDiv.classList.add("user-checklist-div");
    const legend = document.createElement("legend");
    legend.textContent = "Your checklist items";
    const addBtn = createUserCheckListAddBtn()
    
    userChecklistDiv.appendChild(legend);
    
    createUserChecklistItems(task, userChecklistDiv)
    userChecklistDiv.append(addBtn);
    return userChecklistDiv;
} 

// Needs decoupling

function createUserChecklistItems(task, userChecklistDiv) {
    const checklist = task.userChecklist;
    checklist.forEach((item, index) => {
        const userItemDiv = document.createElement("ol");
        const itemCheckbox = document.createElement("input");
        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.id = item;
        const label = document.createElement("label");
        label.setAttribute("for", `${item}`)
        label.innerHTML = `${item}`;
        const deleteBtn = createUserChecklistDeleteBtn(checklist, index);
        userItemDiv.append(itemCheckbox, label, deleteBtn)
        userChecklistDiv.appendChild(userItemDiv)
    })
}

function createUserChecklistDeleteBtn(checklist, index) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "-"
    deleteBtn.addEventListener("click", function(e) { deleteChecklistItem(checklist, index)
        console.log(checklist)
    })
    return deleteBtn
}

function createUserCheckListAddBtn() {
    const checklistAddBtn = document.createElement("button");
    checklistAddBtn.textContent = "+"
    checklistAddBtn.addEventListener("click", e => console.log(`user wishes to add a checklist item to ${e.target.parentNode.parentNode.dataset.index}`))
    // selects event target > checklistDiv > taskDiv > dataset.index
    return checklistAddBtn
}

function deleteChecklistItem(checklist, index) {
    checklist.splice(index, 1);
    return checklist;
}

function refreshUserChecklistData() {
    while (checklist.firstChild) {
        checklist.removeChild(checklist.lastChild);
    }
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