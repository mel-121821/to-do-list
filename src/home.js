//__________home.js__________
//__________Logic__________

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
    const projects = [
        {
            icon: "all-icon",
            name: "All"
        },
        {
            icon: "icon",
            name: "Food"
        },
        {
            icon: "icon",
            name: "Laundry"
        },
        {
            icon: "icon",
            name: "Pets"
        }
    ]
    const priorities = ["low", "normal", "high"]
    const completedTaskList = [];


    // fn()s to add tasks
    function addTaskToMasterList (title, project, dueDate, priority, description, userChecklist = []) {
        masterTaskList.push(new Task(title, project, dueDate, priority, description, userChecklist));
    };

    addTaskToMasterList("Say hello", "Pets", "2025-05-12", "low", "Description goes here", ["My list item 1", "My list item 2", "My list item 3"]);







    // get data fn()s
    // these fn()s get original lists (not copies), which can be modified
    const getMasterTaskList = () => masterTaskList;

    // filter out duplicates
    const projectArr = projects.map(function(project){
        return project.name
    })
    const getProjects = () => projectArr
    const getPriorities = () => priorities;
    const getCompletedTaskList = () => completedTaskList

    return {
        getMasterTaskList,
        getProjects,
        getPriorities,
        getCompletedTaskList
    }
})()

// exports
export{toDoManager}