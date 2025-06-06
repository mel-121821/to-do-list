//__________home.js__________
//__________To-do Logic__________

import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";
import { storage } from "./storage.js";

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

    function getTasksFromStorage() {
        if (storage.checkTasksExist() === true) {
            masterTaskList = storage.getStoredTasks()
        } else {
           // do nothing
        }
        console.log(masterTaskList)
    }

    getTasksFromStorage()

    // const masterTaskList = [
    //     {
    //         title: "Make grocery list",
    //         project: "Food",
    //         dueDate: new Date().toISOString().substring(0, 10),
    //         priority: "low",
    //         description: "Need eggs, black forest ham, sliced cheese and english muffins",
    //         userChecklist: {
    //             "Eggs": false,
    //             "BFH 400g shaved": false,
    //             "Havarti with jalepeno": false,
    //             "Eng muffin (white)": false, 
    //             "Also need garlic mayo": false
    //         },
    //         isComplete: false,
    //     },
    //     {
    //         title: "Do Laundry",
    //         project: "Laundry",
    //         dueDate: new Date().toISOString().substring(0, 10),
    //         priority: "high",
    //         description: "Laundromat opens at 6am",
    //         userChecklist: {
    //             "Go to the bank to get change": false,
    //         },
    //         isComplete: false,
    //     },
    //     {
    //         title: "Cat Chores",
    //         project: "Pets",
    //         dueDate: "2025-02-17",
    //         priority: "normal",
    //         description: "Wash both water bowls, plus automatic feeder and refill. Mix proper ratio of foods: 3 parts HP, 1 part dental and 1 part gastro.",
    //         userChecklist: {
    //             "Wash water bowls": false, 
    //             "Rotate auto feeder, wash and refill": false, 
    //             "Clean litter boxes": false, 
    //             "Put cat beds in laundry basket": false,
    //         },
    //         isComplete: false,
    //     },
    //     {
    //         title: "Make dinner",
    //         project: "Food",
    //         dueDate: new Date().toISOString().substring(0, 10),
    //         priority: "low",
    //         description: "Menu: Udon stir-fry",
    //         userChecklist: {
    //             "Defrost beef strips": false, 
    //             "Marinate strips with 1/2 sauce for a few hours": false, 
    //             "Blanche udon and broccoli": false, "Prep onion and garlic": false, 
    //             "Saute onion garlic and beef": false, "Add broccoli and udon": false, 
    //             "Add remaining sauce": false, 
    //             "Serve": false
    //         },
    //         isComplete: false,
    //     },
    // ]
    const priorities = ["low", "normal", "high"]

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
        // console.log(masterTaskList)
    }

    // addTaskToMasterList("Say hello", "Pets", "2025-05-24", "low", "Description goes here", ["My list item 1", "My list item 2", "My list item 3"]);

    
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
     
    function getFormattedDate() {
        const formattedDate = new Date().toISOString().substring(0, 10);
        return formattedDate
    }

    function getDateInSevenDays() {
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() + 7)).toISOString().substring(0, 10);
        return nextWeek
    }

    function getDateThirtyDaysAgo() {
        const today = new Date();
        const nextWeek = new Date(today.setDate(today.getDate() - 30)).toISOString().substring(0, 10);
        return nextWeek
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
        pubSub.emit("taskListChanged", masterTaskList)
    }

    function changeDueDate(e) {
        const newDueDate = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index;
        masterTaskList[taskIndex].dueDate = newDueDate
        sortListByDueDate()
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function changePriority(e) {
        const newPriority = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index
        masterTaskList[taskIndex].priority = newPriority;
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function changeDescription(e) {
        const newDescription = e.target.value
        const taskIndex = e.target.closest(".task-div").dataset.index
        masterTaskList[taskIndex].description = newDescription
        pubSub.emit("taskListChanged", masterTaskList);
    }

    function completeChecklistItem() {
        const taskIndex = this.closest(".task-div").dataset.index;
        const checklistItem = this.parentNode.children.item(1);

        masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`] = masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`] === false ? true : false

        // console.log(masterTaskList[taskIndex].userChecklist[`${checklistItem.innerHTML}`])
        
        pubSub.emit("checklistItemChanged", masterTaskList)
        // checklistItem.style.textDecoration !== "line-through" ? checklistItem.style.textDecoration = "line-through" : checklistItem.style.textDecoration = "none"
    }

    function deleteUserChecklistItem() {
        const indexOfTaskDiv = this.closest(".task-div").dataset.index;
        const checklistItem = this.parentNode.children.item(1).innerHTML
      
        delete masterTaskList[indexOfTaskDiv].userChecklist[`${checklistItem}`]

        console.log(`User deleted the ${checklistItem} checklist item on task ${indexOfTaskDiv}.`)
        // console.log("New list of user items:")
        // console.log(masterTaskList[indexOfTaskDiv].userChecklist)
        
        pubSub.emit("checklistItemChanged", masterTaskList)
    }

    function addChecklistItem(e) {
        const index = e.target.parentNode.className
        console.log(e.target.parentNode.className)
        const selectedTask = masterTaskList[index]
        const userInput = e.target.children.item(2).children.item(1).value
        
        Object.assign(selectedTask.userChecklist, {[userInput]: false})

        //pubsub - on change, re-render checklist items
        pubSub.emit("checklistItemChanged", masterTaskList)

        // console.log("User added a new checklist item:")
        // console.log(masterTaskList[index].userChecklist)   
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

    // storage.testLocalStorage()
    // localStorage.clear()
    // console.log("local storage cleared")

    // storage.getStoredTasks()
    // projectManager.getProjectsFromStorage()

    // storage.populateStorage("tasks", masterTaskList)
    // storage.populateStorage("projects", projectManager.getProjects())

    // storage.getStoredTasks()
    // projectManager.getProjectsFromStorage()

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

        getFormattedDate,
        getDateInSevenDays,
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

// function moveTaskToCompleted(removed) {
//     toDoManager.getCompletedTaskList().push(removed)
//     console.log("The following task has been moved to the completedTaskList:")
//     console.log(toDoManager.getCompletedTaskList())
// } 

// function deleteTask() {
//     const index = this.parentNode.dataset.index;
//     console.log(`User has removed the following task: ${masterTaskList[index].title} at index: ${index}`)
//     removeTaskFromList(index)
// }

const getCompletedTasks = function() {
    const completedTasks = []
    for (const task of masterTaskList) {
        if (task.isComplete === true) {
            completedTasks.push(task)
        }
    }
    return completedTasks
}