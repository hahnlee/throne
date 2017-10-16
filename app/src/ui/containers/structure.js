import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { REALM_OBJECT_PROPERTY } from 'lib/realm';

class Structure extends Component {
  constructor(props) {
    super(props);
    const cellWidth = {};

    // Bind function
    this.getTableWidth = this.getTableWidth.bind(this);
    this.renderCell = this.renderCell.bind(this);

    for (let property in REALM_OBJECT_PROPERTY) {
      cellWidth[property] = property.length * 20;
    }

    this.state ={
      cellWidth: cellWidth
    };
  }

  render() {
    return (
      <div className="realm-result">
        <AutoSizer>
          {({ width, height }) => (
            <Table
              headerHeight={25}
              height={height-15}
              width={this.getTableWidth(width)}
              rowHeight={25}
              rowClassName="table-row"
              rowCount={Object.keys(this.props.realmResult.properties).length}
              rowGetter={
                ({index}) => this.props.realmResult.properties[
                  Object.keys(this.props.realmResult.properties)[index]
                ]
              }
            >
              {Object.keys(REALM_OBJECT_PROPERTY).map(key =>
                <Column
                  key={key}
                  dataKey={key}
                  label={key}
                  width={REALM_OBJECT_PROPERTY[key].width}
                  height={25}
                  cellRenderer={this.renderCell}
                />
              )}
            </Table>
          )}
        </AutoSizer>
      </div>
    );
  }

  getTableWidth(width) {
    let tableWidth = 0;
    for (let key in REALM_OBJECT_PROPERTY) {
      tableWidth += REALM_OBJECT_PROPERTY[key].width;
    }
    if (width > tableWidth)
      return width;
    return tableWidth;
  }

  renderCell({cellData, dataKey}) {
    if (REALM_OBJECT_PROPERTY[dataKey].type === 'boolean') {
      return (
        <input type="checkbox" checked={cellData} disabled={true}/>
      );
    }
    return (
      <span>{cellData}</span>
    );
  }
}
export default Structure;