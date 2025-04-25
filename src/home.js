//__________home.js__________
//__________Logic__________


// constructor
function Task(title, category, dueDate, priority, description, userChecklist = []) {
    // the userChecklist = [] allows an empty array to be used as the default value

    // direct user input
    this.title = title;
    
    // selected from dropdown
    this.category = category;
    this.dueDate = dueDate;
    this.priority = priority;

    // direct user input
    this.description = description;
    this.userChecklist = userChecklist;

    // add fn to add checklist item
    // add fn to remove checklist item
}



// fn()s to add tasks
function addTaskToMasterList (title, category, dueDate, priority, description, userChecklist = []) {
    masterTaskList.push(new Task(title, category, dueDate, priority, description, userChecklist));
};

addTaskToMasterList("Say hello", "Pets", "2025-04-22", "low", "Description goes here", ["My list item 1", "My list item 2", "My list item 3"]);



// data lists
const masterTaskList = [
    {
        title: "Make grocery list",
        category: "Food",
        dueDate: "2025-04-09",
        priority: "low",
        description: "Need eggs, black forest ham, sliced cheese and english muffins",
        userChecklist: [
            "Eggs", "BFH, 400g shaved", "Havarti with jalepeno", "Eng muffin (white)", "Also need garlic mayo"
        ]
    },
    {
        title: "Do Laundry",
        category: "Laundry",
        dueDate: "2025-04-18",
        priority: "high",
        description: "Laundromat opens at 6am",
        userChecklist: [
            "Go to the bank to get change"
        ]
    },
    {
        title: "Cat Chores",
        category: "Pets",
        dueDate: "2025-04-16",
        priority: "normal",
        description: "Wash both water bowls, plus automatic feeder and refill. Mix proper ratio of foods: 3 parts HP, 1 part dental and 1 part gastro.",
        userChecklist: [
            "Wash water bowls", "Rotate auto feeder, wash and refill", "Clean litter boxes", "Put cat beds in laundry basket"
        ]
    },
    {
        title: "Make dinner",
        category: "Food",
        dueDate: "2025-04-09",
        priority: "low",
        description: "Menu: Udon stir-fry",
        userChecklist: [
            "Defrost beef strips", "Marinate strips with 1/2 sauce for a few hours", "Blanche udon and broccoli", "Prep onion and garlic", "Saute onion garlic and beef", "Add broccoli and udon", "Add remaining sauce", "Serve"
        ]
    },
]
const categories = [
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



// get data fn()s
// fn()s get original lists (not copies), which can be modified
const getMasterTaskList = () => masterTaskList;
const categoryArr = categories.map(function(category){
    return category.name
})
const getCategories = () => categoryArr
const getPriorities = () => priorities;
const getCompletedTaskList = () => completedTaskList


// exports
export{masterTaskList};
export{getMasterTaskList};

export {categories}
export {getCategories};

export {priorities}
export {getPriorities}

export {completedTaskList}
export {getCompletedTaskList}