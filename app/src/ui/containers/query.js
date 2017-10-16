import React, { Component } from 'react';
import Draggable from 'react-draggable';

import { RealmTable } from 'components';

import { SQL_REGX } from 'lib/sql';

import './query.css';

class Query extends Component {
  constructor(props) {
    super(props);
    this.resizeView = this.resizeView.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.state = {
      style: {
        height: 200
      },
      schema: [],
      realmResult: null
    };
  }

  render() {
    return (
      <div className="q-wrapper">
        <div className="q-input-wrapper" style={this.state.style}>
          <textarea
            onKeyPress={this.handleKey}
            placeholder="caution! Only very few SELECT query is supported."
          />
          <Draggable
           axis="y"
           handle=".handle-y"
           position={{
             x: 0,
             y: 0
           }}
           defaultClassName="resizeY"
           defaultClassNameDragging="resizeYActive"
           onDrag={this.resizeView}
          >
            <div className="handle-y"></div>
          </Draggable>
        </div>
        {this.state.realmResult &&
          <RealmTable
            realmResult={this.state.realmResult}
            realmSchema={this.state.schema}
          />
        }
      </div>
    );
  }

  /**
   * Drag Handler
   * @param {MouseEvent} e 
   * @param {*} data 
   */
  resizeView(e, data) {
    const newheight = this.state.style.height + data.deltaY;
    const newStyle = {
      height: newheight
    }
    this.setState({style: newStyle});
  }

  /**
   * Create Realm Filter query
   * @param {React.KeyboardEvent} e 
   */
  handleKey(e) {
    if (e.key !== 'Enter') return;
    let sql_group = SQL_REGX.exec(e.target.value);
    if (!sql_group) return;

    let tmp_schema = {};
    let schema = {};
    let realmResult = null;

    try {
      for (let model_info of this.props.realm.schema) {
        if (model_info.name === sql_group[2]) {
          tmp_schema = model_info.properties;
          break;
        }
      }
    } catch (e) {
      console.log(e.message);
      return;
    }

    if (sql_group[1] === '*') {
      schema = tmp_schema;
    } else {
      let schema_list = sql_group[1].split(/,\s*/);
      console.log(schema_list);
      for (let schema_name of schema_list) {
        console.log(tmp_schema[schema_name]);
        schema[schema_name] = tmp_schema[schema_name];
      }
    }

    try {
      realmResult = this.props.realm.objects(sql_group[2]);
    } catch (e) {
      console.log(e.message);
      return;
    }

    if (sql_group[3]) {
      realmResult = realmResult.filtered(sql_group[3]);
    }
    console.log(schema, realmResult);

    this.setState({
      schema: schema,
      realmResult: realmResult
    });
  }
}

export default Query;