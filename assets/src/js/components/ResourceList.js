import {Component} from 'react';
import $ from 'jquery';

export default class ResourceList extends Component {

    constructor(props)
    {
        super(props);
    }

    render() {

        return (
            <div className="grid-x o-resources-list">
                <span type="button" onClick={() => this.props.backToProjects()} className="cell c-back-link button">Back to projects</span>
                {
                    this.props.resources.length > 0 ?
                    <table className="cell">
                        <thead>
                            <tr>
                                <th>Link</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Rating</th>
                                <th>Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.resources.map( (resource, i) => (
                                    <tr className="o-project-list__resource" key={i}>
                                        <td><a onClick={(e) => this.props.addClickToResource(e, resource)} target="_blank" href={resource.url}>View Resource</a></td>
                                        <td>{resource.type}</td>
                                        <td>{resource.description}</td>
                                        <td>{resource.rating}</td>
                                        <td>{resource.clicks}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    : <p className="cell text-center o-resources-list__no-resources">Looks like there are no resources for this project</p>
                }
            </div>
        );
      }
}