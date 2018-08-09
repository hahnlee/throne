import * as React from 'react';
import * as classNames from 'classnames';
import { AutoSizer, Column, Table, TableCellProps, TableHeaderProps } from 'react-virtualized';
import * as Realm from 'realm';

import { Formats } from 'utils/formats';
import * as styles from './RealmTable.scss';

import 'react-virtualized/styles.css';

interface RealmTableProps {
  properties: Realm.PropertiesTypes,
  data?: Realm.Results<any>,
};

interface RealmTableState {};

export class RealmTable extends React.Component<RealmTableProps, RealmTableState> {
  renderHeader({ dataKey }: TableHeaderProps) {
    return (
      <div>{dataKey}</div>
    );
  }

  renderCell = ({ cellData, dataKey }: TableCellProps) => {
    const { properties } = this.props;

    const cellDataSchema = properties[dataKey];
    const cellDataType: Realm.PropertyType = typeof cellDataSchema === 'string' ? cellDataSchema : cellDataSchema.type;
    switch (cellDataType) {
      case 'int':
      case 'double':
      case 'int':
        return (
          <div className={classNames(styles.cell, styles.number)}>{Formats.number(cellData as number)}</div>
        );
      case 'data': {
        return (
          <div className={classNames(styles.cell, styles.data)}>
            {`<Data: ${Formats.bytes((cellData as ArrayBuffer).byteLength)}>`}
          </div>
        );
      }
      default:
        return (<div className={styles.cell}>{cellData.toString()}</div>);
    }
  }

  renderColumns() {
    const { properties } = this.props;
    return Object.keys(properties).map(property => (
      <Column
        key={property}
        dataKey={property}
        width={property.length * 16}
        cellRenderer={this.renderCell}
        headerRenderer={this.renderHeader}
      />
    ));
  }

  renderTable(width: number, height: number) {
    const { data } = this.props;
    if (!data) return null;
    return (
      <Table
        rowHeight={20}
        rowCount={data.length}
        rowGetter={
          ({index}) => data[index]
        }
        headerHeight={30}
        width={width}
        height={height}>
        {this.renderColumns()}
      </Table>
    );
  }

  render() {
    return (
      <div className={styles.realmTable}>
        <AutoSizer>
          {({width, height}) => this.renderTable(width, height)}
        </AutoSizer>
      </div>
    );
  }
}
