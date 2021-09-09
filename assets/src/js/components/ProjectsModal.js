import {Component} from 'react';
import $ from 'jquery';
import iro from '@jaames/iro';

export default class ProjectsModal extends Component {

    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        const colorPicker = new iro.ColorPicker('#color-picker', {
            width: 200
        });

        colorPicker.on('color:change', (color) => {
            this.props.setProjectColor(color.hexString);
        });
    }

    render() {

        return (
            <div className="cell c-modal c-modal--project grid-x align-middle">
                <div className="cell grid-container">
                    <div className="grid-x align-center">
                        <form className="cell small-8 c-modal__form" onSubmit={(e) => this.props.addProjectToList(e)}>
                            <input onChange={(e) => this.props.setProjectName(e.target.value)} type="text" name="project-name" placeholder="Project name"/>
                            <div className="c-modal__colour-picker" id="color-picker"></div>
                            <button className="button success" type="submit">Add Project</button>
                        </form>
                    </div>
                </div>
            </div>
        );
      }
}