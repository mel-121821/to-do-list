 //__________Projects Logic__________
 
 const projectManager = (function() {
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
        return project.name
    })

    const getProjects = () => projectArr

    return {
        getProjects,
    }
})()


 export {projectManager}