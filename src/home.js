//__________home.js__________

export const test = "JS is working";

const masterTaskList = [
    {
        title: "Make grocery list",
        category: "Food",
        dueDate: "2025-04-09",
        priority: "low",
        description: "Need eggs, black forest ham, sliced cheese and english muffins"
    },
    {
        title: "Collect sheets",
        category: "Laundry",
        dueDate: "2025-04-18",
        priority: "high",
        description: "Complete before 5pm"
    },
    {
        title: "Wash cat dishes",
        category: "Pets",
        dueDate: "2025-04-16",
        priority: "normal",
        description: "Wash both water bowls, plus automatic feeder and refill. Mix proper ratio of foods: 3 parts HP, 1 part dental and 1 part gastro."
    },
    {
        title: "Make dinner",
        category: "Food",
        dueDate: "2025-04-09",
        priority: "low",
        description: "Take meat out of the freezer by noon"
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

const priorityOptions = ["low", "normal", "high"]

const getPriorities = () => priorityOptions;

export{masterTaskList};
export {categories}
export {getCategories};

export {priorityOptions}
export {getPriorities}