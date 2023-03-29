import React from 'react';
import styles from './FuncButton.module.css';

interface Prop {
  header: string;
  src: string;
  propWidth: string;
  onc: () => void;
  isdisabled?: boolean;
}

const FuncButton: React.FunctionComponent<Prop> = ({ header, src, propWidth, onc, isdisabled = false }) => {
  return (
    <button className={styles.funcButton} style={{ width: propWidth }} onClick={onc} disabled={isdisabled}>
      <span className={styles.buttonHeader}>{header}</span>
      <span className={styles.buttonIcon}>
        <img src={src} alt="" />
      </span>
    </button>
  );
};

export default FuncButton;
