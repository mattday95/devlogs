import {Component} from 'react';
import $ from 'jquery';

export default class ProjectList extends Component {

    constructor(props)
    {
        super(props);
    }

    render() {

        return (
            <div className="cell o-project-list">
                {
                    this.props.projects.length > 0 && this.props.isActive &&
                    <ul className="o-project-list__list grid-x grid-margin-x">
                        {
                            this.props.projects.map( (project, i) => (
                                <li style={{backgroundColor : project.color}} onClick={(e) => this.props.viewResourcesForProject(project.title)} key={i} className="cell small-6 c-project o-project-list__project button">
                                    <span className="c-project__title">{project.title}</span>
                                    {
                                        this.props.getResourceCount(project.title) > 0 &&
                                        <span className="c-project__count">{this.props.getResourceCount(project.title)}</span>
                                    }
                                </li>
                            ))
                        }
                    </ul>
                }
                {
                    this.props.projects.length == 0 &&
                    <p className="o-project-list__no-projects cell text-center">Looks like you haven't created a project yet!</p>
                }
            </div>
        );
      }
}