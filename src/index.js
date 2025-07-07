//__________index.js__________
//__________DOM Manipulation__________

import "./styles.css";

// Icons
import trashBin from "../icon/delete.svg";
import edit from "../icon/edit.svg";


// logic functions
import { toDoManager } from "./home.js";
import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";


// display obj IIFE
const domManipulator = (function() {

    // cacheDOM
    const dateDisplay = document.querySelector(".date-display > div > p");
    const projectHeader = document.querySelector(".project-header > div > h2");
    const content = document.querySelector("#content");
    

    // notices
    const notices_Container = document.querySelector(".notices");
    const notices_CompleteView = document.querySelector(".complete-view");
    const notices_TodayTasksComplete = document.querySelector(".tasks-done");
    const notices_ProjectEmpty = document.querySelector(".project-empty");

    // nav
    const nav_TodayTasksBtn = document.querySelector(".today > button");
    const nav_ThisWeekTasksBtn = document.querySelector(".this-week > button");
    const nav_completeBtn = document.querySelector(".complete > button");
    const nav_ImportantBtn = document.querySelector(".important > button");
    const nav_OverdueBtn = document.querySelector(".overdue > button");
    const nav_AllProjectsBtn = document.querySelectorAll(".user-created-projects button")[0];
    const nav_ProjectsList = document.querySelector(".user-created-projects > ol");



    // get data
    const allTasks = toDoManager.getMasterTaskList();
    const today = toDoManager.getDate();
    const allProjects = projectManager.getProjects();

    // render date
    dateDisplay.textContent = toDoManager.getFormattedDate();

    // render tasks
    function renderTaskList (allTasks) {
        content.innerHTML = "";
        allTasks.forEach((task, index) => {
            // task div
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-div");
            checkStatus_Expanded(taskDiv, task);
            taskDiv.dataset.index = index;
            
            // 2nd row (details section)
            const taskDetails = document.createElement("div");
            taskDetails.classList.add("details");

            // append first row
            taskDiv.appendChild((renderCheckbox(task)));
            taskDiv.appendChild((renderTaskTitle(task)));
            taskDiv.appendChild((renderBtn_EditTask()));
            taskDiv.appendChild((renderBtn_DeleteTask()));

            // append details row in own div
            taskDetails.appendChild((renderProjectDropdown(task)));
            taskDetails.appendChild((renderDatePicker(task)));
            taskDetails.appendChild((renderPriorityDropdown(task)));
            taskDiv.appendChild(taskDetails);

            // append description and checklist
            taskDiv.appendChild((renderDescription(task)));
            taskDiv.appendChild((renderChecklistDiv()));

            // append to page
            content.appendChild(taskDiv);
        });  
    };  

    function checkStatus_Expanded(taskDiv, task) {
        if (task.isExpanded === true) {
            taskDiv.classList.add("expanded");
        };
    };
        
    function renderCheckbox(task) {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.checked = task.isComplete;
        checkbox.addEventListener("click", toDoManager.toggleCompleteTask); 
        return checkbox;
    };

    function renderTaskTitle(task) {
        const taskTitle = document.createElement("h3");
        taskTitle.textContent = `${task.title}`;
        taskTitle.addEventListener("click", toDoManager.expandTask);
        return taskTitle;
    };

    function renderBtn_EditTask() {
        const editBtn = document.createElement("button");
        const editIcon = document.createElement('img');
        editIcon.src = edit;
        editBtn.appendChild(editIcon);
        editBtn.classList.add("edit-btn");
        editIcon.classList.add("icon");
        editBtn.addEventListener("click", toDoManager.expandTask);
        return editBtn;
    };

    function renderBtn_DeleteTask() {
        const deleteBtn = document.createElement("button");
        const deleteIcon = document.createElement('img');
        deleteIcon.src = trashBin;
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.classList.add("delete-btn");
        deleteIcon.classList.add("icon");
        deleteBtn.addEventListener("click", toDoManager.deleteTask);
        return deleteBtn;
    };

    function renderProjectDropdown(task) {
        // outer div
        const projectDiv = document.createElement("div");

        // label
        const projectLabel = document.createElement("label");
        projectLabel.innerHTML = "PROJECT:";
       
        // dropdown wrapper
        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.classList.add("select-wrapper");

        // dropdown
        const projectDropdown = document.createElement("select");
        projectDropdown.classList.add("task-project");
        for (const project of allProjects) {
            const option = document.createElement("option");
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
            toDoManager.changeProject(e);
        })

        // append to div
        dropdownWrapper.appendChild(projectDropdown);
        projectDiv.appendChild(projectLabel);
        projectDiv.appendChild(dropdownWrapper);
        return projectDiv;
    };

    function renderDatePicker(task) {
        // outer div
        const dateDiv = document.createElement("div");

        // label
        const dateLabel = document.createElement("label");
        dateLabel.innerHTML = "DUE DATE:";

        // date picker
        const datePicker = document.createElement("input");
        datePicker.setAttribute("type", "date");
        datePicker.defaultValue = task.dueDate;

        // event listener
        datePicker.addEventListener("change", (e) => {
            toDoManager.changeDueDate(e);
        });

        // append to div
        dateDiv.appendChild(dateLabel);
        dateDiv.appendChild(datePicker);
        return dateDiv;
    };

    function renderPriorityDropdown (task) {
        // outer div
        const priorityDiv = document.createElement("div");

        // label
        const priorityLabel = document.createElement("label");
        priorityLabel.innerHTML = "PRIORITY:";
        
        // priority wrapper
        const dropdownWrapper = document.createElement("div");
        dropdownWrapper.classList.add("select-wrapper");

        // priorty picker
        const priorities = toDoManager.getPriorities();
        const priorityDropdown = document.createElement("select");
        priorityDropdown.classList.add("task-priority");
        for (const priority of priorities) {
            const option = document.createElement("option");
            option.value = priority;
            option.textContent = priority;
            if (option.textContent === task.priority) {
                option.selected = true;
            } else {
                // do nothing
            };
            priorityDropdown.appendChild(option);
        };

        // event listener
        priorityDropdown.addEventListener("change", (e) => {
            toDoManager.changePriority(e);
        });

        // append to div
        dropdownWrapper.appendChild(priorityDropdown);
        priorityDiv.appendChild(priorityLabel);
        priorityDiv.appendChild(dropdownWrapper);
        return priorityDiv;
    };

    function renderDescription(task) {
        // create outer div
        const descriptionDiv = document.createElement("div");

        // create label
        const descriptionLabel = document.createElement("label");
        descriptionLabel.innerHTML = "DESCRIPTION:";

        // create textarea
        const description = document.createElement("textarea");
        description.classList.add("description");
        description.maxLength = 3000;
        description.rows = 5;
        description.textContent = task.description;

        // event listener
        description.addEventListener("blur", (e) => {
            toDoManager.changeDescription(e);
        });

        // append to div
        descriptionDiv.appendChild(descriptionLabel);
        descriptionDiv.appendChild(description);
        return descriptionDiv;
    };

    function renderChecklistDiv (task) {
        const checklistDiv = document.createElement("div");
        checklistDiv.classList.add("user-checklist-div");

        // create legend
        const legend = document.createElement("legend");
        legend.textContent = "YOUR CHECKLIST ITEMS:";    
        
        // create checklist items section
        const checklistUl = document.createElement("ul");

        // append items to checklist div
        checklistDiv.appendChild(legend);
        checklistDiv.appendChild(checklistUl);
        checklistDiv.append((renderBtn_AddChecklistItem()));
        return checklistDiv;
    };

    function renderBtn_AddChecklistItem() {
        const addBtn = document.createElement("button");
        addBtn.textContent = "Add checklist item";
        addBtn.addEventListener("click", (e) => {
            const taskIndex = e.target.closest(".task-div").dataset.index;
            displayModals.createChecklistModal(taskIndex);
        });
        return addBtn;
    };

    function renderChecklistItems(allTasks) {
        allTasks.forEach((task, index) => {
            const checklistUl = document.querySelectorAll(".user-checklist-div")[index].children.item(1);
            checklistUl.innerHTML = "";
            const checklist = task.userChecklist;
            for (const [key, value] of Object.entries(checklist)) {
                const checklistItemDiv = document.createElement("li");

                // append items
                checklistItemDiv.appendChild((renderChecklistCheckbox(key, index)));
                checklistItemDiv.appendChild((renderChecklistItemLabel(key, index)));
                checklistItemDiv.appendChild((renderBtn_DeleteChecklistItem()));
                checklistUl.appendChild(checklistItemDiv);
                applyChecklistStyles(value, checklistItemDiv);
            };
        });
    };

    function renderChecklistCheckbox(key, index) {
        const itemCheckbox = document.createElement("input");
        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.id = `task${index}-${key}`;
        itemCheckbox.addEventListener("change", toDoManager.completeChecklistItem);
        return itemCheckbox;
    }

    function renderChecklistItemLabel(key, index) {
        const label = document.createElement("label");
        label.setAttribute("for", `task${index}-${key}`);
        label.innerHTML = `${key}`;
        return label;
    }

    function renderBtn_DeleteChecklistItem() {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "-";
        deleteBtn.addEventListener("click", toDoManager.deleteChecklistItem);
        return deleteBtn;
    }

    function applyChecklistStyles(value, checklistItemDiv) {
        const itemCheckbox = checklistItemDiv.firstChild;
        if (value === true) {
            itemCheckbox.checked = true;
            checklistItemDiv.classList.add("item-complete");
        } else {
            itemCheckbox.checked = false;
            if (checklistItemDiv.classList.contains("item-complete")) {
                checklistItemDiv.classList.remove("item-complete");
            } else {
                // do nothing
            };
        };
    };

    function renderFullTasks(allTasks) {
        renderTaskList(allTasks);
        renderChecklistItems(allTasks);
        pubSub.emit("tasksRendered", console.log("tasks rendered"))
    }


    // Project elements and event listeners (nav)
    
    // refresh display fn()s
    function clearProjectDisplays() {
        clearProjectHeader();
        hideNotices();
        deactivateNavBtns();
        removeDisplayOffClass();
        removeSubs();
    }

    function hideNotices() {
        const notices = notices_Container.children;
        for (const notice of notices) {
            if (notice.classList.contains("active")) {
                notice.classList.remove("active");
            }
        } 
    }

    function deactivateNavBtns() {
        const allNavBtns = document.querySelectorAll(".menu button, button.menu");
        for (const button of allNavBtns) {
            if (button.classList.contains("active") === true) {
                button.classList.remove("active");
            };
        };
    };

    function removeDisplayOffClass() {
        const taskDivs = content.children;
        for (const div of taskDivs) {
            if (div.classList.contains("display-off")) {
                div.classList.remove("display-off");
            };
        };
    };

    function removeSubs() {
        if (pubSub.events.tasksRendered) {
            pubSub.events.tasksRendered = [];
        } else {
            // do nothing
        };
    };


    // event listener fn()s
    nav_TodayTasksBtn.addEventListener("click", function(e) {
        clearProjectDisplays();
        this.classList.add("active");
        displayTasks_Today();
        displayNotice_TodayTasksComplete();
        displayProjectHeader(this);
        pubSub.on("tasksRendered", displayTasks_Today);
        pubSub.on("tasksRendered", displayNotice_TodayTasksComplete);
    });

    function displayNotice_TodayTasksComplete(){
       if (checkTaskDisplay_IsEmpty() === true) {
        notices_TodayTasksComplete.classList.add("active");
       };
    };

    function checkTaskDisplay_IsEmpty() {
        const allTaskDivs = content.children;
        let count = 0;
        let result = false;
        for (const div of allTaskDivs){
            if (div.classList.contains("display-off")) {
                count += 1;
            };
        };
        if (count === toDoManager.getMasterTaskList().length) {
            result = true;
        };
        return result;
    };

    nav_ThisWeekTasksBtn.addEventListener("click", function() {
        clearProjectDisplays();
        this.classList.add("active");
        displayTasks_ThisWeek();
        displayProjectHeader(this);
        pubSub.on("tasksRendered", displayTasks_ThisWeek);
    });
   
    nav_completeBtn.addEventListener("click", function () {
        clearProjectDisplays();
        notices_CompleteView.classList.add("active");
        this.classList.add("active");
        displayTasks_Complete();
        displayProjectHeader(this);
        pubSub.on("tasksRendered", displayTasks_Complete);
    });

    
    nav_ImportantBtn.addEventListener("click", function () {
        clearProjectDisplays();
        this.classList.add("active");
        displayTasks_Important();
        displayProjectHeader(this);
        pubSub.on("tasksRendered", displayTasks_Important);
    });

    
    nav_OverdueBtn.addEventListener("click", function () {
        clearProjectDisplays();
        this.classList.add("active");
        displayTasks_Overdue();
        displayProjectHeader(this);
        pubSub.on("tasksRendered", displayTasks_Overdue);
    });

    
    nav_AllProjectsBtn.addEventListener("click", function() {
        clearProjectDisplays();
        this.classList.add("active");
        displayTasks_AllProjects();
        displayProjectHeader(this);
        pubSub.on("tasksRendered", displayTasks_AllProjects);
    });


    // display logic
    function displayTasks_AllProjects() {
        const allTaskDivs = content.children;
        for (const div of allTaskDivs) {
            if (div.childNodes[0].checked === true) {
                div.classList.add("display-off"); 
            } else {
                if (div.classList.contains("display-off") === true) {
                    div.classList.remove("display-off");
                } else {
                    // do nothing
                };
            };
        };
    };
    
    function setFirstRenderDefault(){
        clearProjectDisplays();
        nav_AllProjectsBtn.classList.add("active");
        displayTasks_AllProjects();
        displayProjectHeader(nav_AllProjectsBtn);
        pubSub.on("tasksRendered", displayTasks_AllProjects);
    };

    // Event listener fn()s
    function displayTasks_Today() {
        const allTaskDivs = content.children;
        for (const div of allTaskDivs) {
            const dueDate = content.childNodes[div.dataset.index].childNodes[4].childNodes[1].childNodes[1].value;
            if (dueDate === today && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off");
            };
        };
    };

    function displayTasks_ThisWeek() {
        const allTaskDivs = content.children;
        const nextWeek = toDoManager.getDateInSevenDays();
        for (const div of allTaskDivs) {
            const dueDate = div.childNodes[4].childNodes[1].childNodes[1].value;
            if ((dueDate >= today && dueDate <= nextWeek) && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off");
            };
        };
    };

    function displayTasks_Complete() {
        const allTaskDivs = content.children;
        for (const div of allTaskDivs) {
            if (div.childNodes[0].checked === true){
                // do nothing
            } else {
                div.classList.add("display-off");
            };
        };
    };

    function displayTasks_Important() {
        const allTaskDivs = content.children;
        for (const div of allTaskDivs) {
            if (div.children.item(4).children.item(2).lastChild.firstChild.value === "high" && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off");
            };
        };
    };

    function displayTasks_Overdue() {
        const allTaskDivs = content.children;
        for (const div of allTaskDivs) {
            const dueDate = div.childNodes[4].childNodes[1].childNodes[1].value;
            if (dueDate < today && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off");
            };
        };
    };

    function renderNav_MyProjects() {
        clearProjectList();
        projectManager.getProjects().forEach((project, index) => {
            if (index === 0) {
                // index 0 = All projects btn, skip this and do nothing
            } else {
                const projectListItem = document.createElement("li");
                projectListItem.dataset.index = index;

                projectListItem.appendChild((renderBtn_ProjectX(project)));
                projectListItem.appendChild((renderBtn_DeleteProject()));

                nav_ProjectsList.appendChild(projectListItem);
            };
        });
    };

    function renderBtn_ProjectX(project) {
        const projectBtn = document.createElement("button");
        projectBtn.classList.add("menu");
        projectBtn.textContent = project.name;

        // event listener
        projectBtn.addEventListener("click", function() {
            clearProjectDisplays();
            this.classList.add("active");
            displayTasks_ProjectX();
            displayNotice_ProjectEmpty();
            displayProjectHeader(this);
            pubSub.on("tasksRendered", displayTasks_ProjectX);
            pubSub.on("tasksRendered", displayNotice_ProjectEmpty);
        });
        return projectBtn;
    };

    function renderBtn_DeleteProject() {
        const deleteProjectBtn = document.createElement("button");
        const deleteIcon = document.createElement('img');
        deleteIcon.src = trashBin;
        deleteProjectBtn.appendChild(deleteIcon);
        deleteProjectBtn.classList.add("delete-project-btn");
        deleteIcon.classList.add("icon");

        //event listener
        deleteProjectBtn.addEventListener("click", (e) => {
            const projectIndex = e.target.closest("li").dataset.index;
            displayModals.showModal_DeleteProject(projectIndex);
        });
        return deleteProjectBtn;
    };

    function displayNotice_ProjectEmpty(){
       if (checkTaskDisplay_IsEmpty() === true) {
            notices_ProjectEmpty.classList.add("active");
       };
    };

    function clearProjectList() {
        const allProjectItems = document.querySelectorAll(".user-created-projects .menu"); 
        allProjectItems.forEach((project, index) => {
            if (index === 0) {
                // do nothing
            } else {
                project.parentNode.remove();
            };
        });
    };

    // fn to switch between projects
    function displayTasks_ProjectX() {
        const activeProject = getActiveProject();
        const allTaskDivs = content.children;
        for (const div of allTaskDivs) {
            if (div.children.item(4).children.item(0).lastChild.firstChild.value === activeProject && div.childNodes[0].checked === false) {
                // do nothing
            } else {
                div.classList.add("display-off");
            };  
        }; 
    };

    function getActiveProject() {
        const allProjectItems = document.querySelectorAll(".user-created-projects .menu"); 
        for (const item of allProjectItems) { 
            if (item.classList.contains("active")) { 
                return item.textContent;
            };
        };
    };

    function displayProjectHeader(target) {
        projectHeader.innerHTML = target.innerHTML;
    }

    function clearProjectHeader() {
        projectHeader.innerHTML = "";
    }

    // task pubSubs
    pubSub.on("taskListChanged", renderFullTasks);
    pubSub.on("toggleComplete", toDoManager.autoDeleteCompletedTasks);
    pubSub.on("checklistChanged", renderChecklistItems);

    // project pubsubs
    pubSub.on("projectListChanged", renderNav_MyProjects);
    pubSub.on("projectListChanged", setFirstRenderDefault);
    pubSub.on("projectDeleted", toDoManager.moveProjectsToAll);
   

    // Initial render

    renderFullTasks(allTasks);
    setFirstRenderDefault();
    renderNav_MyProjects();

    return{ renderTaskList };
})();

