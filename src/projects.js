 //__________Projects Logic__________
 
 import { pubSub } from "./pubsub.js";
 
 const projectManager = (function() {

    function Project(name){
        this.name = name
    }

    function addProject(name) {
        projects.push(new Project(name))
        pubSub.emit("projectListChanged", projects)
    }

    function deleteProject() {
        const index = this.parentNode.dataset.index
        projects.splice(index, 1)
        console.log(projectManager.getProjects())
        // moveProjectsToAll()
        pubSub.emit("projectListChanged", projects)
        pubSub.emit("projectDeleted", projects)
    }

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

    const getProjects = () => projects

    return {
        addProject,
        deleteProject,
        getProjects,
    }
})()


 export {projectManager}