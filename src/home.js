//__________home.js__________
//__________To-do Logic__________

import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";
import { storage } from "./storage.js";
import { format } from "date-fns"

const toDoManager = (function() {

    // constructor
    function Task(title, project, dueDate, priority, description, userChecklist = [], isComplete = false) {
        // the userChecklist = [] allows an empty array to be used as the default value
                
        // direct user input
        this.title = title;
        
        // selected from dropdown
        this.project = project;
        this.dueDate = dueDate;
        this.priority = priority;

        // direct user input
        this.description = description;
        this.userChecklist = Object.fromEntries(userChecklist.map((x => [x, false])));

        this.isComplete = isComplete
    }

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
        },
    ]

    const priorities = ["low", "normal", "high"]


    function getTasksFromStorage() {
        if (storage.checkTasksExist() === true) {
            masterTaskList = storage.getStoredTasks()
        } else {
           // do nothing
        }
        console.log(masterTaskList)
    }

    getTasksFromStorage()


    // fn()s to add tasks
    function addTaskToMasterList (title, project, dueDate, priority, description, userChecklist = [], isComplete=false) {
        masterTaskList.push(new Task(title, project, dueDate, priority, description, userChecklist, isComplete));
        sortListByDueDate()
        pubSub.emit("taskListChanged", masterTaskList)
    };

    function sortListByDueDate() {
        masterTaskList.sort((a, b) => {
            return new Date(a.dueDate) - new Date(b.dueDate)
        });
    }
    
    function toggleCompleteTask() {
        const index = this.closest(".task-div").dataset.index;
        let completionStatus = masterTaskList[index].isComplete
        masterTaskList[index].isComplete = completionStatus === true ? false : true 

        console.log(`The following task has been completed ${masterTaskList[index].title}`)
        console.log(masterTaskList[index].isComplete)
        pubSub.emit("taskListChanged", masterTaskList)
        pubSub.emit("toggleComplete", masterTaskList)
    }


    // Important notes about date formats: 
    // months are indexed at zero! January == 00
    // .getDay() doesn't return the day of the week but the location of the weekday related to the week, use .getDate() instead
     
    function getDate() {
        const formattedDate = new Date().toISOString().substring(0, 10);
        return formattedDate
    }

    function getDateInSevenDays() {
        const today = new Date()
        const nextWeek = new Date(today.setDate(today.getDate() + 7)).toISOString().substring(0, 10);
        return nextWeek
    }

    function getDateThirtyDaysAgo() {
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() - 30)).toISOString().substring(0, 10);
        return nextWeek
    }

    function getFormattedDate() {
        const date = format(new Date(new Date), "MMMM do',' yyyy")
        return date
       
    }

    // completed tasks should be removed if they are over 30 days old
    function autoDeleteCompletedTasks() {
        const thirtyDaysAgo = getDateThirtyDaysAgo()
        for (const task of masterTaskList) {
            if (task.isComplete === true && task.dueDate <= thirtyDaysAgo) {
                console.log(`${task.title} is over 30 days old and was automatically removed`)
                console.log(masterTaskList.indexOf(task))
                masterTaskList.splice(masterTaskList.indexOf(task), 1)
                pubSub.emit("taskListChanged", masterTaskList)
            }
        }
        
    }

    function deleteTask() {
        const index = this.closest(".task-div").dataset.index;
        const removed = masterTaskList.splice(index, 1)
        console.log("Updated masterTaskList:")
        console.log(masterTaskList)
        console.log("The following task has been removed:")
        console.log(removed)

        pubSub.emit("taskListChanged", masterTaskList)
    }

    function changeProject(e) {
        const newProject = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].project = newProject
        pubSub.emit("detailsChanged", masterTaskList)
    }

    function changeDueDate(e) {
        const newDueDate = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].dueDate = newDueDate
        sortListByDueDate()
        pubSub.emit("detailsChanged", masterTaskList);
    }

    function changePriority(e) {
        const newPriority = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index
        masterTaskList[taskIndex].priority = newPriority;
        pubSub.emit("detailsChanged", masterTaskList);
    }

    function changeDescription(e) {
        const newDescription = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index
        masterTaskList[taskIndex].description = newDescription
        pubSub.emit("descriptionUpdated", masterTaskList);
    }

    function completeChecklistItem() {
        const taskIndex = this.closest(".task-div").dataset.index;
        const checklistItem = this.parentNode.children.item(1);

        masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`] = masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`] === false ? true : false

        pubSub.emit("checklistChanged", masterTaskList)
    }

    function deleteUserChecklistItem() {
        const indexOfTaskDiv = this.closest(".task-div").dataset.index;
        const checklistItem = this.parentNode.children.item(1).innerHTML
      
        delete masterTaskList[indexOfTaskDiv].userChecklist[`${checklistItem}`]

        console.log(`User deleted the ${checklistItem} checklist item on task ${indexOfTaskDiv}.`)
        
        pubSub.emit("checklistChanged", masterTaskList)
    }

    function addChecklistItem(e) {
        const index = e.target.parentNode.className
        console.log(e.target.parentNode.className)
        const selectedTask = masterTaskList[index]
        const userInput = e.target.children.item(1).children.item(1).value
        console.log(e.target.children.item(1).children.item(1).value)
        
        Object.assign(selectedTask.userChecklist, {[userInput]: false})

        //pubsub - on change, re-render checklist items
        pubSub.emit("checklistChanged", masterTaskList)  
    }

    function moveProjectsToAll() {
        console.log("moveProjects fn called")
        const projectNamesArr = projectManager.getProjects().map(((project) => project.name))
        for (const task of masterTaskList) {
            if (projectNamesArr.includes(task.project)) {
                // do nothing
            } else {
                task.project = "All"
                console.log(`${task.title}'s project category was removed, so it will be switched to "All"`)
            }
        }
        pubSub.emit("taskListChanged", masterTaskList)
    }

    
    pubSub.on("projectListChanged", () => pubSub.emit("taskListChanged", masterTaskList));

    pubSub.on("taskListChanged", storage.storeTasks)
    pubSub.on("checklistChanged", storage.storeTasks)
    pubSub.on("descriptionChanged", storage.storeTasks)
    pubSub.on("detailsChanged", storage.storeTasks)
    
    // storage.testLocalStorage()
    // localStorage.clear()
    // console.log("local storage cleared")

    // get data fn()s
    // these fn()s get original lists (not copies), which can be modified
    const getMasterTaskList = () => masterTaskList;
    const getPriorities = () => priorities;

    return {
        getTasksFromStorage,
        addTaskToMasterList,
        toggleCompleteTask,
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
        deleteUserChecklistItem,
        addChecklistItem,
        moveProjectsToAll,

        getMasterTaskList,
        getPriorities,
    }
})()



// exports
export{toDoManager}



// Unused code - delete later

