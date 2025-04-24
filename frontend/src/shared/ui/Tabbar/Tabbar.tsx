import { Item } from './Item/Item';
import styles from './Tabbar.module.css';
import { TabbarProps } from './Tabbar.props';

export const Tabbar = (props: TabbarProps) => {
  const { children } = props;

  return <div className={styles.base}>{children}</div>;
};

Tabbar.Item = Item;
