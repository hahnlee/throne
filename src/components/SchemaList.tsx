import * as React from 'react';

import * as classNames from 'classnames';
import * as Realm from 'realm';

import * as styles from './SchemaList.scss';


interface SchemaListProps {
  schema: Realm.ObjectSchema[],
  selectedModel?: Realm.ObjectSchema,
  onClickItem: (item: Realm.ObjectSchema) => void,
};

interface SchemaListState {
};

export class SchemaList extends React.Component<SchemaListProps, SchemaListState> {
  render() {
    const { schema, selectedModel, onClickItem } = this.props;

    return (
      <div className={styles.schemaList}>
        {schema.map(schemaInfo => (
          <div
            key={schemaInfo.name}
            className={classNames(
              styles.listItem,
              {
                [styles.listItemSelected]: selectedModel && selectedModel.name === schemaInfo.name,
              },
            )}
            onClick={() => onClickItem(schemaInfo)}>
            {schemaInfo.name}
          </div>
        ))}
      </div>
    );
  }
}
