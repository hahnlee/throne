import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import './wellcome.css';

import throneIcon from '../assets/icon-256x256.png';

class WellCome extends Component {
  constructor(props) {
    super(props);
    this.openDialog = this.openDialog.bind(this);
  }

  /**
   * Open dialog that used for choose realmfile
   * The result is sent to App.js
   */
  openDialog() {
    ipc.send('openDialog');
  }

  render() {
    return (
      <div className="wellcome-container">
        <figure>
          <img src={throneIcon} alt="appIcon"/>
        </figure>
          <h1>Well Come Throne</h1>
          <button onClick={this.openDialog}>Open Realm File</button>
      </div>
    );
  }
}

export default WellCome;