import React, { useMemo } from 'react';
import styles from '../Dashboard.module.css';
import TableRow from './TableRow';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import useCashPriceInEstimatedTWAP from '../../../hooks/useCashPriceInEstimatedTWAP';
import useCurrentEpoch from '../../../hooks/useCurrentEpoch';
import useBombStats from '../../../hooks/useBombStats';
import useShareStats from '../../../hooks/usebShareStats';
import useBondStats from '../../../hooks/useBondStats';

import ProgressCountdown from '../../Supply/components/ProgressCountdown';
import moment from 'moment';
import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes';
import useFetchBombTVL from '../../../hooks/fetchBombTVL';

const SummaryCard: React.FC = () => {
  const lastCashPrice = useCashPriceInLastTWAP();
  const liveCashPrice = useCashPriceInEstimatedTWAP();
  // const {path} = useRouteMatch();
  const currentEpoch = useCurrentEpoch();

  //bomb
  const bombStats = useBombStats();
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  //bshare
  const bShareStats = useShareStats();
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  //bbond
  const tBondStats = useBondStats();
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  const { to } = useTreasuryAllocationTimes();
  const bombTVL = useFetchBombTVL();
  console.log(liveCashPrice);
  // const liveTWAP = (Number(liveCashPrice) / 100000000000000).toFixed(4);
  const bondScale = (Number(lastCashPrice) / 100000000000000).toFixed(4);

  const scalingFactor = useMemo(
    () => (liveCashPrice ? Number(liveCashPrice.priceInDollars).toFixed(4) : null),
    [liveCashPrice],
  );

  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );

  return (
    <div className={styles.summaryDiv}>
      <p className={styles.summaryTitle}>Bomb Finance Summary</p>
      <hr />
      <div className={styles.summaryContent}>
        <div className={styles.summaryContentValue}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Current Supply</th>
                <th>Total Supply</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                src1="./bomb1.png"
                crp="$BOMB"
                currentSupply={bombCirculatingSupply}
                totalSupply={bombTotalSupply}
                price1={bombPriceInDollars}
                price2={`${bombPriceInBNB} BTC`}
                src2="./metamask-fox.svg"
              />
              <TableRow
                src1="./bomb2.png"
                crp="$BSHARE"
                currentSupply={bShareCirculatingSupply}
                totalSupply={bShareTotalSupply}
                price1={bSharePriceInDollars}
                price2={`${bSharePriceInBNB} BNB`}
                src2="./metamask-fox.svg"
              />
              <TableRow
                src1="./bbonds.png"
                crp="$BBOND"
                currentSupply={tBondCirculatingSupply}
                totalSupply={tBondTotalSupply}
                price1={tBondPriceInDollars}
                price2={`${tBondPriceInBNB} BTC`}
                src2="./metamask-fox.svg"
              />
            </tbody>
          </table>
        </div>
        {/* Epoch */}
        <div className={styles.summaryContentEpoch}>
          <div className={styles.currentEpoch}>
            <p className={styles.epochTitle}>Current Epoch</p>
            <section className={styles.epochVal}>{Number(currentEpoch)}</section>
          </div>
          <hr />
          <div className={styles.nextEpoch}>
            <section className={styles.nextEpochTime}>
              <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
            </section>
            <section className={styles.epochTitle}>Next Epoch in</section>
          </div>
          <hr />
          <div className={styles.TWAPConDiv}>
            <section>
              Live TWAP: <span className={styles.nextTwapLive}>{scalingFactor}</span>
            </section>
            <section>
              TVL: <span className={styles.nextTwapTVL}>${bombTVL.toFixed(2)}</span>
            </section>
            <section>
              Last Epoch TWAP: <span className={styles.lastTwap}>{bondScale}</span>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
