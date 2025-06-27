//__________index.js__________
//__________DOM Manipulation__________

// Reassessed plan, set index.js to only do the following:
// interact with DOM via query selectors
// generate popups to gather user data
// event listeners

// home.js should include logic in the following categories:
// constructor
// task managment

// Have all elements render on page whether they are displayed or not

import "./styles.css";

// Icons
import trashBin from "../icon/delete.svg"
import edit from "../icon/edit.svg"


// logic functions
import { toDoManager } from "./home.js";
import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";


// display obj IIFE
const domManipulator = (function() {

    // cacheDOM
    const dateDisplay = document.querySelector(".date-display > div > p")
    const displayInfo = document.querySelector(".notices")
    const completeViewNote = document.querySelector(".complete-view")
    const todayTasksCompleteNotice = document.querySelector(".tasks-done")
    const projectEmptyNotice = document.querySelector(".project-empty")
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
    const today = toDoManager.getDate()
    const allProjects = projectManager.getProjects();

    // render

    dateDisplay.textContent = toDoManager.getFormattedDate()

    function renderTaskList (allTasks) {
        content.innerHTML = "";
        allTasks.forEach((task, index) => {
            // task div
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-div");
            checkExpandedStatus(taskDiv, task)
            taskDiv.dataset.index = index;
            
            // 2nd row (details section)
            const taskDetails = document.createElement("div")
            taskDetails.classList.add("details")

            // append first row
            // taskDiv.appendChild(taskCheckbox);
            taskDiv.appendChild((renderCheckbox(task)))
            taskDiv.appendChild((renderTitle(task)));
            taskDiv.appendChild((renderEditBtn()));
            taskDiv.appendChild((renderDeleteBtn()));

            // append details row in own div
            taskDetails.appendChild((renderProjectDropdown(task)));
            taskDetails.appendChild((renderDatePicker(task)));
            taskDetails.appendChild((renderPriorityDropdown(task)));
            taskDiv.appendChild(taskDetails);

            // append description and checklist
            taskDiv.appendChild((renderDescription(task)))
            taskDiv.appendChild((createChecklistDiv()));

            // append to page
            content.appendChild(taskDiv);
        })  
    }  

    function checkExpandedStatus(taskDiv, task) {
        if (task.isExpanded === true) {
            taskDiv.classList.add("expanded")
        }
    }
        
    function renderCheckbox(task) {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.checked = task.isComplete;
        checkbox.addEventListener("click", toDoManager.toggleCompleteTask)
        // no brackets after toggleCompleteTask, otherwise the function will be called immediately   
        return checkbox;
    }

    function renderTitle(task) {
        const taskTitle = document.createElement("h3");
        taskTitle.textContent = `${task.title}`
        taskTitle.addEventListener("click", toDoManager.expandTask)
        return taskTitle
    }

    function renderEditBtn() {
        const editBtn = document.createElement("button");
        const editIcon = document.createElement('img')
        editIcon.src = edit;
        editBtn.appendChild(editIcon);
        editBtn.classList.add("exp-col-btn")
        editBtn.addEventListener("click", toDoManager.expandTask)
        return editBtn
    }

    function renderDeleteBtn() {
        const deleteBtn = document.createElement("button");
        const deleteIcon = document.createElement('img')
        deleteIcon.src = trashBin;
        deleteBtn.appendChild(deleteIcon)
        deleteBtn.classList.add("delete-task-btn");
        deleteBtn.addEventListener("click", toDoManager.deleteTask)
        return deleteBtn
    }

    function renderProjectDropdown(task) {
        // outer div
        const projectDiv = document.createElement("div");

        // label
        const projectLabel = document.createElement("label");
        projectLabel.innerHTML = "Project:";
       
        // dropdown wrapper
        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.classList.add("select-wrapper")

        // dropdown
        const projectDropdown = document.createElement("select");
        projectDropdown.classList.add("task-project")
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
        // event listener
        projectDropdown.addEventListener("change", (e) => {
            toDoManager.changeProject(e)
        })

        // append to div
        dropdownWrapper.appendChild(projectDropdown)
        projectDiv.appendChild(projectLabel)
        projectDiv.appendChild(dropdownWrapper)
        return projectDiv;
    }

    // function refreshProjectDropdown(allTasks) {
    //     allTasks.forEach((task, index) => {
    //         const projectInput = document.querySelectorAll(".task-project")[index];
    //         for (const option of projectInput) {
    //             if (option.value === task.project) {
    //                 option.selected = true;
    //             } else {
    //                 // do nothing
    //             }
    //         }
    //     })
    // }

    function renderDatePicker(task) {
        // outer div
        const dateDiv = document.createElement("div")

        // label
        const dateLabel = document.createElement("label")
        dateLabel.innerHTML = "Due date:"

        // date picker
        const datePicker = document.createElement("input")
        datePicker.setAttribute("type", "date");
        datePicker.classList.add("task-duedate")
        datePicker.defaultValue = task.dueDate;

        // event listener
        datePicker.addEventListener("change", (e) => {
            toDoManager.changeDueDate(e)
        })

        // append to div
        dateDiv.appendChild(dateLabel)
        dateDiv.appendChild(datePicker)
        return dateDiv;
    }


    // function refreshDatePicker(allTasks) {
    //     allTasks.forEach((task, index) => {
    //         const dateInput = document.querySelectorAll(".task-duedate")[index];
    //         dateInput.defaultValue = task.dueDate;
    //     })
    // }

    function renderPriorityDropdown (task) {
        // outer div
        const priorityDiv = document.createElement("div");

        // label
        const priorityLabel = document.createElement("label");
        priorityLabel.innerHTML = "Priority:"
        
        // priority wrapper
        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.classList.add("select-wrapper")

        // priorty picker
        const priorities = toDoManager.getPriorities();
        const priorityDropdown = document.createElement("select");
        priorityDropdown.classList.add("task-priority")
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
        // event listener
        priorityDropdown.addEventListener("change", (e) => {
            toDoManager.changePriority(e)
        })

        // append to div
        dropdownWrapper.appendChild(priorityDropdown)
        priorityDiv.appendChild(priorityLabel)
        priorityDiv.appendChild(dropdownWrapper)
        return priorityDiv;
    }

    // function refreshPrioritytDropdown(allTasks) {
    //     allTasks.forEach((task, index) => {
    //         const priorityInput = document.querySelectorAll(".task-priority")[index];
    //         for (const option of priorityInput) {
    //             if (option.value === task.priority) {
    //                 option.selected = true;
    //             } else {
    //                 // do nothing
    //             }
    //         }
    //     })
    // }

    // function refreshDetails(allTasks) {
    //     refreshProjectDropdown(allTasks);
    //     refreshDatePicker(allTasks);
    //     refreshPrioritytDropdown(allTasks);
    // }

    function renderDescription(task) {
        // create outer div
        const descriptionDiv = document.createElement("div");

        // create label
        const descriptionLabel = document.createElement("label")
        descriptionLabel.innerHTML = "Description"

        // create textarea
        const description = document.createElement("textarea")
        description.classList.add("description")
        description.maxLength = 3000;
        description.rows = 5;
        description.textContent = task.description;

        // event listener
        description.addEventListener("blur", (e) => {
            toDoManager.changeDescription(e)
        })

        // append to div
        descriptionDiv.appendChild(descriptionLabel)
        descriptionDiv.appendChild(description)
        return descriptionDiv;
    }

    // function refreshDescription(allTasks) {
    //     allTasks.forEach((task, index) => {
    //         const descriptionInput = document.querySelectorAll(".description")[index];
    //         descriptionInput.innerHTML = ""
    //         descriptionInput.innerHTML = task.description;
    //     })
    // }

    function createChecklistDiv (task) {
        const checklistDiv = document.createElement("div");
        checklistDiv.classList.add("user-checklist-div");

        // create legend
        const legend = document.createElement("legend");
        legend.textContent = "Your checklist items";    
        
        // create checklist items section
        const checklistUl = document.createElement("ul")

        // append items to checklist div
        checklistDiv.appendChild(legend);
        checklistDiv.appendChild(checklistUl);
        checklistDiv.append((renderAddChecklistItemBtn()));
        return checklistDiv;
    } 

    function renderAddChecklistItemBtn() {
        const addBtn = document.createElement("button");
        addBtn.textContent = "Add checklist item"
        addBtn.addEventListener("click", (e) => {
            const taskIndex = e.target.closest(".task-div").dataset.index
            console.log(taskIndex)
            displayModals.createChecklistModal(taskIndex);
        })
        return addBtn
    }

    function renderChecklistItems(allTasks) {
        allTasks.forEach((task, index) => {
            const checklistUl = document.querySelectorAll(".user-checklist-div")[index].children.item(1)
            checklistUl.innerHTML = ""
            const checklist = task.userChecklist;
            for (const [key, value] of Object.entries(checklist)) {
                const userItemDiv = document.createElement("li");

                // append items
                userItemDiv.appendChild((renderChecklistCheckbox(key, index)))
                userItemDiv.appendChild((renderCheckboxLabel(key, index)));
                userItemDiv.appendChild((renderChecklistDeleteBtn()))
                checklistUl.appendChild(userItemDiv);
                applyChecklistStyles(value, userItemDiv)
            }
        })
    }

    function renderChecklistCheckbox(key, index) {
        const itemCheckbox = document.createElement("input");
        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.id = `task${index}-${key}`;

        itemCheckbox.addEventListener("change", toDoManager.completeChecklistItem)

        return itemCheckbox
    }

    function renderCheckboxLabel(key, index) {
        const label = document.createElement("label");
        label.setAttribute("for", `task${index}-${key}`)
        label.innerHTML = `${key}`;
        return label
    }

    function renderChecklistDeleteBtn() {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "-"
        deleteBtn.addEventListener("click", toDoManager.deleteUserChecklistItem);
        return deleteBtn;
    }

    function applyChecklistStyles(value, userItemDiv) {
        const itemCheckbox = userItemDiv.firstChild
        if (value === true) {
            itemCheckbox.checked = true;
            userItemDiv.classList.add("item-complete")
        } else {
            itemCheckbox.checked = false;
            if (userItemDiv.classList.contains("item-complete")) {
                userItemDiv.classList.remove("item-complete")
            } else {
                // do nothing
            }
        }
    }

    function renderFullTasks(allTasks) {
        renderTaskList(allTasks)
        renderChecklistItems(allTasks)
        pubSub.emit("tasksRendered", console.log("tasks rendered"))
    }


    // Project elements and event listeners (left sidebar)
    
    // refresh display fn()s
    function refreshProjectDisplay() {
        hideNotices()
        removeActiveClass()
        removeDisplayOffClass()
        removeSubs()
    }

    function hideNotices() {
        const notices = displayInfo.children
        for (const notice of notices) {
            if (notice.classList.contains("active")) {
                notice.classList.remove("active")
            }
        } 
    }

    function removeActiveClass() {
        console.log("removing classes")
        const allNavBtns = document.querySelectorAll(".menu button, button.menu")
        for (const button of allNavBtns) {
            if (button.classList.contains("active") === true) {
                button.classList.remove("active")
            }
        }
    }

    function removeDisplayOffClass() {
        const taskDivs = content.children
        for (const div of taskDivs) {
            if (div.classList.contains("display-off")) {
                div.classList.remove("display-off")
            }
        }
    }

    function removeSubs() {
        if (pubSub.events.tasksRendered) {
            pubSub.events.tasksRendered = []
            console.log("All pubsubs listening to tasksRendered have been turned off")
        } else {
            // do nothing
            console.log("tasksRendered does not exist atm")
        }
    }


    // event listener fn()s
    todayTasksBtn.addEventListener("click", function(e) {
        refreshProjectDisplay()
        this.classList.add("active")
        displayTodayTasks()
        displayTodayCompleteNotice()
        pubSub.on("tasksRendered", displayTodayTasks)
        pubSub.on("tasksRendered", displayTodayCompleteNotice)
        console.log(pubSub.events)
        console.log("today pubsub turned on")
    })

    function displayTodayCompleteNotice(){
        hideNotices()
       if (checkIfDisplayIsEmpty() === true) {
        todayTasksCompleteNotice.classList.add("active")
       }
    }

    function checkIfDisplayIsEmpty() {
        const allTaskDivs = content.children
        let count = 0;
        let result = false
        for (const div of allTaskDivs){
            if (div.classList.contains("display-off")) {
                count += 1
            }
        }
        if (count === toDoManager.getMasterTaskList().length) {
            console.log(`# of tasks displayed = ${count}, # of tasks total = ${toDoManager.getMasterTaskList().length}`)
            result = true
        }
        return result
    }

    thisWeekTasksBtn.addEventListener("click", function() {
        refreshProjectDisplay()
        this.classList.add("active")
        displayThisWeekTasks()
        pubSub.on("tasksRendered", displayThisWeekTasks)
        console.log("this week pubsub turned on")
    })
   
    completeBtn.addEventListener("click", function () {
        refreshProjectDisplay()
        completeViewNote.classList.add("active")
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
        refreshProjectDisplay()
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
        // console.log("User clicks todayTasks")
        // console.log(`Date: ${today}`)
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
        // console.log("User clicks this WeekTasks")
        // console.log(`Date range: ${today} to ${nextWeek}`);
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
            if (div.children.item(4).children.item(2).lastChild.firstChild.value === "high" && div.childNodes[0].checked === false) {
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
        projectManager.getProjects().forEach((project, index) => {
            if (index === 0) {
                // index 0 = All projects btn, skip this and do nothing
            } else {
                const projectListItem = document.createElement("li")
                projectListItem.dataset.index = index

                projectListItem.appendChild((renderProjectBtn(project)))
                projectListItem.appendChild((renderProjectDeleteBtn()))

                projectsList.appendChild(projectListItem)
                }
        })
    }

    function renderProjectBtn(project) {
        const projectBtn = document.createElement("button")
        projectBtn.classList.add("menu");
        projectBtn.textContent = project.name 

        // event listener
        projectBtn.addEventListener("click", function() {
            refreshProjectDisplay()
            this.classList.add("active")
            console.log(`${this.textContent} button is currently active`)
            displaySelectedProject()
            displayProjectEmptyNotice()
            pubSub.on("tasksRendered", displaySelectedProject)
            pubSub.on("tasksRendered", displayProjectEmptyNotice)
            console.log(`${project.name} pubsub turned on`)
        })
        return projectBtn;
    }

    function renderProjectDeleteBtn() {
        const deleteProjectBtn = document.createElement("button")
        const deleteIcon = document.createElement('img')
        deleteIcon.src = trashBin;
        deleteProjectBtn.appendChild(deleteIcon)
        deleteProjectBtn.classList.add("delete-project-btn");

        //event listener
        deleteProjectBtn.addEventListener("click", (e) => {
            const projectIndex = e.target.parentNode.dataset.index
            console.log(projectIndex);
            displayModals.showProjectDeleteModal(projectIndex);
        });
        return deleteProjectBtn;
    }

    function displayProjectEmptyNotice(){
        hideNotices()
       if (checkIfDisplayIsEmpty() === true) {
            projectEmptyNotice.classList.add("active")
       }
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

    // fn to switch between projects
    function displaySelectedProject() {
        const activeProject = getActiveProject()
        const allTaskDivs = content.children
        console.log(`${activeProject} is active`)
        for (const div of allTaskDivs) {
            if (div.children.item(4).children.item(0).lastChild.firstChild.value === activeProject && div.childNodes[0].checked === false) {
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


    // task pubSubs
    pubSub.on("taskListChanged", renderFullTasks)
    pubSub.on("toggleComplete", toDoManager.autoDeleteCompletedTasks)
    pubSub.on("checklistChanged", renderChecklistItems)
    
    // pubSub.on("detailsChanged", refreshDetails)
    // pubSub.on("descriptionChanged", refreshDescription)
    

    // project pubsubs
    pubSub.on("projectListChanged", renderMyProjectsList)
    pubSub.on("projectListChanged", setFirstRenderDefault)
    pubSub.on("projectDeleted", toDoManager.moveProjectsToAll)
   

    // Initial render
    // renderTaskList(allTasks);
    // renderChecklistItems(allTasks)
    // document.addEventListener("DOMContentLoaded", () => {
    //     renderFullTasks(allTasks)
    //     setFirstRenderDefault()
    //     renderMyProjectsList()
    // })

    renderFullTasks(allTasks)
    setFirstRenderDefault()
    renderMyProjectsList()

    return{ renderTaskList }
})();

const displayModals = (function() {

    // main page DOM elements
    const addTaskBtn = document.querySelector(".title > button")
    const addProjectBtn = document.querySelector("button.add-project-btn")
    const body = document.querySelector("body")
    

    // common modal elements
    const closeModalBtns = document.querySelectorAll(".close-modal, .cancel");


    // add-task modal elements
    const taskModal = document.querySelector(".add-task")
    const taskModal_Form = document.querySelector(".add-task form")
    const taskModal_Title = document.querySelector("#task-title");
    const taskModal_ProjectSelector = document.querySelector("#project")
    const taskModal_DueDateSelector = document.querySelector("#due-date")
    const taskModal_PrioritySelector = document.querySelector("#priority")
    const taskModal_Description = document.querySelector("#description")
    const taskModal_ChecklistDiv = document.querySelector(".add-checklist-items")
    const taskModal_AddChecklistItemBtn = document.querySelector(".add-item-btn")
    

    // add-project modal elements
    const projectModal = document.querySelector("dialog.add-project")
    const projectModal_Form = document.querySelector(".add-project form")
    const projectModal_Name = document.querySelector(".add-project input")


    // delete-project modal elements
    const projectDeleteModal = document.querySelector("#delete-warning")
    const projectDeleteModal_Confirm = document.querySelector(".confirm")


    // common modal event listeners
    closeModalBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
        e.preventDefault()
        closeModal(e)
        })
    })

      // common modal logic
      function closeModal(e) {
        const parentForm = e.target.closest("form")
        const parentModal = e.target.closest("dialog")
        parentForm.reset()
        parentModal.close()
    }


    // task modal event listeners
    addTaskBtn.addEventListener("click", function() { taskModal.showModal()
    removeChecklistItemInputs()
    populateProjects()
    getDefaultDate()
    populatePriorities()
    })

    taskModal_AddChecklistItemBtn.addEventListener("click", (e) => {
        // prevents the page from immediately reloading
        e.preventDefault()
        addChecklistItemInput()
    })

    taskModal_Form.addEventListener("submit", function(e) { 
        e.preventDefault()
        toDoManager.addTaskToMasterList(taskModal_Title.value, taskModal_ProjectSelector.value, taskModal_DueDateSelector.value, taskModal_PrioritySelector.value, taskModal_Description.value, getModalChecklistItems())
        closeModal(e)
    })


    // task modal logic
    function populateProjects(){
        taskModal_ProjectSelector.innerHTML = ""
        // returns an array of project names only
        const allProjects = projectManager.getProjects().map(((project) => project.name))
        for (const project of allProjects) {
            const option = document.createElement("option")
            option.value = project;
            option.textContent = project;
            taskModal_ProjectSelector.appendChild(option);
        } 
    }

    function getDefaultDate() {
        taskModal_DueDateSelector.defaultValue = toDoManager.getDate();
    }

    function populatePriorities() {
        taskModal_PrioritySelector.innerHTML = ""
        const allPriorities = toDoManager.getPriorities();
        for (const priority of allPriorities) {
            const option = document.createElement("option")
            option.value = priority;
            option.textContent = priority;
            taskModal_PrioritySelector.appendChild(option)
        }
    }

    function addChecklistItemInput() {
        const newChecklistInput = document.createElement("input")
        newChecklistInput.setAttribute("type", "text")
        taskModal_ChecklistDiv.appendChild(newChecklistInput)
        taskModal.showModal()
    }

    function removeChecklistItemInputs(){
        // if div container contains inputs
            // remove html input elements
        taskModal_ChecklistDiv.innerHTML = "";
    }

    const getModalChecklistItems = function() {
        const items = document.querySelectorAll(".checklist input")
        const itemsArr = []; 
        for (const item of items) {
            if (item.value !== '') {
                itemsArr.push(item.value)
            }
        }
        return itemsArr
    }


    // add project modal event listeners
    addProjectBtn.addEventListener("click", function() {
        projectModal.showModal()
    })

    projectModal_Form.addEventListener("submit", function(e){
        e.preventDefault()
        projectManager.addProject(projectModal_Name.value)
        closeModal(e)
    })


    // delete project modal event listeners
    projectDeleteModal_Confirm.addEventListener("click", (e)=> {
        e.preventDefault()
        const projectIndex = projectDeleteModal.className
        const radioInputs = document.querySelector("input[name='delete-project']:checked").value;
        if (radioInputs === "true") {
            projectManager.deleteProject(projectIndex)
            closeModal(e);
        } else {
            closeModal(e);
        } 
    })


    // delete project modal logic
    function showProjectDeleteModal(projectIndex) {
        projectDeleteModal.classList = "";
        projectDeleteModal.showModal()
        projectDeleteModal.classList.add(`${projectIndex}`)
    }

    // add checklist items modal
    function createChecklistModal(taskIndex){
        const checklistModal = document.createElement("dialog");
        checklistModal.id = "checklist-modal";
        checklistModal.classList.add(`${taskIndex}`)

        // create form
        const form = document.createElement("form");
        
        const saveDiv = document.createElement("div")
        saveDiv.classList.add("save-div")

        form.appendChild((createChecklistModal_TopRow()))
        form.appendChild((createChecklistModal_Input()))
        saveDiv.appendChild((createChecklistModal_SaveBtn()))
        saveDiv.appendChild((createChecklistModal_CancelBtn()))
        form.appendChild(saveDiv)

        form.addEventListener("submit", (e) => {
            e.preventDefault()
            toDoManager.addChecklistItem(e)
            removeModal(e)
        })

        checklistModal.appendChild(form)
        body.appendChild(checklistModal)

        checklistModal.showModal()
    }

    function createChecklistModal_TopRow() {
        const modal_TopRow = document.createElement("div")
        modal_TopRow.classList.add("modal-title")

        const legend = document.createElement("legend") 
        legend.textContent = "Add checklist item:"

        const closeBtn = document.createElement("button")
        closeBtn.classList.add("close-modal")
        closeBtn.textContent = "x"

        closeBtn.addEventListener("click", (e) => {
            e.preventDefault()
            removeModal(e)
        })

        modal_TopRow.appendChild(legend)
        modal_TopRow.appendChild(closeBtn)
        return modal_TopRow
    }

    function createChecklistModal_Input() {
        const inputDiv = document.createElement("div")
        inputDiv.classList.add("input")

        const label = document.createElement("label")
        label.innerHTML = "Item name:"

        const input = document.createElement("input");
        input.setAttribute("type", "text")

        inputDiv.appendChild(label)
        inputDiv.appendChild(input)

        return inputDiv
    }

    function createChecklistModal_SaveBtn() {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        return saveBtn
    }

    function createChecklistModal_CancelBtn() {
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel"

        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault()
            removeModal(e)
        })

        return cancelBtn
    }

    function removeModal(e){
        const parentModal = e.target.closest("dialog")
        parentModal.remove()
    }

    return {
        showProjectDeleteModal,
        createChecklistModal
    }
})()

