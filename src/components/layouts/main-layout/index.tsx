import React, { PropsWithChildren } from 'react';
import styles from './main-layout.module.css';

type Props = PropsWithChildren<{}>;

function MainLayout({ children, ...props }: Props) {
  return <main className={styles.main}>{children}</main>;
}

export default MainLayout;
