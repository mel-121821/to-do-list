

const storage = (function() {

    // test for local storage is taken from MDN web storage documentation. For more info, visit:
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API

    function storageAvailable(type) {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
            );
        }
    }

    function testLocalStorage() {
    if (storageAvailable("localStorage")) {
        console.log("Yippee! We can use localStorage awesomeness")
        } else {
        console.log("Too bad, no localStorage for us")
        }
    }

// ___________My code____________

    function checkTasksExist() {
        if (!localStorage.getItem("tasks") || getStoredTasks().length < 1) {
            return false
        } else {
            console.log("tasks exist in local storage")
            return true
        }
    }

    function getStoredTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks"))
        return tasks
    }

    // function getStoredTasks() {
    //     let tasks;
    //     if (!localStorage.getItem("tasks")) {
    //         tasks = []
    //     } else {
    //         tasks = JSON.parse(localStorage.getItem("tasks"))
    //     }
    //     console.log(tasks)
    //     return tasks
    // }

    function checkProjectsExist() { 
        if (!localStorage.getItem("projects")) {
            console.log("projects do not exist in local storage, return false")
            return false
        } else {
            console.log("projects exist in local storage")
            return true
        }
    }

    function getStoredProjects() {
        let projects = JSON.parse(localStorage.getItem("projects"))
        console.log(projects)
        return projects
    }

    // function populateStorage(key, data) {
    //     localStorage.setItem(key, JSON.stringify(data))
    // }

    function storeTasks(data) {
        localStorage.setItem("tasks", JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem("tasks")))
    }

    function storeProjects(data) {
        localStorage.setItem("projects", JSON.stringify(data))
        console.log(JSON.parse(localStorage.getItem("projects")))
    }

    function clearLocalStorage() {
        localStorage.clear()
    }

    

    return {
        testLocalStorage,

        checkTasksExist,
        getStoredTasks,
        storeTasks,

        checkProjectsExist,
        getStoredProjects,
        storeProjects,

        clearLocalStorage,
    }
})() 

export { storage }