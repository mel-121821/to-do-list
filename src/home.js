//__________home.js__________

export const test = "JS is working";

const masterTaskList = [
    {
        title: "Make grocery list",
        category: "Food",
        dueDate: "08/04/2025",
        priority: "low",
        description: "Need eggs, black forest ham, sliced cheese and english muffins"
    },
    {
        title: "Collect sheets",
        category: "Laundry",
        dueDate: "08/04/2025",
        priority: "high",
        description: "Complete before 5pm"
    },
    {
        title: "Wash cat dishes",
        category: "Pets",
        dueDate: "08/04/2025",
        priority: "normal",
        description: "Wash both water bowls, plus automatic feeder and refill. Mix proper ratio of foods: 3 parts HP, 1 part dental and 1 part gastro."
    }
]

function getCategories(masterTaskList) {
    const allProjectCategories = [];
    for (const task of masterTaskList) {
        console.log(task.category)
        allProjectCategories.push(`${task.category}`)
    }
    return allProjectCategories
}



export{masterTaskList};
export {getCategories};