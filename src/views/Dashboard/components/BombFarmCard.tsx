import React from 'react';
import styles from '../Dashboard.module.css';

import FuncButton from './FuncButton';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useBank from '../../../hooks/useBank';
import BombFarmCardUtil from './BombFarmCardUtil';

const BombFarmCard: React.FC = () => {
  const bankIds = ['BombBtcbLPBShareRewardPool', 'BshareBnbLPBShareRewardPool'];
  let banks = [];
  banks[0] = useBank(bankIds[0]);
  banks[1] = useBank(bankIds[1]);
  const imgSrc = ['./bomb-bitcoin-LP.png', './bsharebnblp1@2x.png'];

  const { onReward } = useHarvestFromBoardroom();

  return (
    <div className={styles.bombFarm}>
      <div className={styles.paddingAdder}>
        <div className={styles.bombFarmHeader}>
          <span className={styles.bombFarmHeaderChild}>
            <span className={styles.bombFarmHeaderChild1}>Bomb Farms</span>
            <span className={styles.bombFarmHeaderChild2}>
              Stake your LP tokens in our farms to start earning $BSHARE
            </span>
          </span>
          <FuncButton header="Claim All" src="./bomb2.png" propWidth="12%" onc={onReward} />
        </div>
      </div>
      {banks.map((bank, index) => (
        <React.Fragment key={index}>
          <BombFarmCardUtil bank={bank} src={imgSrc[index]} />
          {index !== banks.length - 1 && <hr className={styles.fullWidthHR} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BombFarmCard;
