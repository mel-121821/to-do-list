

const storage = (function() {

    function checkTasksExist() {
        if (!localStorage.getItem("tasks") || getStoredTasks().length < 1) {
            return false;
        } else {
            return true;
        }
    }

    function getStoredTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        return tasks;
    }


    function checkProjectsExist() { 
        if (!localStorage.getItem("projects")) {
            return false;
        } else {
            return true;
        }
    }

    function getStoredProjects() {
        let projects = JSON.parse(localStorage.getItem("projects"));
        return projects;
    }

    function checkThemesExist() {
        if (!localStorage.getItem("themes")) {
            return false;
        } else {
            return true;
        }
    }

    function getStoredThemes() {
        let themes = JSON.parse(localStorage.getItem("themes"));
        return themes;
    }

    function storeTasks(data) {
        localStorage.setItem("tasks", JSON.stringify(data));
    }

    function storeProjects(data) {
        localStorage.setItem("projects", JSON.stringify(data));
    }

    function storeThemes(data) {
        localStorage.setItem("themes", JSON.stringify(data));
    }

    function clearLocalStorage() {
        localStorage.clear();
    }

    

    return {
        checkTasksExist,
        getStoredTasks,
        storeTasks,

        checkProjectsExist,
        getStoredProjects,
        storeProjects,

        checkThemesExist,
        getStoredThemes,
        storeThemes,

        clearLocalStorage,
    }
})(); 

export { storage };