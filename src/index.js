//__________index.js__________

import "./styles.css";
import { test } from "./home.js"

// data
import { masterTaskList } from "./home.js";
import { categories } from "./home.js"

// functions
import { getCategories } from "./home.js";



console.log(test);
console.log(masterTaskList);
console.log(typeof((getCategories(categories))))
console.log(categories)



// for rendering

function renderTaskList (obj, categories) {
    // create elements
    const content = document.querySelector("#content");
    obj.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        // first row
        createTaskCheckbox(index, taskDiv);
        createTaskTitle(task, taskDiv);
        createExpandCollapseBtn(taskDiv);
        createDeleteBtn(index, taskDiv, masterTaskList);

        // second row
        const taskCategoriesDiv = document.createElement("div")
        createCategoryDropdown(task, categories, taskCategoriesDiv)
        const dueDate = document.createElement("div");
        const priority = document.createElement("div");

        // third row
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

        // populate info
        dueDate.textContent = `${task.dueDate}`;
        priority.textContent = `${task.priority}`;
        description.textContent = `${task.description}`;
        userAddedChecklistItem.textContent = "User's input goes here";
        btnAddChecklistItem.textContent = "+"
        saveBtn.textContent = "Save"
        cancelBtn.textContent = "Cancel"

        // append
        taskCategoriesDiv.append(dueDate, priority);
        userChecklist.append(userAddedCheckbox, userAddedChecklistItem)
        userChecklistDiv.append(userChecklist, btnAddChecklistItem);
        btnDiv.append(saveBtn, cancelBtn)
        taskDiv.append(taskCategoriesDiv, description, userChecklistDiv, btnDiv);
        taskDiv.dataset.index = index;
        content.appendChild(taskDiv);
    })  
}

renderTaskList(masterTaskList, categories);


// create taskDiv components

function createTaskCheckbox(index, taskDiv) {
    // add function to get completed taskList
    const taskCheckbox = document.createElement("input");
    taskCheckbox.setAttribute("type", "checkbox");
    taskCheckbox.addEventListener("click", function(e) {
        console.log(`Send index ${index} to the completed tasks list`)
    })
    taskDiv.appendChild(taskCheckbox);
}

function createTaskTitle(task, taskDiv) {
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = `${task.title}`
    taskDiv.appendChild(taskTitle);
}

function createExpandCollapseBtn(taskDiv) {
    const expandBtn = document.createElement("button");
    expandBtn.textContent = "exp";
    expandBtn.classList.add("exp-col-btn")
    expandBtn.addEventListener("click", function(e) {      console.log("Expand/Collapse btn clicked");
        console.log(taskDiv.dataset.index)
        collapseTask(taskDiv);
    });
    taskDiv.appendChild(expandBtn);    
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

function createDeleteBtn (index, taskDiv, masterTaskList) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "del"
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function (e) {
        console.log("Delete btn clicked");
        console.log(taskDiv.dataset.index);
        deleteTask(masterTaskList, index);
        console.log(masterTaskList);
        // function to re-render taskList
    })
    taskDiv.appendChild(deleteBtn);
}

function deleteTask(masterTaskList, index) {
    masterTaskList.splice(index, 1);
    return masterTaskList;
}

function createCategoryDropdown(task, categories, taskCategoriesDiv) {
    const allProjectCategories = getCategories(categories);
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
    taskCategoriesDiv.appendChild(categoryDropdown);
}





function refreshTaskData() {
    while (content.firstChild) {
        content.removeChild(content.lastChild);
    }
}








//__________Unused Code (Delete when finished)__________


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
    //         const taskCategoriesDiv = document.createElement("div")
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
    //         taskCategoriesDiv.append(category, dueDate, priority);
    //         btnDiv.append(saveBtn, cancelBtn)
    //         taskDiv.append(taskCheckbox, title, expandBtn, deleteBtn, taskCategoriesDiv, btnDiv);
    //         content.appendChild(taskDiv);
    //     }
    // }