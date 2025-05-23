//__________index.js__________
//__________DOM Manipulation__________

// Reassessed plan, set index.js to only do the following:
// interact with DOM via query selectors
// generate popups to gather user data
// local storage??
// event listeners

// home.js should include logic in the following categories:
// constructor
// task managment

// Have all elements render on page whether they are displayed or not

import "./styles.css";

// packages
import { format } from "date-fns"

// logic functions
import { toDoManager } from "./home.js";
import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";


// display obj IIFE
const domManipulator = (function() {

    // cacheDOM
    const content = document.querySelector("#content")
    const todayTasksBtn = document.querySelector(".today > button");
    const thisWeekTasksBtn = document.querySelector(".this-week > button")
    const completeBtn = document.querySelector(".complete > button")
    const importantBtn = document.querySelector(".important > button")
    const overdueBtn = document.querySelector(".overdue > button")
    const allProjectsBtn = document.querySelectorAll(".user-created-projects button")[0]
    const projectsList = document.querySelector(".user-created-projects > ol")


    // get data
    const allTasks = toDoManager.getMasterTaskList();
    const today = toDoManager.getFormattedDate()
    const allProjects = projectManager.getProjects();
    

    // render

    function renderTaskList (allTasks) {
        content.innerHTML = "";
        allTasks.forEach((task, index) => {

            // create div for each task
            const taskDiv = document.createElement("div");

            taskDiv.dataset.index = index;

            // 1st row
            const taskCheckbox = document.createElement("input");
            taskCheckbox.setAttribute("type", "checkbox");
            taskCheckbox.checked = task.isComplete;
            taskCheckbox.addEventListener("click", toDoManager.toggleCompleteTask)
            // no brackets after isCompleteTask, otherwise the function will be called immediately   

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
        const projectDropdown = document.createElement("select");
        // projectDropdown.id = "project-dropdown";
        for (const project of allProjects) {
            const option = document.createElement("option")
            option.value = project.name;
            option.textContent = project.name;
            if (option.value === task.project) {
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
        const checklistItemsDiv = document.createElement("ul")

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

    function renderChecklistItems(allTasks) {
        // remove existing elements before adding updated list to page
        console.log(allTasks)
        allTasks.forEach((task, index) => {
            // console.log(`When renderChecklistItems is called , the index of ${task.title} is ${index}`)
            // console.log(index)
            // console.log(task.isComplete)
            const checklistItemsDiv = content.children.item(index).children.item(6).children.item(1)
            checklistItemsDiv.innerHTML = ""
            const checklist = task.userChecklist;
            checklist.forEach((item, index) => {
                const userItemDiv = document.createElement("li");
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
        pubSub.emit("tasksRendered", console.log("tasks rendered"))
    }


    // Project elements and event listeners (left sidebar)
    
    // refresh display fn()s
    function refreshProjectDisplay() {
        removeAllActiveClasses()
        removeAllDisplayOffClasses()
        setSubsToOff()
    }

    function removeAllActiveClasses() {
        console.log("removing classes")
        // console.log(e.target)
        const allNavBtns = document.querySelectorAll(".menu button, button.menu")
        for (const button of allNavBtns) {
            if (button.classList.contains("active") === true) {
                button.classList.remove("active")
            }
        }
    }

    function removeAllDisplayOffClasses() {
        const taskDivs = content.children
        for (const div of taskDivs) {
            if (div.classList.contains("display-off")) {
                div.classList.remove("display-off")
            }
        }
    }

    function setSubsToOff() {
        // console.log((pubSub.events.task))
        if (pubSub.events.tasksRendered) {
            pubSub.events.tasksRendered = []
            console.log("All pubsubs listening to tasksRendered have been turned off")
        } else {
            // do nothing
            console.log("tasksRendered does not exist atm")
            console.log(pubSub.events)
        }
        // pubSub.off("tasksRendered", displayTodayTasks)
    }


    // event listener fn()s
    todayTasksBtn.addEventListener("click", function() {
        refreshProjectDisplay()
        this.classList.add("active")
        displayTodayTasks()
        pubSub.on("tasksRendered", displayTodayTasks)
        console.log(pubSub.events)
        console.log("today pubsub turned on")
    })

    thisWeekTasksBtn.addEventListener("click", function() {
        refreshProjectDisplay()
        this.classList.add("active")
        displayThisWeekTasks()
        pubSub.on("tasksRendered", displayThisWeekTasks)
        console.log("this week pubsub turned on")
    })
   
    completeBtn.addEventListener("click", function () {
        refreshProjectDisplay()
        this.classList.add("active")
        displayCompletedTasks()
        pubSub.on("tasksRendered", displayCompletedTasks)
        console.log("complete pubsub turned on")
    })
    
    importantBtn.addEventListener("click", function () {
        refreshProjectDisplay()
        this.classList.add("active")
        displayImportantTasks()
        pubSub.on("tasksRendered", displayImportantTasks)
        console.log("high priority pubsub turned on")
    })

    
    overdueBtn.addEventListener("click", function () {
        refreshProjectDisplay()
        this.classList.add("active")
        displayOverdueTasks()
        pubSub.on("tasksRendered", displayOverdueTasks)
        console.log("overdue pubsub turned on")
    })

    
    allProjectsBtn.addEventListener("click", function() {
        refreshProjectDisplay()
        this.classList.add("active")
        displayAllProjects()
        pubSub.on("tasksRendered", displayAllProjects)
        console.log("all projects pubsub turned on")
    })


    // display logic
    function displayAllProjects() {
        const allTaskDivs = content.children
        for (const div of allTaskDivs) {
            if (div.childNodes[0].checked === true) {
                div.classList.add("display-off") 
            } else {
                if (div.classList.contains("display-off") === true) {
                    div.classList.remove("display-off")
                } else {
                    // do nothing
                }
            }   
        }
    }
    
    function setFirstRenderDefault(){
        allProjectsBtn.classList.add("active")
        displayAllProjects()
        pubSub.on("tasksRendered", displayAllProjects)
        console.log("all projects pubsub turned on")
    }

    // Event listener fn()s
    function displayTodayTasks() {
        const allTaskDivs = content.children
        for (const div of allTaskDivs) {
            const dueDate = content.childNodes[div.dataset.index].childNodes[4].childNodes[1].childNodes[1].value
            if (dueDate === today && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off")
            }
        }
        console.log("User clicks todayTasks")
        console.log(`Date: ${today}`)
    }

    function displayThisWeekTasks() {
        const allTaskDivs = content.children
        const nextWeek = toDoManager.getDateInSevenDays()
        for (const div of allTaskDivs) {
            const dueDate = div.childNodes[4].childNodes[1].childNodes[1].value
            if ((dueDate >= today && dueDate <= nextWeek) && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off")
            }
        }
        console.log("User clicks this WeekTasks")
        console.log(`Date range: ${today} to ${nextWeek}`);
    }

    function displayCompletedTasks() {
        const allTaskDivs = content.children
        for (const div of allTaskDivs) {
            if (div.childNodes[0].checked === true){
                // do nothing
            } else {
                div.classList.add("display-off")
            }
        }
        console.log("User clicks completedTasks")
    }

    function displayImportantTasks() {
        const allTaskDivs = content.children
        for (const div of allTaskDivs) {
            if (div.children.item(4).children.item(2).lastChild.value === "high" && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off")
            }
        }
        console.log("User clicks importantTasks")
    }

    function displayOverdueTasks() {
        const allTaskDivs = content.children
        for (const div of allTaskDivs) {
            const dueDate = div.childNodes[4].childNodes[1].childNodes[1].value
            if (dueDate < today && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off")
            }
        }
        console.log("User clicks overdueTasks")
    }

    function renderMyProjectsList() {
        refreshProjectsList();
        allProjects.forEach((project, index) => {
            if (index === 0) {
                // index 0 = All projects btn, skip this
                // do nothing
            } else {
                const projectListItem = document.createElement("li")
                projectListItem.dataset.index = index

                const projectBtn = document.createElement("button")
                projectBtn.classList.add("menu");
                projectBtn.textContent = project.name 
                projectBtn.addEventListener("click", function() {
                    refreshProjectDisplay()
                    this.classList.add("active")
                    console.log(`${this.textContent} button is currently active`)
                    displaySelectedProject()
                    pubSub.on("tasksRendered", displaySelectedProject)
                    console.log(`${project.name} pubsub turned on`)
                })

                const deleteProjectBtn = document.createElement("button")
                deleteProjectBtn.textContent = "-"
                deleteProjectBtn.addEventListener("click", projectManager.deleteProject)

                projectListItem.appendChild(projectBtn)
                projectListItem.appendChild(deleteProjectBtn)

                projectsList.appendChild(projectListItem)
                }
        })
    }

    function refreshProjectsList() {
        const allProjectItems = document.querySelectorAll(".user-created-projects .menu") 
        allProjectItems.forEach((project, index) => {
            if (index === 0) {
                // do nothing
            } else {
                project.parentNode.remove()
            }
        })
    }

    // fn to switch between pkrojects
    function displaySelectedProject() {
        const activeProject = getActiveProject()
        const allTaskDivs = content.children
        console.log(`${activeProject} is active`)
        for (const div of allTaskDivs) {
            if (div.children.item(4).children.item(0).lastChild.value === activeProject && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off")
            }  
        } 
    }

    function getActiveProject() {
        const allProjectItems = document.querySelectorAll(".user-created-projects .menu") 
        for (const item of allProjectItems) {
            if (item.classList.contains("active")) { return item.textContent
            }
        }
    }


    // pubSubs
    pubSub.on("taskListChanged", renderFullTasks)
    pubSub.on("toggleComplete", renderFullTasks)
    pubSub.on("toggleComplete", toDoManager.autoDeleteCompletedTasks)
    pubSub.on("checklistItemChanged", renderChecklistItems)
    pubSub.on("projectDeleted", renderMyProjectsList)
    pubSub.on("projectDeleted", setFirstRenderDefault)
    pubSub.on("projectDeleted", toDoManager.moveProjectsToAll)
    pubSub.on("projectListChanged", renderMyProjectsList)
    pubSub.on("projectListChanged", setFirstRenderDefault)

    // Initial render
    // renderTaskList(allTasks);
    // renderChecklistItems(allTasks)
    renderFullTasks(allTasks)
    setFirstRenderDefault()
    renderMyProjectsList()

    return{ renderTaskList }
})();

const createModals = (function() {
    // Create modals for:
    // Add task btn
    // Add checklist item
    // Delete project

    // main page DOM
    const addTaskBtn = document.querySelector(".title > button")
    const addProjectBtn = document.querySelector("button.add-project")

    // add task modal elements
    const addTaskModal = document.querySelector(".add-task")
    const closeModalBtns = document.querySelectorAll(".close-modal, .cancel")
    const taskTitle = document.querySelector("#task-title");
    const projectModalDropdown = document.querySelector("#project")
    const dueDateModal = document.querySelector("#due-date")
    const priorityModalDropdown = document.querySelector("#priority")
    const descriptionModal = document.querySelector("#description")
    const checklistItemsDiv = document.querySelector(".add-checklist-items")
    const addChecklistItemBtn = document.querySelector(".add-item-btn")
    const addTaskSaveBtn = document.querySelector(".add-task .save")

    // add project modal elements
    const addProjectModal = document.querySelector("dialog.add-project")
    const projectName = document.querySelector(".add-project input")
    const projectSaveBtn = document.querySelector(".add-project .save")
    

    addTaskBtn.addEventListener("click", function() { addTaskModal.showModal()
    populateProjects()
    getDefaultDate()
    populatePriorities()
    })


    closeModalBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
        e.preventDefault()
        closeModal(e)
        })
    })
    
    addProjectBtn.addEventListener("click", function() {
        console.log(this)
        addProjectModal.showModal()
    })

    projectSaveBtn.addEventListener("click", function(e){
        e.preventDefault
        projectManager.addProject(projectName.value)
        closeModal(e)
        console.log(projectManager.getProjects())
    })

    addChecklistItemBtn.addEventListener("click", (e) => {
        // prevents the page from immediately reloading
        e.preventDefault()
        addChecklistItemInput()
    })

    addTaskSaveBtn.addEventListener("click", function(e) { 
        e.preventDefault()
        // console.log(`${taskTitle.value} ${projectModalDropdown.value} ${dueDateModal.value} ${priorityModalDropdown.value} ${descriptionModal.value} ${getModalChecklistItems()}`)
        // console.log(getModalChecklistItems())
        toDoManager.addTaskToMasterList(taskTitle.value, projectModalDropdown.value, dueDateModal.value, priorityModalDropdown.value, descriptionModal.value, getModalChecklistItems())
        closeModal(e)
        console.log(toDoManager.getMasterTaskList())
    })

    const getModalChecklistItems = function() {
        const items = document.querySelectorAll(".checklist input")
        const itemsArr = []; 
        for (const item of items) {
            console.log(item.value)
            itemsArr.push(item.value)
        }
        return itemsArr
    }

    function populateProjects(){
        // returns an array of project names only
        const allProjects = projectManager.getProjects().map(((project) => project.name))
        for (const project of allProjects) {
            const option = document.createElement("option")
            option.value = project;
            option.textContent = project;
            projectModalDropdown.appendChild(option);
        } 
    }

    function getDefaultDate() {
        dueDateModal.defaultValue = toDoManager.getFormattedDate();
    }

    function populatePriorities() {
        const allPriorities = toDoManager.getPriorities();
        for (const priority of allPriorities) {
            const option = document.createElement("option")
            option.value = priority;
            option.textContent = priority;
            priorityModalDropdown.appendChild(option)
        }
    }

    function addChecklistItemInput() {
        const newChecklistInput = document.createElement("input")
        newChecklistInput.setAttribute("type", "text")
        checklistItemsDiv.appendChild(newChecklistInput)
        addTaskModal.showModal()
    }

    function closeModal(e) {
        const parentForm = e.target.closest("form")
        const parentModal = e.target.closest("dialog")
        parentForm.reset()
        parentModal.close()
    }


})()



//__________Unused Code (Delete when finished)__________


function getActiveProject() {
    const allNavBtns = document.querySelectorAll(".menu button, button.menu");
    for (const button of allNavBtns) {
        if (button.classList.contains("active")) {
            return button
        }
        return button
    }
}

function manageDisplay() {
    // if todayTasksList is selected, add pubSub
    const todayBtn = document.querySelector(".today > button");
    console.log(todayBtn)
    console.log(todayBtn.classList[0])
    if (todayBtn.classList[0] === "active") {
        displayTodayTasks()
        console.log("Today pubSub is on")
    }
    
}

 // decided to not use this as the active project is not preserved when projects re-render. Instead, will create a popup to warn the user that all projects wil be moved to "All" and they will be taken to the "All projects view"
 function checkAndDeleteProject() {
    const index = this.parentNode.dataset.index
    if (this.previousSibling.classList.contains("active")) {
        deleteProject(index)
        setFirstRenderDefault()
    } else {
        deleteProject(index)
    }
    console.log(index)
    // const allNavBtns = document.querySelectorAll(".menu button, button.menu");
    // console.log(allNavBtns);
    // console.log(this.previousSibling.classList)
}


// function removeAllActiveClasses() {
//     console.log("removing classes")
//     // console.log(e.target)
//     const allNavBtns = document.querySelectorAll(".menu button, button.menu")
//     console.log(allNavBtns)
//     // e.preventDefault()
//     for (const button of allNavBtns) {
//         console.log(button)
//         if (button.classList.contains("active") === true) {
//             button.classList.remove("active")
//             console.log(button)
//         }
//     }
    
//     // for (let i = 0; i < length; i += 1) {
//     //     const button = allNavBtns[i]
//     //     if (button.classList.contains("active") === true) {
//     //         button.classList.remove("active")
//     //     }
//     // }
//     // e.target.classList.add("active");
//     // console.log(e.target)
//     // console.log(e.target.classList)
// }

function assignActiveProjectDisplayed() {
    // when using a query selectpr, you can ask it to select multiple categories of items, separated by commas
    // the below example selects buttons under .menu parent class, and buttons with the menu class
    const allNavBtns = document.querySelectorAll(".menu button, button.menu")
    console.log(allNavBtns)
    const length = allNavBtns.length;
    console.log(length)
    for (const button of allNavBtns) {
        button.addEventListener("click", removeAllActiveClasses)
    }
}