// @flow
import React, {Component} from "react"
import PropTypes from "prop-types"

class ColorBar extends Component {

    static propTypes = {
      color: PropTypes.string,
      height: PropTypes.number
    };

  static defaultProps = {
    color: '#033b77',
    height: 2
  };


    render(){
        return <div style={{height: this.props.height, width: '100%', backgroundColor: this.props.color}}>

        </div>;
    }

}

export default ColorBar;
