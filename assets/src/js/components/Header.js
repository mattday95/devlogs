import {Component} from 'react';
import $ from 'jquery';

export default class Header extends Component {

    constructor(props)
    {
        super(props);
    }

    render() {

        return (
            <div className="cell grid-x grid-margin-x o-app-container__header">
                {
                    this.props.addResources &&
                    <button type="button" className="cell shrink button" onClick={() => this.props.activateResourceModal()}>Add current url to project</button>
                }
                <button type="button" className="cell shrink button" onClick={() => this.props.activateProjectModal()}>Create new project</button>
                {/* <button type="button" className="cell shrink button alert" onClick={() => this.props.clearAll()}>Clear All</button> */}
            </div>
        );
      }
}