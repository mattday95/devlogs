import {Component} from 'react';
import $ from 'jquery';

export default class ResourceModal extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            options : ['Blog Post', 'Video', 'Stack Overflow', 'Podcast', 'Other']
        }
    }

    componentDidMount()
    {
        this.props.setResourceType(this.state.options[0])
        this.props.setRelatedProject(this.props.projects[0].id);
    }

    render() {

        return (
            <div className="cell c-modal c-modal--resource grid-x align-middle">
                <div className="cell grid-container c-modal__inner">
                    <div className="grid-x align-center">
                        <form className="cell small-8 c-modal__form" onSubmit={(e) => this.props.addResourceToProject(e)}>
                            <select onChange={(e) => this.props.setRelatedProject(e.target.value)} name="related-project">
                                {
                                    this.props.projects.map( (project, i) => (
                                        <option key={i} value={project.id}>{project.title}</option>
                                    ))
                                }
                            </select> 
                            <select onChange={(e) => this.props.setResourceType(e.target.value)}>
                                {
                                    this.state.options.map((option, i) => (
                                        <option value={option} key={i}>{option}</option>
                                    ))
                                }
                            </select>
                            <input onChange={(e) => this.props.setResourceRating(e.target.value)} type="number" min="0" max="5" placeholder="Resource rating"/>
                            <textarea placeholder="Resource description" onChange={(e) => this.props.setResourceDescription(e.target.value)} name="resource-description"/>
                            <button className="button" type="submit">Add Resource</button>
                        </form>
                    </div>
                </div>
            </div>
        );
      }
}