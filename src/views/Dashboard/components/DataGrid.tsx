import React from 'react';
import styles from './DataGrid.module.css';
import FuncButton from './FuncButton';

interface Props {
  dailyReturns: string;
  yourStakeval: string;
  yourStakevalDlr: string;
  earned: string;
  earnedDlr: string;
  isBoardFarms: boolean;
  onc1: () => void;
  onc2: () => void;
  onc3: () => void;
}

const DataGrid: React.FunctionComponent<Props> = ({
  dailyReturns,
  yourStakeval,
  yourStakevalDlr,
  earned,
  earnedDlr,
  isBoardFarms,
  onc1,
  onc2,
  onc3,
}) => {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.DailyReturns}>
        Daily Returns:
        <span className={styles.DailyReturnsVal}>{dailyReturns}%</span>
      </div>
      <div className={styles.YourStake}>
        Your Stake
        <span>
          <img src="./bshare-512.png" alt="" /> {yourStakeval}
        </span>
        <span>&#8776;{yourStakevalDlr}</span>
      </div>
      <div className={styles.Earned}>
        Earned
        <span>
          <img src="./bomb.png" alt="" />
          {earned}
        </span>
        <span>&#8776;{earnedDlr}</span>
      </div>
      {isBoardFarms ? (
        <div className={styles.Buttons1}>
          <FuncButton header="Deposit" src="./up.svg" propWidth="30%" onc={onc1} />
          <FuncButton header="Withdraw" src="./down.svg" propWidth="30%" onc={onc2} />
          <FuncButton header="Claim Rewards" src="./bomb2.png" propWidth="30%" onc={onc3} />
        </div>
      ) : (
        <div className={styles.Buttons2}>
          <FuncButton header="Deposit" src="./up.svg" propWidth="45%" onc={onc1} />
          <FuncButton header="Withdraw" src="./down.svg" propWidth="45%" onc={onc2} />
          <FuncButton header="Claim Rewards" src="./bomb2.png" propWidth="90%" onc={onc3} />
        </div>
      )}
    </div>
  );
};

export default DataGrid;
