import {Component} from 'react';
import $ from 'jquery';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(['https://ccbjkpotfypzpqnzktba.supabase.co'], ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMTEzMzQ2MywiZXhwIjoxOTQ2NzA5NDYzfQ.MMTsdqk7TcUqoCvXnC-OAb-Zeeg-uogVtwQtEzcrvsw']);

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
            isLoading : true,
            currentProject : null
        }
    }

    componentDidMount()
    {
        // chrome.storage.sync.get(['resources', 'projects'], (result) => {

        //     this.setState({
        //         resources : result.resources ? JSON.parse(result.resources) : [],
        //         projects : result.projects ? JSON.parse(result.projects) : [],
        //     });
        // });

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

         (async () => {
            let { data: Projects, error } = await supabase
            .from('Projects')
            .select('*')
        
            setTimeout(() => {

                this.setState({
                    projects : Projects,
                    isLoading : false
                });

            }, 1000)

          })();

          (async () => {
            let { data: Resources, error } = await supabase
            .from('Resources')
            .select('*')
        
            this.setState({
                resources : Resources
            })
          })();

    }

    addResourceToProject(e)
    {
        e.preventDefault();
        let arr = this.state.resources.slice();
        this.setState({isLoading: true});

        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

            let url = tabs[0].url;

            (async () => {
                const { data, error } = await supabase
                .from('Resources')
                .insert([
                    {
                        url : url,
                        project_id : this.state.relatedProject,
                        type : this.state.resourceType,
                        description : this.state.resourceDescription,
                        rating : this.state.resourceRating,
                    },
                ]);

                console.log(data);

                arr.push(data[0]);

                console.log(data);

                this.setState({
                    resources : arr,
                    isResourceModalActive : false,
                    isLoading: false
                })
            })();

            // console.log(arr);
            // chrome.storage.sync.set({ "resources":  JSON.stringify(arr)}, () => {
            // });
        });

    }

    addProjectToList(e)
    {
        e.preventDefault();
        this.setState({isLoading: true});

        let arr = this.state.projects.slice();

        (async () => {
            const { data, error } = await supabase
            .from('Projects')
            .insert([
                {
                    title : this.state.projectName,
                    colour : this.state.projectColor
                },
            ])

            arr.push(data[0]);

            this.setState({
                projects : arr,
                isProjectModalActive : false,
                isLoading : false
            });

        })();

        // const { data, error } = await supabase
        // .from('Projects')
        // .insert([
        //     {
        //         title : this.state.projectName
        //     },
        // ])


        // chrome.storage.sync.set({ "projects":  JSON.stringify(arr)}, () => {
        //     this.setState({
        //         projects : arr,
        //         isProjectModalActive : false
        //     })
        // });
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
        const filteredResources = allResources.filter(resource => resource.project_id == project);
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
        return this.state.resources.filter(resource => resource.project_id == project).length;
    }
    addClickToResource(e, resource)
    {
        let arr = this.state.resources.slice();
        let newClicks = null;
        this.setState({isLoading: true});

        const modifiedArr = arr.map(data => {
            
            if(data.id == resource.id){
                let modifiedData = data;
                modifiedData['clicks'] = modifiedData['clicks'] + 1;
                newClicks = modifiedData['clicks'];
                return modifiedData;
            }

            return data;
        });


        (async () => {
            const { data, error } = await supabase
            .from('Resources')
            .update({ clicks: newClicks })
            .eq('id', resource.id);

            this.setState({
                resources : modifiedArr,
                isLoading: false
            })
        })();


        // chrome.storage.sync.set({ "resources":  JSON.stringify(modifiedArr)}, () => {
        //     this.setState({
        //         resources : modifiedArr
        //     })
        // });
    }

    render() {

        return (
            <div className="o-app-container">

                <div className="grid-container full">

                    <div className="grid-x">

                        <Header
                            addResources={this.state.projects.length > 0}
                            activateResourceModal={() => this.setState({isResourceModalActive : true})}
                            activateProjectModal={() => this.setState({isProjectModalActive : true})}
                            clearAll={() => this.clearAll()}
                        />

                        {
                            this.state.view == 'projects' &&
                            <ProjectList
                                isLoading={this.state.isLoading}
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

                        {
                            this.state.isLoading &&
                            <div className="c-loader"><div></div><div></div></div>
                        }
                    </div>

                </div>

            </div>
        );
      }
}