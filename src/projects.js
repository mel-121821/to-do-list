 //__________Projects Logic__________
 
 import { pubSub } from "./pubsub.js";
 import { storage } from "./storage.js"
 
 const projectManager = (function() {

    function Project(name){
        this.name = name
    }

    let projects = [{
                name: "All"
            },];


    function getProjectsFromStorage() {
        if (storage.checkProjectsExist() === true) {
            projects = storage.getStoredProjects();
        } else {
           // do nothing
        }
    }

    getProjectsFromStorage();
    

    function addProject(name) {
        projects.push(new Project(name));
        pubSub.emit("projectListChanged", projects);
    }

    function deleteProject(projectIndex) {
        const index = projectIndex;
        projects.splice(index, 1);
        pubSub.emit("projectListChanged", projects);
        pubSub.emit("projectDeleted", projects);
    }

    pubSub.on("projectListChanged", storage.storeProjects);

    const getProjects = () => projects;

    return {
        addProject,
        deleteProject,
        getProjects,
        getProjectsFromStorage
    }
})();

export {projectManager};