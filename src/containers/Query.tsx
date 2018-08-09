import * as vm from 'vm';

import * as React from 'react';
import * as Realm from 'realm';
import AceEditor from 'react-ace';
import Draggable, { DraggableData } from 'react-draggable';
import * as _ from 'lodash';

import { RealmTable } from 'components/RealmTable';

import * as styles from './Query.scss';

import 'brace/mode/javascript';
import 'brace/theme/tomorrow';


interface QueryProps {
  realm: Realm,
  properties: Realm.PropertiesTypes,
};

interface QueryState {
  result?: Realm.Results<any>,
  code: string,
  error?: string,
  properties: Realm.PropertiesTypes,
  height: number,
};

export class Query extends React.Component<QueryProps, QueryState> {
  constructor(props: QueryProps) {
    super(props);
    this.state = {
      result: undefined,
      error: '',
      code: '',
      properties: props.properties,
      height: 400,
    };
  }

  resizeHeight(e: Event, data: DraggableData) {
    const { height } = this.state;
    this.setState({ height: height + data.deltaY });
  }

  getProperties(code: string) {
    const { realm } = this.props;
    const re = /realm\.objects\(\'(.*?)\'\)/g;
    let match = re.exec(code);

    if (!match) throw new Error('Please use realm.objects("MODEL_NAME")');

    let modelName = match[1];
    while ((match = re.exec(code)) !== null) {
      modelName = match[1];
    }

    for (const model of realm.schema) {
      if (model.name === modelName) {
        return model.properties;
      }
    }

    throw new Error(`Object type ${modelName} not found in schema`);
  }

  handelOnClick() {
    const { realm } = this.props;
    const { code } = this.state;
    const sandbox = vm.createContext({ realm, console, _ });

    try {
      const result = vm.runInNewContext(code, sandbox) as Realm.Results<any>;
      const properties = this.getProperties(code);
      this.setState({ result, properties, error: '' });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  renderResult() {
    const { error, result, properties } = this.state;

    if (error) {
      return (
        <div>{error}</div>
      );
    }

    return (
      <RealmTable
        properties={properties}
        data={result}
      />
    );
  }

  render() {
    const { code, height } = this.state;

    return (
      <div className={styles.query}>
        <AceEditor
          mode="javascript"
          theme="tomorrow"
          width="100%"
          height={`${height}px`}
          value={code}
          onChange={code => this.setState({ code })}
        />
        <Draggable
          defaultClassName={styles.drag}
          axis="y"
          position={{
            x: 0,
            y: 0,
          }}
          onDrag={this.resizeHeight.bind(this)}>
          <div className={styles.drag} />
        </Draggable>
        <button onClick={this.handelOnClick.bind(this)}>Run</button>
      {this.renderResult()}
    </div>
    );
  }
}
