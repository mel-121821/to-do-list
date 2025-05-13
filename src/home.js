//__________home.js__________
//__________To-do Logic__________

const toDoManager = (function() {

    // constructor
    function Task(title, project, dueDate, priority, description, userChecklist = []) {
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
            ]
        },
        {
            title: "Do Laundry",
            project: "Laundry",
            dueDate: new Date().toISOString().substring(0, 10),
            priority: "high",
            description: "Laundromat opens at 6am",
            userChecklist: [
                "Go to the bank to get change"
            ]
        },
        {
            title: "Cat Chores",
            project: "Pets",
            dueDate: "2025-05-11",
            priority: "normal",
            description: "Wash both water bowls, plus automatic feeder and refill. Mix proper ratio of foods: 3 parts HP, 1 part dental and 1 part gastro.",
            userChecklist: [
                "Wash water bowls", "Rotate auto feeder, wash and refill", "Clean litter boxes", "Put cat beds in laundry basket"
            ]
        },
        {
            title: "Make dinner",
            project: "Food",
            dueDate: new Date().toISOString().substring(0, 10),
            priority: "low",
            description: "Menu: Udon stir-fry",
            userChecklist: [
                "Defrost beef strips", "Marinate strips with 1/2 sauce for a few hours", "Blanche udon and broccoli", "Prep onion and garlic", "Saute onion garlic and beef", "Add broccoli and udon", "Add remaining sauce", "Serve"
            ]
        },
    ]
    const priorities = ["low", "normal", "high"]
    const completedTaskList = [];


    // fn()s to add tasks
    function addTaskToMasterList (title, project, dueDate, priority, description, userChecklist = []) {
        masterTaskList.push(new Task(title, project, dueDate, priority, description, userChecklist));
    };

    addTaskToMasterList("Say hello", "Pets", "2025-05-12", "low", "Description goes here", ["My list item 1", "My list item 2", "My list item 3"]);

    // use .find()?? to search for matching element in masterTaskList, will need to add logic to prevent user from adding an exact copy of a task
    function completeTask() {
        // need to change how element is selected due to having different filtered versions
        const index = this.parentNode.dataset.index;
        const taskRemoved = removeTaskFromList(index)
        // need spread syntax here, otherwise taskRemoved will be placed into the completed list as an array of one
        moveTaskToCompleted(...taskRemoved);
        console.log(getMasterTaskList())
    }

    function removeTaskFromList(index) {
        const removed = getMasterTaskList().splice(index, 1)
        console.log("Updated masterTaskList:")
        console.log(toDoManager.getMasterTaskList())
        console.log("The following task has been removed:")
        console.log(...removed)
        console.log(pubSub)

        pubSub.emit("taskRemoved", getMasterTaskList())
        // need to change logic to a pubsub method
        // domManipulator.renderTaskList(getMasterTaskList())
        return removed
    }

    function moveTaskToCompleted(removed) {
        toDoManager.getCompletedTaskList().push(removed)
        console.log("The following task has been moved to the completedTaskList:")
        console.log(toDoManager.getCompletedTaskList())
    } 

    function deleteTask() {
        const index = this.parentNode.dataset.index;
        console.log(`User has removed the following task: ${getMasterTaskList()[index].title} at index: ${index}`)
        removeTaskFromList(index)
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
        pubSub.emit("taskUpdated", getMasterTaskList())
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
        console.log(this.parentNode.parentNode.parentNode.dataset.index)
        console.log(indexOfTaskDiv)
        console.log(indexOfChecklistItem)
        toDoManager.getMasterTaskList()[indexOfTaskDiv].userChecklist.splice(indexOfChecklistItem, 1)

        // pubsub - on change, rerender checklistItems
        pubSub.emit("checklistItemRemoved", getMasterTaskList())

        console.log(`User deleted checklist item at index: ${indexOfChecklistItem}`)
        console.log("New list of user items:")
        console.log(getMasterTaskList()[indexOfTaskDiv].userChecklist)
    }

    function addChecklistItem() {
        const indexOfTaskDiv = this.parentNode.parentNode.dataset.index;
        const selectedTask = getMasterTaskList()[indexOfTaskDiv]
        const checklistItemsDiv = this.previousSibling
        console.log(checklistItemsDiv)
        console.log(selectedTask)
        selectedTask.userChecklist.push("Checklist item added")

        //pubsub - on change, re-render checklist items
        pubSub.emit("checklistItemAdded", getMasterTaskList())

        // To be replaced with a fn() to get user input   
        console.log("User added a new checklist item:")
        console.log(getMasterTaskList()[indexOfTaskDiv].userChecklist)   
    }

    // get data fn()s
    // these fn()s get original lists (not copies), which can be modified
    const getMasterTaskList = () => masterTaskList;
    const getPriorities = () => priorities;
    const getCompletedTaskList = () => completedTaskList

    return {
        completeTask,
        deleteTask,
        removeTaskFromList,
        updateTask,
        completeChecklistItem,
        deleteUserChecklistItem,
        addChecklistItem,

        getMasterTaskList,
        getPriorities,
        getCompletedTaskList
    }
})()

const pubSub = (function(){
    const events = {
        events: {},
        on: function (eventName, fn) {
            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(fn);
            // console.log(events)
        },
        off: function(eventName, fn) {
            if (this.events[eventName]) {
                for (let i = 0; i < events[eventName].length; i++) {
                    if (this.events[eventName][i] === fn) {
                        this.events[eventName].splice(i, 1);
                        break
                    }
                }
            }
        },
        emit: function (eventName, data) {
            if (this.events[eventName]) {
                this.events[eventName].forEach(function(fn) {
                    fn(data);
                });
            }
        }
    }
    return events
})()

// exports
export{toDoManager}
export{pubSub}