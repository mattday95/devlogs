import {Component} from 'react';
import $ from 'jquery';
import ResourceModal from '../components/ResourceModal';
import ProjectsModal from '../components/ProjectsModal';
import Header from '../components/Header';
import ResourceList from '../components/ResourceList';
import ProjectList from '../components/ProjectList';

export default class Popup extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            resources : [],
            projects : [],
            isProjectModalActive : false,
            isResourceModalActive : false,
            projectName : null,
            projectColor : 'green',
            resourceDescription : '',
            resourceType : '',
            resourceRating : null,
            relatedProject : null,
            view : 'projects',
            currentProject : null
        }
    }

    componentDidMount()
    {
        chrome.storage.sync.get(['resources', 'projects'], (result) => {

            this.setState({
                resources : result.resources ? JSON.parse(result.resources) : [],
                projects : result.projects ? JSON.parse(result.projects) : [],
            });
        });

        $('html').click( (e) => {   
            
            e.stopPropagation();

            if(!$(e.target).closest('.c-modal__form').length && $(e.target).closest('.c-modal').length)
            {
                this.setState({
                    isProjectModalActive : false,
                    isResourceModalActive : false
                });              
            }
         }); 


    }

    addResourceToProject(e)
    {
        e.preventDefault();
        let arr = this.state.resources.slice();
        console.log(this.state.relatedProject);

        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url;
            arr.push({
                id : '',
                url : url,
                project : this.state.relatedProject,
                type : this.state.resourceType,
                description : this.state.resourceDescription,
                rating : this.state.resourceRating,
                added : Date.now(),
                clicks : 0
            });
            console.log(arr);
            chrome.storage.sync.set({ "resources":  JSON.stringify(arr)}, () => {
                this.setState({
                    resources : arr,
                    isResourceModalActive : false
                })
            });
        });

    }

    addProjectToList(e)
    {
        e.preventDefault();

        let arr = this.state.projects.slice();

        arr.push({
            id : '',
            title : this.state.projectName,
            color : this.state.projectColor,
            order : 1
        });

        chrome.storage.sync.set({ "projects":  JSON.stringify(arr)}, () => {
            this.setState({
                projects : arr,
                isProjectModalActive : false
            })
        });
    }

    viewResourcesForProject(project){
        this.setState({
            view : 'resources',
            currentProject : project
        })
    }

    getResourcesByProject()
    {
        const project = this.state.currentProject;
        const allResources = this.state.resources.slice();
        const filteredResources = allResources.filter(resource => resource.project == project);
        return filteredResources;
    }

    clearAll()
    {
        chrome.storage.sync.set({
            projects : JSON.stringify([]),
            resources : JSON.stringify([])
        }, () => {
            this.setState({
                projects : [],
                resources : []
            });
        });
    }

    getResourceCount(project)
    {
        return this.state.resources.filter(resource => resource.project == project).length;
    }
    addClickToResource(e, resource)
    {
        let arr = this.state.resources.slice();

        const modifiedArr = arr.map(data => {
            
            if(data.url == resource.url){
                let modifiedData = data;
                modifiedData['clicks'] = modifiedData['clicks'] + 1;
                return modifiedData;
            }

            return data;
        });

        chrome.storage.sync.set({ "resources":  JSON.stringify(modifiedArr)}, () => {
            this.setState({
                resources : modifiedArr
            })
        });
    }

    render() {

        return (
            <div className="o-app-container">

                <div className="grid-container full">

                    <div className="grid-x">

                        <Header
                            activateResourceModal={() => this.setState({isResourceModalActive : true})}
                            activateProjectModal={() => this.setState({isProjectModalActive : true})}
                            clearAll={() => this.clearAll()}
                        />

                        {
                            this.state.view == 'projects' &&
                            <ProjectList
                                isActive={this.state.view == 'projects'}
                                projects={this.state.projects}
                                viewResourcesForProject={(project) => this.viewResourcesForProject(project)}
                                getResourceCount={(project) => this.getResourceCount(project)}
                            />
                        }
                        {
                            this.state.view == 'resources' &&
                            <div className="cell grid-container">
                                <ResourceList
                                    resources={this.getResourcesByProject()}
                                    addClickToResource={(e, resource) => this.addClickToResource(e, resource)}
                                    currentProject={this.state.currentProject}
                                    backToProjects={() => this.setState({view : 'projects'})}
                                />
                            </div>
                        }
                        {
                            this.state.isProjectModalActive &&
                            <ProjectsModal
                                setProjectName={(projectName) => this.setState({projectName})}
                                setProjectColor={(projectColor) => this.setState({projectColor})}
                                addProjectToList={(e) => this.addProjectToList(e)}
                            />
                        }
                        { 
                            this.state.isResourceModalActive &&
                           <ResourceModal
                                projects={this.state.projects}
                                setResourceRating={(resourceRating) => this.setState({resourceRating})}
                                setResourceType={(resourceType) => this.setState({resourceType})}
                                setResourceDescription={(resourceDescription) => this.setState({resourceDescription})}
                                setRelatedProject={(relatedProject) => this.setState({relatedProject})}
                                addResourceToProject={(e) => this.addResourceToProject(e)}
                           />
                        }
                    </div>

                </div>

            </div>
        );
      }
}