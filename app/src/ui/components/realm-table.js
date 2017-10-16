import React, { Component } from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { setRealmResult } from 'actions/content';
import { isNumbernicType } from 'lib/realm';

import './realm-table.css';

class RealmTable extends Component {
  constructor(props) {
    super(props);
    this.getTableWidth = this.getTableWidth.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.resizeCell = this.resizeCell.bind(this);
    this.state = {
      width: {}
    };
  }

  render() {
    return(
      <div className="table-wrap">
      <AutoSizer>
        {({ width, height}) => {
          const tableWidth = this.getTableWidth(width);
          return (
            <Table
              headerHeight={30}
              height={width === tableWidth ? height : height - 15}
              width={tableWidth}
              rowHeight={20}
              rowClassName="table-row"
              rowCount={this.props.realmResult.length}
              rowGetter={
                ({index}) => this.props.realmResult[index]
              }
            >
              {Object.keys(this.props.realmSchema).map(key => {
                return (<Column
                  key={key}
                  dataKey={key}
                  label={key}
                  width={this.state.width[key]}
                  height={25}
                  cellRenderer={this.renderCell}
                  headerRenderer={this.renderHeader}
                />);
              })}
            </Table>
          );
        }}
      </AutoSizer>
      </div>
    );
  }

  /**
  * Function return reasonable table width
  * If the sum of columns is width smaller then parent width
  * then return parent width else return sum of columns width
  * @param {number} width
  * @returns {number}
  */
  getTableWidth(width) {
    let tableWidth = 0;
    for (let key in this.props.realmSchema) {
      if (!this.state.width[key]) {
        this.state.width[key] = key.length * 15;
      }
      tableWidth += this.state.width[key];
    }
    return tableWidth > width ? tableWidth : width;
  }

  /**
  * 
  * @param {string} param0 trealmSchema key
  * @returns {JSX.Element} dragg able header cell
  */
  renderHeader({dataKey}) {
    return (
      <div className="table-header-cell">
        <div className="table-header-content">
          <p>{dataKey}</p>
          <span>{this.props.realmSchema[dataKey].type}</span>
        </div>
        <Draggable
          axis="x"
          handle=".handle"
          defaultClassName="handle-default"
          defaultClassNameDragging="handle-active"
          position={{
            x: 0,
            y: 0
          }}
          onDrag={(e, data) => {this.resizeCell(dataKey, data);}}
          >
          <div className="handle"></div>
        </Draggable>
      </div>
    );
  }

  /**
   * Resize handler
   * @param {string} key 
   * @param {DraggableData} data 
   */
  resizeCell(key, data) {
    const newCellWidth = this.state.width[key] + data.deltaX;
    const newWidth = this.state.width;
    newWidth[key] = newCellWidth;
    this.setState({width: newWidth});
  }

  renderCell({cellData, dataKey}) {
    const schemaType = this.props.realmSchema[dataKey].type;

    if (isNumbernicType(schemaType)) {
      return (<div className="number-cell">{cellData}</div>);
    }

    switch(schemaType) {
      case'bool':
        return (<input type="checkbox" checked={cellData} disabled={true}/>);
      case 'data':
        return (<span>{'<Data>'}</span>)
      case 'list':
        return (
          <span
            className="relativeModel"
            onClick={
              () => {
                this.props.setRealmResult(
                  cellData,
                  this.props.realmSchema[dataKey].objectType
              )}
            }
          >
            {`${this.props.realmSchema[dataKey].objectType} [${cellData.length}]`}
          </span>
        );
      case 'object':
        return (
          <span
            className="relativeModel"
            onClick={
              () => {
                this.props.setRealmResult(
                  [cellData],
                  this.props.realmSchema[dataKey].objectType
              )}
            }
          >
            {this.props.realmSchema[dataKey].objectType}
          </span>
        );
      default:
        return (<span>{String(cellData)}</span>);
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setRealmResult: function(realmResult, model) {
      dispatch(setRealmResult(realmResult, model));
    }
  }
}

export default connect(null, mapDispatchToProps)(RealmTable);