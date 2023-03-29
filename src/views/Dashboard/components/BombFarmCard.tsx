import React from 'react';
import { useMemo, useCallback } from 'react';
import styles from '../Dashboard.module.css';
import useBombStats from '../../../hooks/useBombStats';
import useShareStats from '../../../hooks/usebShareStats';
import useBondStats from '../../../hooks/useBondStats';

import useTreasuryAllocationTimes from '../../../hooks/useTreasuryAllocationTimes';
import useFetchBombTVL from '../../../hooks/fetchBombTVL';
import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import useBombFinance from '../../../hooks/useBombFinance';
import BondButtons from './BondButtons';
import { useTransactionAdder } from '../../../state/transactions/hooks';
import FuncButton from './FuncButton';
import ContentHeader from './ContentHeader';
import DataGrid from './DataGrid';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useBank from '../../../hooks/useBank';
import useStatsForPool from '../../../hooks/useStatsForPool';

const BombFarmCard: React.FC = () => {
  const BombBtcbBankID = 'BombBtcbLPBShareRewardPool';
  const BombBnbBankID = 'BshareBnbLPBShareRewardPool';
  const bombBtcBank = useBank(BombBtcbBankID);
  const bombBnbBank = useBank(BombBnbBankID);
  // console.log(bombBnbBank);
  // console.log(bombBtcBank);

  const { onReward } = useHarvestFromBoardroom();
  const bombFinance = useBombFinance();

  //bomb
  const bombStats = useBombStats();

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

  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  const bondsPurchasable = useBondsPurchasable();
  const addTransaction = useTransactionAdder();
  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  let statsOnPoolBTC = useStatsForPool(bombBtcBank);
  let statsOnPoolBNB = useStatsForPool(bombBnbBank);

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
      <div className={styles.paddingAdder}>
        <ContentHeader src="./bsharebnblp1@2x.png" header="BOMB-BTCB" TVL={statsOnPoolBTC?.TVL} />
        <DataGrid
          dailyReturns={bombBtcBank.closedForStaking ? '0.00' : statsOnPoolBTC?.dailyAPR}
          yourStakeval="6.0000"
          yourStakevalDlr="$1171.62"
          earned="1660.4413"
          earnedDlr="$298.88"
          isBoardFarms={true}
          onc1={onReward}
          onc2={onReward}
          onc3={onReward}
        />
      </div>

      <hr className={styles.fullWidthHR} />
      <div className={styles.paddingAdder}>
        <ContentHeader src="./bomb-bitcoin-LP.png" header="BSHARE-BNB" TVL={statsOnPoolBNB?.TVL} />
        <DataGrid
          dailyReturns={bombBnbBank.closedForStaking ? '0.00' : statsOnPoolBNB?.dailyAPR}
          yourStakeval="6.0000"
          yourStakevalDlr="$1171.62"
          earned="1660.4413"
          earnedDlr="$298.88"
          isBoardFarms={true}
          onc1={onReward}
          onc2={onReward}
          onc3={onReward}
        />
      </div>
    </div>
  );
};

export default BombFarmCard;
