//__________home.js__________
//__________To-do Logic__________

import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";
import { storage } from "./storage.js";
import { format } from "date-fns";


const toDoManager = (function() {

    // constructor
    function Task(title, project, dueDate, priority, description, userChecklist = [], isComplete = false) {
        this.title = title;
        this.project = project;
        this.dueDate = dueDate;
        this.priority = priority;
        this.description = description;
        this.userChecklist = Object.fromEntries(userChecklist.map((x => [x, false])));
        this.isComplete = isComplete;
    };


    // data lists
    let masterTaskList = [
        {
            title: "My task",
            project: "All",
            dueDate: new Date().toISOString().substring(0, 10),
            priority: "low",
            description: "My description",
            userChecklist: {
                "Feed the cat": false,
                "Water plants": false,
                "Wish Dad a Happy Birthday": false,
                "Pump up bike tires": false,
                "Make grocery list": false, 
            },
            isComplete: false,
            isExpanded: false,
        },
    ];

    const priorities = ["low", "normal", "high"];

    let themes = [
        {
            name:"work-station",
            active: true
        }, 
        {
            name: "blue-wave",
            active: false
        }, 
        {
            name: "northern-lights",
            active: false
    }];


    // Get items from storage
    function getTasksFromStorage() {
        if (storage.checkTasksExist() === true) {
            masterTaskList = storage.getStoredTasks();
        } else {
           // do nothing
        };
    };

    function getThemesFromStorage() {
        if (storage.checkThemesExist() === true) {
            themes = storage.getStoredThemes();
        } else {
            // do nothing
        };
    };

    getTasksFromStorage();
    getThemesFromStorage();


    // Date management
    function getDate() {
        const formattedDate = new Date().toISOString().substring(0, 10);
        return formattedDate;
    }

    function getDateInSevenDays() {
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() + 7)).toISOString().substring(0, 10);
        return nextWeek;
    }

    function getDateThirtyDaysAgo() {
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() - 30)).toISOString().substring(0, 10);
        return nextWeek;
    }

    function getFormattedDate() {
        const date = format(new Date(new Date), "MMMM do',' yyyy");
        return date;
    }


    // Task managment
    function addTaskToMasterList (title, project, dueDate, priority, description, userChecklist = [], isComplete=false, isExpanded=false) {
        masterTaskList.push(new Task(title, project, dueDate, priority, description, userChecklist, isComplete, isExpanded));
        sortListByDueDate();
        pubSub.emit("taskListChanged", masterTaskList);
    };

    function sortListByDueDate() {
        masterTaskList.sort((a, b) => {
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    };
    
    function toggleCompleteTask() {
        const index = this.closest(".task-div").dataset.index;
        let completionStatus = masterTaskList[index].isComplete;
        masterTaskList[index].isComplete = completionStatus === true ? false : true;
        pubSub.emit("taskListChanged", masterTaskList);
        pubSub.emit("toggleComplete", masterTaskList);
    }


    function expandTask(e) {
        const taskDivIndex = e.target.closest(".task-div").dataset.index;
        if (masterTaskList[taskDivIndex].isExpanded === true) {
            collapseAllTasks();
        } else {
            collapseAllTasks();
            masterTaskList[taskDivIndex].isExpanded = true;
        }
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function collapseAllTasks() {
        for (const task of masterTaskList) {
            task.isExpanded = false;
        }
    }

    function autoDeleteCompletedTasks() {
        const thirtyDaysAgo = getDateThirtyDaysAgo();
        for (const task of masterTaskList) {
            if (task.isComplete === true && task.dueDate <= thirtyDaysAgo) {
                masterTaskList.splice(masterTaskList.indexOf(task), 1);
                pubSub.emit("taskListChanged", masterTaskList);
            }
        }
        
    }

    function deleteTask() {
        const index = this.closest(".task-div").dataset.index;
        const removed = masterTaskList.splice(index, 1);
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function changeProject(e) {
        const newProject = e.target.value;
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].project = newProject;
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function changeDueDate(e) {
        const newDueDate = e.target.value;
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].dueDate = newDueDate
        sortListByDueDate();
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function changePriority(e) {
        const newPriority = e.target.value;
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].priority = newPriority;
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function changeDescription(e) {
        const newDescription = e.target.value;
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].description = newDescription;
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function completeChecklistItem() {
        const taskIndex = this.closest(".task-div").dataset.index;
        const checklistItem = this.parentNode.children.item(1);
        masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`] = masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`] === false ? true : false;
        pubSub.emit("checklistChanged", masterTaskList);
    }

    function deleteChecklistItem() {
        const indexOfTaskDiv = this.closest(".task-div").dataset.index;
        const checklistItem = this.parentNode.children.item(1).innerHTML;
        delete masterTaskList[indexOfTaskDiv].userChecklist[`${checklistItem}`];
        pubSub.emit("checklistChanged", masterTaskList);
    }

    function addChecklistItem(e) {
        const index = e.target.parentNode.className;
        const selectedTask = masterTaskList[index];
        const userInput = e.target.children.item(1).children.item(1).value;
        Object.assign(selectedTask.userChecklist, {[userInput]: false});
        pubSub.emit("checklistChanged", masterTaskList);
    }

    function moveProjectsToAll() {
        const projectNamesArr = projectManager.getProjects().map(((project) => project.name));
        for (const task of masterTaskList) {
            if (projectNamesArr.includes(task.project)) {
                // do nothing
            } else {
                task.project = "All";
            }
        }
        pubSub.emit("taskListChanged", masterTaskList);
    }


    // Theme fn()s
    function setTheme(index) {
        removeCurrentTheme();
        themes[index].active = true;
        pubSub.emit("themeChanged", themes);
    }

    function removeCurrentTheme() {
        for (const theme of themes) {
            theme.active = false; 
        }
    }
    
    pubSub.on("projectListChanged", () => pubSub.emit("taskListChanged", masterTaskList));

    pubSub.on("taskListChanged", storage.storeTasks);
    pubSub.on("checklistChanged", storage.storeTasks);
    pubSub.on("themeChanged", storage.storeThemes);
    

    // fn()s to get data
    const getMasterTaskList = () => masterTaskList;
    const getPriorities = () => priorities;
    const getThemes = () => themes;

    return {
        addTaskToMasterList,
        toggleCompleteTask,
        expandTask,
        deleteTask,
        changeProject,
        changeDueDate,
        changePriority,
        changeDescription,

        getDate,
        getDateInSevenDays,
        getFormattedDate,
        completeChecklistItem,
        autoDeleteCompletedTasks,
        deleteChecklistItem,
        addChecklistItem,
        moveProjectsToAll,
        setTheme,

        getMasterTaskList,
        getPriorities,
        getThemes
    };
})();

// exports
export{toDoManager};