const displayTheme = (function(){
    const body = document.querySelector("body")
    const allThemeBtns = document.querySelectorAll(".themes > div > button")
    
    // btn_Theme1.addEventListener("click", () => {
    //     deactivateThemes()
    //     const theme1 = toDoManager.getThemes()[0];
    //     console.log(theme1)
    //     theme1.active = true;
    //     console.log(toDoManager.getThemes())
    // })

   // when btn is clicked
    // set theme.active to false for all
    // set theme associated with btn as active
    // update render 

    allThemeBtns.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            toDoManager.setTheme(index)
            renderThemeStyles(e)
        })
    })

    function renderThemeStyles(e) {
        deactivateThemeBtns()
        e.target.classList.add("active")
        setBodyStyle()
    }

    function setBodyStyle() {
        body.className = "";
        const allThemes = toDoManager.getThemes()
        for (const theme of allThemes) {
            if (theme.active === true) {
                body.className = theme.name
            }
        }
    }

    function deactivateThemeBtns() {
        allThemeBtns.forEach((btn) => {
            if (btn.classList.contains("active")) {
                btn.classList.remove("active")
            } else {
                // do nothing
            }
        })
    }

    function setActiveBtn() {
        const allThemes = toDoManager.getThemes()
        allThemes.forEach((theme, index) => {
            console.log(index)
            if (theme.active === true) {
                console.log(allThemeBtns[index])
                allThemeBtns[index].classList.add("active")
            }
        })
    }

    function setInitialRender() {
        setActiveBtn()
        setBodyStyle()
    }

    setInitialRender()
})()



//__________Unused Code (Delete when finished)__________

