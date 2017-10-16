import React, { Component } from 'react';
import { connect } from 'react-redux';

import { RealmTable } from 'components';
import { selectField, selectOperator, setQueryValue} from 'actions/content';
import { NUMBERNIC_QUERY, STRING_QUERY, isNumbernicType } from 'lib/realm';

class Content extends Component {
  constructor(props) {
    super(props);
    this.renderQuery = this.renderQuery.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  render() {
    return (
      <div className="realm-result">
        <div className="realm-search">
          search: 
          <select onChange={this.props.selectField} value={this.props.field}>
            <option value="" defaultChecked>---------------</option>
            {Object.keys(this.props.realmSchema).map(key => {
              const schemaType = this.props.realmSchema[key].type;
              if (isNumbernicType(schemaType) || schemaType === 'string') {
                return (<option key={key} value={key}>{key}</option>);
              }
              return null;
            })}
          </select>
          <select onChange={this.props.selectOperator} value={this.props.operator}>
            <option value="" defaultChecked>---------------</option>
            {this.renderQuery()}
          </select>
          <input
            onKeyPress={this.handleKeyPress}
            onChange={this.props.setQueryValue}
            value={this.props.value}
          />
        </div>
        <RealmTable
          realmResult={this.props.realmResult}
          realmSchema={this.props.realmSchema}
        />
      </div>
    );
  }

  /**
   * Render Filtering query select box
   * @returns {React.ReactElement}
   */
  renderQuery() {
    if (this.props.field && this.props.realmSchema[this.props.field]) {
      const realmType = this.props.realmSchema[this.props.field].type;
      if (isNumbernicType(realmType)) {
        return NUMBERNIC_QUERY.map(key => (
          <option key={key} value={key}>{key}</option>
        ));
      }
      if (realmType === 'string') {
        return STRING_QUERY.map(key => (
          <option key={key} value={key}>{key}</option>
        ));
      }
    }
    return null;
  }

  /**
   * Handle Enter key, create realm filtering query
   * @param {React.KeyboardEvent} e 
   */
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (this.props.field && this.props.operator) {
        const realmType = this.props.realmSchema[this.props.field].type;
        if (isNumbernicType(realmType)) {
          this.props.realmQuery(`${this.props.field} ${this.props.operator} ${e.target.value}`);
          return;
        } else if (realmType === 'string') {
          this.props.realmQuery(`${this.props.field} ${this.props.operator} "${e.target.value}"`);
        }
      }
    }
  }
}

function mapStateToProp(state) {
  return {
    field: state.query.field,
    operator: state.query.operator,
    value: state.query.value
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectField: function(e) {
      dispatch(selectField(e.target.value));
    },
    selectOperator: function(e) {
      dispatch(selectOperator(e.target.value));
    },
    setQueryValue: function(e) {
      dispatch(setQueryValue(e.target.value));
    }
  }
}

export default connect(mapStateToProp, mapDispatchToProps)(Content);