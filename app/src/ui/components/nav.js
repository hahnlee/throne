import React, { Component } from 'react';
import  { connect } from 'react-redux';
import Draggable from 'react-draggable';

import { dbIcon } from 'assets';
import { selectModel } from 'actions/content';

import './nav.css';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.resizeWidth = this.resizeWidth.bind(this);
    this.state = {
      style: {
        width: 200
      }
    };
  }

  render() {
    return (
      <nav className="nav" style={this.state.style}>
        <Draggable
          axis="x"
          handle=".nav-handle"
          defaultClassName="nav-handle-default"
          defaultClassNameDragging="nav-handle-active"
          position={{
            x: 0,
            y: 0
          }}
          onDrag={(e, data) => {this.resizeWidth(data.deltaX);}}
        >
          <div className="nav-handle"></div>
        </Draggable>
        <main>
          <p>Model</p>
          <div className="nav-button-wrap">
            {this.props.schema.map((table_info, index) => (
              <button
                className={index === this.props.index ? 'active' : ''}
                onClick={() => {this.props.selectModel(index)}} key={index}>
                  <img src={dbIcon} alt="dbIcon"/>
                  {table_info.name}
              </button>
            ))}
          </div>
        </main>
      </nav>
    )
  }

  resizeWidth(deltaX) {
    const newWidth = this.state.style.width + deltaX;
    const newStyle = {
      width: newWidth
    }
    this.setState({style: newStyle});
  }
}

function mapStateToProp(state) {
  return {
    index: state.modelSelect
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectModel: function(index) {
      return dispatch(selectModel(index));
    }
  }
}

export default connect(mapStateToProp, mapDispatchToProps)(NavBar);
