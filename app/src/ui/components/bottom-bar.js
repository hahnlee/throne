import React, { Component } from 'react';
import './bottom-bar.css';

import { dependencies } from '../../../package.json';

class BottomBar extends Component {
  render() {
    return (
      <div className="bottom-bar">
         Schema {this.props.schemaVersion} | 
         Realm JS {dependencies.realm.replace('^', '')}
      </div>
    );
  }
}

export default BottomBar;