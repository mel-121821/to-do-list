//__________index.js__________

import "./styles.css";
import { test } from "./home.js"

import { masterTaskList } from "./home.js";


console.log(test);
console.log(masterTaskList);

// for rendering

function renderHomeScreen (obj) {
    const content = document.querySelector("#content");
    for (const task of obj) {
        const taskDiv = document.createElement("div");
        const taskCheckbox = document.createElement("input");
        taskCheckbox.setAttribute("type", "checkbox");
        const title = document.createElement("h3");
        const expandBtn = document.createElement("button");
        expandBtn.textContent = "exp";
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "del";
        const projectType = document.createElement("div");
        const dueDate = document.createElement("div");
        const priority = document.createElement("div");
        const description = document.createElement("p");
        title.textContent = `${task.title}`;
        projectType.textContent = `${task.projectType}`;
        dueDate.textContent = `${task.dueDate}`;
        priority.textContent = `${task.priority}`;
        description.textContent = `${task.description}`;
        taskDiv.append(taskCheckbox, title, expandBtn, deleteBtn, projectType, dueDate, priority, description);
        content.appendChild(taskDiv);
    }
}



renderHomeScreen(masterTaskList);