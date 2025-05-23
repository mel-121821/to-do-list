 //__________Projects Logic__________
 
 import { pubSub } from "./pubsub.js";
 
 const projectManager = (function() {

    function Project(name){
        this.name = name
    }

    function addProject(name) {
        projects.push(new Project(name))
        pubSub.emit("project")
    }

    function deleteProject() {
        const index = this.parentNode.dataset.index
        projects.splice(index, 1)
        console.log(projectManager.getProjects())
        // moveProjectsToAll()
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

     // filter out duplicates
    const projectArr = projects.map(function(project){
        return project
    })

    const getProjects = () => projects

    const projectNamesArr = projects.map(((project) => project.name))
      

    const getProjectNames = () => projectNamesArr
    // console.log(projectNamesArr)

    

    return {
        addProject,
        deleteProject,
        getProjects,
        getProjectNames,
    }
})()


 export {projectManager}