import * as classNames from 'classnames';
import { ipcRenderer as ipc } from 'electron';
import * as React from 'react';

import * as openIcon from 'assets/open.svg';

import * as styles from './Navigation.scss';


export type Page = (
  'Query'|
  'Content'
);

interface NavigationProps {
  pages: { title: Page, icon: string }[],
  selected?: string,
  onClick?: (page: Page) => void,
};

interface NavigationState {};

export class Navigation extends React.Component<NavigationProps, NavigationState> {
  handleOnClick = (page: Page) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(page);
    }
  }

  render() {
    const { pages, selected } = this.props;

    return (
      <nav className={styles.navigation}>
        <button onClick={() => { ipc.send('openDialog') }}>
          <img src={openIcon} />
        </button>
        <hr />
        {pages.map(page => (
          <button
            key={page.title}
            className={classNames({ [styles.selected]: page.title === selected })}
            onClick={() => this.handleOnClick(page.title)}>
            <img src={page.icon} />
          </button>
        ))}
      </nav>
    );
  }
}
