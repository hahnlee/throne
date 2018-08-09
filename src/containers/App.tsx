import { ipcRenderer as ipc } from 'electron';
import * as React from 'react';
import * as Realm from 'realm';

import { Navigation, Page } from 'components/Navigation';
import { SchemaList } from 'components/SchemaList';
import { RealmTable } from 'components/RealmTable';
import { Query } from './Query';

import * as listIcon from 'assets/list.svg';
import * as queryIcon from 'assets/query.svg';

import * as styles from './App.scss';


interface AppProps {
};

interface AppState {
  realm?: Realm,
  selectedModel?: Realm.ObjectSchema,
  page: Page,
};

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      realm: undefined,
      selectedModel: undefined,
      page: 'Content',
    };
  }

  private pages: { title: Page, icon: string }[] = [
    { title: 'Content', icon: listIcon },
    { title: 'Query', icon: queryIcon },
  ];

  componentDidMount() {
    ipc.on('realmPath', (event: any, path: string) => {
      const realm = new Realm({ path });
      this.setState({ realm, selectedModel: realm.schema[0] });
    });
  }

  selectModel = (selectedModel: Realm.ObjectSchema)  => {
    this.setState({ selectedModel });
  }

  selectPage = (page: Page) => {
    this.setState({ page });
  }

  renderTooltip() {
    const { realm } = this.state;
    if (realm) return null;
    return (
      <div className={styles.toolTip}>
        Click to open Realm file
      </div>
    );
  }

  renderSchemaList() {
    const { realm, selectedModel } = this.state;
    if (!realm) return null;
    return (
      <SchemaList
        schema={realm.schema}
        onClickItem={this.selectModel}
        selectedModel={selectedModel} />
    );
  }

  renderContent() {
    const { realm, selectedModel, page } = this.state;
    if (!realm || !selectedModel) return null;
    if (page === 'Query') {
      return (
        <Query
          realm={realm}
          properties={selectedModel.properties}
        />
      );
    }

    return (
      <RealmTable
        properties={selectedModel.properties}
        data={realm.objects(selectedModel.name)}/>
    );
  }

  renderNavigation() {
    const { realm, page } = this.state;
    if (!realm) {
      return (<Navigation pages={[]} />);
    }

    return (
      <Navigation
        selected={page}
        onClick={this.selectPage}
        pages={this.pages} />
    );
  }

  render() {
    return (
      <div className={styles.app}>
        {this.renderNavigation()}
        {this.renderTooltip()}
        {this.renderSchemaList()}
        {this.renderContent()}
      </div>
    )
  }
}
