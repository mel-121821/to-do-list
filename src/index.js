//__________index.js__________

import "./styles.css";
import { test } from "./home.js"

import { masterTaskList } from "./home.js";


console.log(test);
console.log(masterTaskList);

// for rendering
function expandTaskToFullView(obj) {
    // 
}



// function showIndex (obj) {
//     const expandBtn = document.querySelector("#content > div");
//     expandBtn.addEventListener("click", 
//         console.log("expand button clicked")
//     );
// }



// expandTaskToFullView(masterTaskList)

function renderTaskList(obj) {
    const content = document.querySelector("#content");
    for (const task of obj) {
        // create elements
        const taskDiv = document.createElement("div");
        const taskCheckbox = document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");
        const title = document.createElement("h3");
        const expandBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        const taskCategories = document.createElement("div")
        const projectType = document.createElement("div");
        const dueDate = document.createElement("div");
        const priority = document.createElement("div");
        const btnDiv = document.createElement("div");
        const saveBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        // populate info
        title.textContent = `${task.title}`;
        expandBtn.textContent = "exp";
        deleteBtn.textContent = "del";
        projectType.textContent = `${task.projectType}`;
        dueDate.textContent = `${task.dueDate}`;
        priority.textContent = `${task.priority}`;
        saveBtn.textContent = "Save"
        cancelBtn.textContent = "Cancel"

        // append
        taskCategories.append(projectType, dueDate, priority);
        btnDiv.append(saveBtn, cancelBtn)
        taskDiv.append(taskCheckbox, title, expandBtn, deleteBtn, taskCategories, btnDiv);
        content.appendChild(taskDiv);
    }
}


// For full expanded view during development
function renderTaskListDev (obj) {
    // create elements
    const content = document.querySelector("#content");
    obj.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        const taskCheckbox = document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");
        const title = document.createElement("h3");
        const expandBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        const taskCategories = document.createElement("div")
        const projectType = document.createElement("div");
        const dueDate = document.createElement("div");
        const priority = document.createElement("div");
        const description = document.createElement("p");
        const userChecklistDiv = document.createElement("div");
        const userChecklist = document.createElement("ol");
        const userAddedCheckbox = document.createElement("input");
        userAddedCheckbox.setAttribute("type", "checkbox");
        const userAddedChecklistItem = document.createElement("p");
        const btnAddChecklistItem = document.createElement("button");
        const btnDiv = document.createElement("div");
        const saveBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        // event listeners
        expandBtn.addEventListener("click", function(e) { console.log("Expand/Collapse btn clicked");
        console.log(taskDiv.dataset.index)
        collapseTask(taskDiv);
        });

        deleteBtn.addEventListener("click", function(e) {
            console.log("Delete btn clicked");
        })

        // populate info
        title.textContent = `${task.title}`;
        expandBtn.textContent = "exp";
        deleteBtn.textContent = "del";
        projectType.textContent = `${task.projectType}`;
        dueDate.textContent = `${task.dueDate}`;
        priority.textContent = `${task.priority}`;
        description.textContent = `${task.description}`;
        userAddedChecklistItem.textContent = "User's input goes here";
        btnAddChecklistItem.textContent = "+"
        saveBtn.textContent = "Save"
        cancelBtn.textContent = "Cancel"

        // append
        taskCategories.append(projectType, dueDate, priority);
        userChecklist.append(userAddedCheckbox, userAddedChecklistItem)
        userChecklistDiv.append(userChecklist, btnAddChecklistItem);
        btnDiv.append(saveBtn, cancelBtn)
        taskDiv.append(taskCheckbox, title, expandBtn, deleteBtn, taskCategories, description, userChecklistDiv, btnDiv);
        taskDiv.classList.add("expanded")
        taskDiv.dataset.index = index;
        content.appendChild(taskDiv);
    })  
}


// renderTaskList(masterTaskList);
renderTaskListDev(masterTaskList);


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
