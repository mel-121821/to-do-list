//__________home.js__________
//__________To-do Logic__________

import { projectManager } from "./projects.js";
import { pubSub } from "./pubsub.js";

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
        this.userChecklist = userChecklist;

        this.isComplete = isComplete

        // add fn to add checklist item
        // add fn to remove checklist item
    }

    // data lists
    const masterTaskList = [
        {
            title: "Make grocery list",
            project: "Food",
            dueDate: new Date().toISOString().substring(0, 10),
            priority: "low",
            description: "Need eggs, black forest ham, sliced cheese and english muffins",
            userChecklist: [
                "Eggs", "BFH, 400g shaved", "Havarti with jalepeno", "Eng muffin (white)", "Also need garlic mayo"
            ],
            isComplete: false,
        },
        {
            title: "Do Laundry",
            project: "Laundry",
            dueDate: new Date().toISOString().substring(0, 10),
            priority: "high",
            description: "Laundromat opens at 6am",
            userChecklist: [
                "Go to the bank to get change"
            ],
            isComplete: false,
        },
        {
            title: "Cat Chores",
            project: "Pets",
            dueDate: "2025-02-17",
            priority: "normal",
            description: "Wash both water bowls, plus automatic feeder and refill. Mix proper ratio of foods: 3 parts HP, 1 part dental and 1 part gastro.",
            userChecklist: [
                "Wash water bowls", "Rotate auto feeder, wash and refill", "Clean litter boxes", "Put cat beds in laundry basket"
            ],
            isComplete: false,
        },
        {
            title: "Make dinner",
            project: "Food",
            dueDate: new Date().toISOString().substring(0, 10),
            priority: "low",
            description: "Menu: Udon stir-fry",
            userChecklist: [
                "Defrost beef strips", "Marinate strips with 1/2 sauce for a few hours", "Blanche udon and broccoli", "Prep onion and garlic", "Saute onion garlic and beef", "Add broccoli and udon", "Add remaining sauce", "Serve"
            ],
            isComplete: false,
        },
    ]
    const priorities = ["low", "normal", "high"]

    // fn()s to add tasks
    function addTaskToMasterList (title, project, dueDate, priority, description, userChecklist = [], isComplete=false) {
        masterTaskList.push(new Task(title, project, dueDate, priority, description, userChecklist, isComplete));
        pubSub.emit("taskListChanged", masterTaskList)
    };

    // addTaskToMasterList("Say hello", "Pets", "2025-05-24", "low", "Description goes here", ["My list item 1", "My list item 2", "My list item 3"]);

    
    function toggleCompleteTask() {
        const index = this.parentNode.dataset.index;
        let completionStatus = masterTaskList[index].isComplete
        // console.log(completionStatus)
        masterTaskList[index].isComplete = completionStatus === true ? false : true 
        // console.log(completionStatus)
        console.log(`The following task has been completed ${getMasterTaskList()[index].title}`)
        console.log(masterTaskList[index].isComplete)
        pubSub.emit("toggleComplete", getMasterTaskList())
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
        const index = this.parentNode.dataset.index;
        const removed = getMasterTaskList().splice(index, 1)
        console.log("Updated masterTaskList:")
        console.log(toDoManager.getMasterTaskList())
        console.log("The following task has been removed:")
        console.log(removed)
        console.log(pubSub)

        pubSub.emit("taskListChanged", masterTaskList)
    }

    // create an to updateTask fn() and call changeProject under it. Add updateTask() to the event listener on the save btn

    function updateTask() {
        // this = dropdown > parentNode = ProjectsDiv > parentNode = TaskDiv > dataset > index
        const task = getMasterTaskList()[this.parentNode.parentNode.dataset.index]
        const element = this.parentNode.parentNode
        console.log(element)
        changeProject(task, element);
        changeDueDate(task, element);
        changePriority(task, element)
        console.log("User saves task info for the following task:")
        console.log(task);
        // pub/sub re-render
        pubSub.emit("taskListChanged", masterTaskList)
    }

    function changeProject(task, element) {
        const newProject = element.children.item(4).children.item(0).lastChild.value
        console.log(element.children.item(4).children.item(0).lastChild.value)
        task.project = newProject;
    }

    function changeDueDate(task, element) {
        const newDueDate = element.children.item(4).children.item(1).lastChild.value
        task.dueDate = newDueDate;
    }

    function changePriority(task, element) {
        const newPriority = element.children.item(4).children.item(2).lastChild.value
        task.priority = newPriority;
    }

    function completeChecklistItem() {
        const itemLabel = this.parentNode.children.item(1);
        // itemLabel.style.textDecoration = "line-through"
        itemLabel.style.textDecoration !== "line-through" ? itemLabel.style.textDecoration = "line-through" : itemLabel.style.textDecoration = "none"
    }

    function deleteUserChecklistItem() {
        const indexOfTaskDiv = this.parentNode.parentNode.parentNode.parentNode.dataset.index;
        const indexOfChecklistItem = this.parentNode.dataset.itemNum;
        toDoManager.getMasterTaskList()[indexOfTaskDiv].userChecklist.splice(indexOfChecklistItem, 1)

        console.log(`User deleted checklist item on task ${indexOfTaskDiv} at index: ${indexOfChecklistItem}`)
        console.log("New list of user items:")
        console.log(getMasterTaskList()[indexOfTaskDiv].userChecklist)
        
        pubSub.emit("checklistItemChanged", masterTaskList)
    }

    function addChecklistItem() {
        const indexOfTaskDiv = this.parentNode.parentNode.dataset.index;
        const selectedTask = getMasterTaskList()[indexOfTaskDiv]
        const checklistUl = this.previousSibling
        console.log(checklistUl)
        console.log(selectedTask)
        selectedTask.userChecklist.push("Checklist item added")

        //pubsub - on change, re-render checklist items
        pubSub.emit("checklistItemChanged", masterTaskList)

        // To be replaced with a fn() to get user input   
        console.log("User added a new checklist item:")
        console.log(getMasterTaskList()[indexOfTaskDiv].userChecklist)   
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



    // get data fn()s
    // these fn()s get original lists (not copies), which can be modified
    const getMasterTaskList = () => masterTaskList;
    const getPriorities = () => priorities;
    


    return {
        addTaskToMasterList,
        toggleCompleteTask,
        deleteTask,
        updateTask,
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
//     console.log(`User has removed the following task: ${getMasterTaskList()[index].title} at index: ${index}`)
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