const displayModals = (function() {

    // main page DOM elements
    const addTaskBtn = document.querySelector(".project-header > div > button");
    const nav_AddProjectBtn = document.querySelector("button.add-project-btn");
    const body = document.querySelector("body");

    // common modal elements
    const closeModalBtns = document.querySelectorAll(".close-modal, .cancel");

    // add-task modal elements
    const taskModal = document.querySelector(".add-task");
    const taskModal_Form = document.querySelector(".add-task form");
    const taskModal_Title = document.querySelector("#task-title");
    const taskModal_ProjectSelector = document.querySelector("#project");
    const taskModal_DueDateSelector = document.querySelector("#due-date");
    const taskModal_PrioritySelector = document.querySelector("#priority");
    const taskModal_Description = document.querySelector("#description");
    const taskModal_ChecklistDiv = document.querySelector(".checklist-inputs");
    const taskModal_AddChecklistItemBtn = document.querySelector(".add-item-btn");
    

    // add-project modal elements
    const projectModal = document.querySelector("dialog.add-project");
    const projectModal_Form = document.querySelector(".add-project form");
    const projectModal_Name = document.querySelector(".add-project input");


    // delete-project modal elements
    const projectDeleteModal = document.querySelector("#delete-warning");
    const projectDeleteModal_Confirm = document.querySelector(".confirm");


    // common modal event listeners
    closeModalBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(e);
        })
    })


    // common modal logic
    function closeModal(e) {
        const parentForm = e.target.closest("form");
        const parentModal = e.target.closest("dialog");
        parentForm.reset();
        parentModal.close();
    };


    // task modal event listeners
    addTaskBtn.addEventListener("click", function() { taskModal.showModal();
    removeChecklistItemInputs();
    populateProjects();
    getDefaultDate();
    populatePriorities();
    });

    taskModal_AddChecklistItemBtn.addEventListener("click", (e) => {
        // prevents the page from immediately reloading
        e.preventDefault()
        addChecklistItemInput()
    });

    taskModal_Form.addEventListener("submit", function(e) { 
        e.preventDefault();
        toDoManager.addTaskToMasterList(taskModal_Title.value, taskModal_ProjectSelector.value, taskModal_DueDateSelector.value, taskModal_PrioritySelector.value, taskModal_Description.value, getModalChecklistItems());
        closeModal(e);
    });


    // task modal logic
    function populateProjects(){
        taskModal_ProjectSelector.innerHTML = "";
        const allProjects = projectManager.getProjects().map(((project) => project.name));
        for (const project of allProjects) {
            const option = document.createElement("option");
            option.value = project;
            option.textContent = project;
            taskModal_ProjectSelector.appendChild(option);
        }; 
    };

    function getDefaultDate() {
        taskModal_DueDateSelector.defaultValue = toDoManager.getDate();
    }

    function populatePriorities() {
        taskModal_PrioritySelector.innerHTML = "";
        const allPriorities = toDoManager.getPriorities();
        for (const priority of allPriorities) {
            const option = document.createElement("option");
            option.value = priority;
            option.textContent = priority;
            taskModal_PrioritySelector.appendChild(option);
        };
    };

    function addChecklistItemInput() {
        const newChecklistInput = document.createElement("input");
        newChecklistInput.setAttribute("type", "text");
        taskModal_ChecklistDiv.appendChild(newChecklistInput);
        taskModal.showModal();
    };

    function removeChecklistItemInputs(){
        taskModal_ChecklistDiv.innerHTML = "";
    };

    const getModalChecklistItems = function() {
        const items = document.querySelectorAll(".checklist input");
        const itemsArr = []; 
        for (const item of items) {
            if (item.value !== '') {
                itemsArr.push(item.value);
            };
        };
        return itemsArr;
    };


    // add project modal event listeners
    nav_AddProjectBtn.addEventListener("click", function() {
        projectModal.showModal();
    });

    projectModal_Form.addEventListener("submit", function(e){
        e.preventDefault();
        projectManager.addProject(projectModal_Name.value);
        closeModal(e);
    });


    // delete project modal event listeners
    projectDeleteModal_Confirm.addEventListener("click", (e)=> {
        e.preventDefault();
        const projectIndex = projectDeleteModal.className;
        const radioInput = document.querySelector("input[name='delete-project']:checked").value;
        if (radioInput === "true") {
            projectManager.deleteProject(projectIndex);
            closeModal(e);
        } else {
            closeModal(e);
        }; 
    });


    // delete project modal logic
    function showModal_DeleteProject(projectIndex) {
        projectDeleteModal.classList = "";
        projectDeleteModal.showModal();
        projectDeleteModal.classList.add(`${projectIndex}`);
    }

    // add checklist items modal
    function createChecklistModal(taskIndex){
        const checklistModal = document.createElement("dialog");
        checklistModal.id = "checklist-modal";
        checklistModal.classList.add(`${taskIndex}`);

        // create form
        const form = document.createElement("form");
        
        const saveDiv = document.createElement("div");
        saveDiv.classList.add("save-div");

        form.appendChild((createChecklistModal_TopRow()));
        form.appendChild((createChecklistModal_Input()));
        saveDiv.appendChild((createChecklistModal_SaveBtn()));
        saveDiv.appendChild((createChecklistModal_CancelBtn()));
        form.appendChild(saveDiv);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            toDoManager.addChecklistItem(e);
            removeModal(e);
        });

        checklistModal.appendChild(form);
        body.appendChild(checklistModal);

        checklistModal.showModal();
    };

    function createChecklistModal_TopRow() {
        const modal_TopRow = document.createElement("div");
        modal_TopRow.classList.add("modal-title");

        const legend = document.createElement("legend"); 
        legend.textContent = "Add checklist item:";

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("close-modal");
        closeBtn.textContent = "x";

        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            removeModal(e);
        });

        modal_TopRow.appendChild(legend);
        modal_TopRow.appendChild(closeBtn);
        return modal_TopRow;
    };

    function createChecklistModal_Input() {
        const inputDiv = document.createElement("div");
        inputDiv.classList.add("input");

        const label = document.createElement("label");
        label.innerHTML = "Item name:";

        const input = document.createElement("input");
        input.setAttribute("type", "text");

        inputDiv.appendChild(label);
        inputDiv.appendChild(input);

        return inputDiv;
    }

    function createChecklistModal_SaveBtn() {
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        return saveBtn;
    }

    function createChecklistModal_CancelBtn() {
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";

        cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            removeModal(e);
        });
        return cancelBtn;
    }

    function removeModal(e){
        const parentModal = e.target.closest("dialog")
        parentModal.remove()
    }

    return {
        showModal_DeleteProject,
        createChecklistModal
    };
})();

const displayTheme = (function(){
    const body = document.querySelector("body");
    const nav_ThemeBtns = document.querySelectorAll(".themes > div > button");

    nav_ThemeBtns.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            toDoManager.setTheme(index);
            renderThemeStyles(e);
        });
    });

    function renderThemeStyles(e) {
        deactivateThemeBtns();
        e.target.classList.add("active");
        setBodyStyle();
    };

    function setBodyStyle() {
        body.className = "";
        const allThemes = toDoManager.getThemes()
        for (const theme of allThemes) {
            if (theme.active === true) {
                body.className = theme.name;
            };
        };
    };

    function deactivateThemeBtns() {
        nav_ThemeBtns.forEach((btn) => {
            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
            } else {
                // do nothing
            };
        });
    };

    function setThemeBtn_Active() {
        const allThemes = toDoManager.getThemes();
        allThemes.forEach((theme, index) => {
            if (theme.active === true) {
                nav_ThemeBtns[index].classList.add("active");
            };
        });
    };

    function setInitialRender() {
        setThemeBtn_Active();
        setBodyStyle();
    };

    setInitialRender();
})();