import {Component} from 'react';
import $ from 'jquery';

export default class ProjectsModal extends Component {

    constructor(props)
    {
        super(props);
    }

    render() {

        return (
            <div className="cell c-modal c-modal--project grid-x align-middle">
                <div className="cell grid-container">
                    <div className="grid-x align-center">
                        <form className="cell small-8 c-modal__form" onSubmit={(e) => this.props.addProjectToList(e)}>
                            <input onChange={(e) => this.props.setProjectName(e.target.value)} type="text" name="project-name" placeholder="Project name"/>
                            <input onChange={(e) => this.props.setProjectColor(e.target.value)} type="color" name="project-color" value="#e66465"/>
                            <button className="button success" type="submit">Add Project</button>
                        </form>
                    </div>
                </div>
            </div>
        );
      }
}