 //__________Projects Logic__________
 
 import { pubSub } from "./pubsub.js";
 import { storage } from "./storage.js"
 
 const projectManager = (function() {

    function Project(name){
        this.name = name
    }

    let projects = [{
                icon: "all-icon",
                name: "All"
            },];

    // getProjectsFromStorage()

    function getProjectsFromStorage() {
        if (storage.checkProjectsExist() === true) {
            projects = storage.getStoredProjects()
        } else {
           // do nothing
        }
        console.log(projects)
    }
    

    function addProject(name) {
        projects.push(new Project(name))
        pubSub.emit("projectListChanged", projects)
    }

    function deleteProject(projectIndex) {
        const index = projectIndex;
        projects.splice(index, 1)
        console.log(projectManager.getProjects())
        // moveProjectsToAll()
        pubSub.emit("projectListChanged", projects)
        pubSub.emit("projectDeleted", projects)
    }

    // let projects = [
    //     {
    //         icon: "all-icon",
    //         name: "All"
    //     },
    //     {
    //         icon: "icon",
    //         name: "Food"
    //     },
    //     {
    //         icon: "icon",
    //         name: "Laundry"
    //     },
    //     {
    //         icon: "icon",
    //         name: "Pets"
    //     }
    // ]

    pubSub.on("projectListChanged", storage.storeProjects)

    const getProjects = () => projects

    return {
        addProject,
        deleteProject,
        getProjects,
        getProjectsFromStorage
    }
})()


 export {projectManager}