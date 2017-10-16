import { ipcRenderer as ipc } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Realm from 'realm';

import { selectTabitem } from 'actions/content';
import { contentIcon, fileIcon, infoIcon, queryIcon } from 'assets';
import { Content, Structure, WellCome, Query } from 'containers';
import { NavBar, BottomBar } from 'components';

import 'react-virtualized/styles.css';
import './app.css';
import './tab.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.setQuery = this.setQuery.bind(this);
    this.state = {
      realm: null,
      queryString: ''
    };
  }

  componentDidMount() {
    // Listen dialog reply and open realm file
    ipc.on('realmPath', (event, path) => {
      const realm = new Realm({path: path});
      this.setState({
        realm: realm
      })
    });
  }

  render() {
    const CONTENT_LIST = [
      {name: 'Structure', icon: infoIcon},
      {name: 'Content', icon: contentIcon},
      {name: 'Query', icon: queryIcon}
    ];

    return (
      <div className="react-frame">
        <header className="tab-header">
          <div className="tab-list">
            <div className="tab-item" onClick={() => {ipc.send('openDialog');}}>
              <img src={fileIcon} alt="fileIcon"/>
              Open
            </div>
          </div>
          <div className="tab-list">
            {CONTENT_LIST.map(key =>
              <div
                key={key.name}
                onClick={() => {
                  this.props.selectTabitem(key.name);
                }}
                className={
                  this.props.tabSelect === key.name.toLowerCase() ? 
                  'tab-item active' : 'tab-item'
                }>
                <img src={key.icon} alt={key.name}/>
                {key.name}
              </div>
            )}
          </div>
        </header>
        {this.state.realm ? this.renderContent() : <WellCome />}
      </div>
    );
  }

  /**
   * Return table content each tab
   * @returns {JSX.Element}
   */
  renderTable() {
    switch(this.props.tabSelect) {
      case 'structure':
        return (<Structure realmResult={this.state.realm.schema[this.props.index]}/>);
      case 'query':
        return (<Query realm={this.state.realm} />);
      default:
        let properties = {};
        if (this.props.isRelativeObject) {
          for (let schema of this.state.realm.schema) {
            if (schema.name === this.props.realativeModel) {
              properties = schema.properties;
              break;
            }
          }
        } else {
          properties = this.state.realm.schema[this.props.index].properties;
        }
        return (
          <Content
            realmSchema={properties}
            realmResult={this.getRealmResult()}
            realmQuery={this.setQuery}
          />
        );
    }
  }

  renderContent() {
    return [
      <div className="content-frame" key="content">
        <NavBar
          key="navbar"
          schema={this.state.realm.schema}
        />
        {this.renderTable()}
      </div>,
      <BottomBar
        key="bottom-bar"
        schemaVersion={this.state.realm.schemaVersion}
      />
    ];
  }

  setQuery(queryString) {
    this.setState({
      queryString: queryString
    });
  }

  /**
   * Return realm object that may be filtered
   * @returns Realm Object
   */
  getRealmResult() {
    let realmData; 
    // When click list or Object row
    if (this.props.isRelativeObject) {
      realmData = this.props.realmResult;
    } else {
      const modelName = this.state.realm.schema[this.props.index].name;
      realmData = this.state.realm.objects(modelName);
    }
    // if app Query String then filter result
    if (this.state.queryString) {
      try {
        return realmData.filtered(this.state.queryString);
      } catch (e) {
        console.log(e.message);
      }
    }
    return realmData;
  }
}

function mapStateToProp(state) {
  return {
    index: state.modelSelect,
    tabSelect: state.tabSelect,
    realmResult: state.realmResult,
    isRelativeObject: state.isRelativeObject,
    realativeModel: state.realativeModel
  };
}

function mapDispatchToProp(dispath) {
  return {
    selectTabitem: function(tabName) {
      dispath(selectTabitem(tabName));
    }
  }
}

export default connect(mapStateToProp, mapDispatchToProp)(App);