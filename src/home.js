//__________home.js__________

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

function getCategories(categories) {
    const allProjectCategories = [];
    for (const item of categories) {
        allProjectCategories.push(`${item.name}`)
    }
    return allProjectCategories;
}

const priorities = ["low", "normal", "high"]

const getPriorities = () => priorities;

export{masterTaskList};
export {categories}
export {getCategories};

export {priorities}
export {getPriorities}