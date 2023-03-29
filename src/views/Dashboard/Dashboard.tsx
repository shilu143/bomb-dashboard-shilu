import React from 'react';
import { useMemo, useCallback } from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import Page from '../../components/Page';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import bg1 from '../../assets/img/bg1.svg';
import bg2 from '../../assets/img/bg2.svg';
import styles from './Dashboard.module.css';
import FuncButton from './components/FuncButton';
import TableRow from './components/TableRow';
import DataGrid from './components/DataGrid';
import ContentHeader from './components/ContentHeader';
import moment from 'moment';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBombStats from '../../hooks/useBombStats';
import useShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import useFetchBoardRoomTVL from '../../hooks/fetchBoardRoomTVL';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import DepositModal from '../Boardroom/components/DepositModal';
import useFetchBombTVL from '../../hooks/fetchBombTVL';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import BondTest from './components/bondTest';
import useBombFinance from '../../hooks/useBombFinance';
import { getDisplayBalance } from '../../utils/formatBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import useTokenBalance from '../../hooks/useTokenBalance';
import BondButtons from './components/BondButtons';

const BackgroundImage = createGlobalStyle`
  body {
    background-image: url(${bg1}), url(${bg2});
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
const TITLE = 'bomb.money | Dashboard';

const Dashboard: React.FC = () => {
  const lastTWAP = useCashPriceInLastTWAP();
  // const {path} = useRouteMatch();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const bombStats = useBombStats();
  const bShareStats = useShareStats();
  const tBondStats = useBondStats();
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const boardroomTVL = useFetchBoardRoomTVL();
  const boardroomDailyAPR = useFetchBoardroomAPR() / 365;
  const boardRoomTotalStaked = useTotalStakedOnBoardroom();
  const boardRoomMyStake = useStakedBalanceOnBoardroom();
  const mydlrstake = Number(boardRoomMyStake) * Number(bSharePriceInDollars);
  const boardRoomEarn = useEarningsOnBoardroom();
  const mydlrearn = Number(boardRoomEarn) * Number(bombPriceInDollars);
  const bombTVL = useFetchBombTVL();
  const { onReward } = useHarvestFromBoardroom();
  const bondStat = useBondStats();
  const cashPrice = useCashPriceInLastTWAP();
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);

  const bombFinance = useBombFinance();
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
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

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );

  const bondBalance = useTokenBalance(bombFinance?.BBOND);

  // const [onPresentDeposit, onDismissDeposit] = useModal(
  //   <DepositModal
  //     max={tokenBalance}
  //     onConfirm={(value) => {
  //       onStake(value);
  //       onDismissDeposit();
  //     }}
  //     tokenName={'BShare'}
  //   />,
  // );

  // const [onPresentWithdraw, onDismissWithdraw] = useModal(
  //   <WithdrawModal
  //     max={stakedBalance}
  //     onConfirm={(value) => {
  //       onWithdraw(value);
  //       onDismissWithdraw();
  //     }}
  //     tokenName={'BShare'}
  //   />,
  // );

  return (
    // <Switch>
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className={styles.outerContainer}>
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
                    price2="1.05 BTCB"
                    src2="./metamask-fox.svg"
                  />
                  <TableRow
                    src1="./bomb2.png"
                    crp="$BSHARE"
                    currentSupply={bShareCirculatingSupply}
                    totalSupply={bShareTotalSupply}
                    price1={bSharePriceInDollars}
                    price2="13000 BTCB"
                    src2="./metamask-fox.svg"
                  />
                  <TableRow
                    src1="./bbonds.png"
                    crp="$BBOND"
                    currentSupply={tBondCirculatingSupply}
                    totalSupply={tBondTotalSupply}
                    price1={tBondPriceInDollars}
                    price2="1.15 BTCB"
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
                  Live TWAP: <span className={styles.nextTwapLive}>1.17</span>
                </section>
                <section>
                  TVL: <span className={styles.nextTwapTVL}>${bombTVL.toFixed(2)}</span>
                </section>
                <section>
                  Last Epoch TWAP: <span className={styles.lastTwap}>{1.22}</span>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.secondSection}>
          <div className={styles.middleLeftSection}>
            <div className={styles.readInvestment}>
              <a href="#">Read Investment Strategy </a>
            </div>
            <div className={styles.investment}>
              <button type="button" className={styles.investButton}>
                Invest Now
              </button>
            </div>
            <div className={styles.connectSection}>
              <button type="button">
                <span>
                  <img src="./discord.png" alt="" />
                </span>
                Chat on Discord
              </button>
              <button type="button">
                <span>
                  <img src="./docs.png" alt="" />
                </span>
                Read Docs
              </button>
            </div>
            <div className={styles.boardRoom}>
              <div className={styles.boardroomHeader}>
                <span className={styles.boardroomLogo}>
                  <img src="./bshare-512.png" alt="" />
                </span>
                <div className={styles.boardroomHeaderChild1}>
                  <div className={styles.boardroomHeaderChild1_1}>
                    <p className={styles.boardRoomTitle}>Boardroom</p>

                    <p className={styles.recommendedTag}>Recommended</p>
                  </div>
                  <div className={styles.boardroomHeaderChild1_2}>
                    <p className={styles.boardRoomDetails}>Stake BSHARE and earn BOMB every epoch</p>
                    <p className={styles.boardroomTVL}>
                      TVL: <span className={styles.boardroomTVLValue}>${boardroomTVL.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.boardRoomTotalStake}>
                <p>
                  Total Staked:
                  <span>
                    <img src="./bshare-512.png" alt="" />
                    {boardRoomTotalStaked.toString()}
                  </span>
                </p>
              </div>
              <div className={styles.paddingAdder}>
                <DataGrid
                  dailyReturns={boardroomDailyAPR.toFixed(2)}
                  yourStakeval={boardRoomMyStake.toString()}
                  yourStakevalDlr={mydlrstake.toFixed(2)}
                  earned={boardRoomEarn.toString()}
                  earnedDlr={mydlrearn.toFixed(2)}
                  isBoardFarms={false}
                  onc1={onReward}
                  onc2={onReward}
                  onc3={onReward}
                />
              </div>
            </div>
          </div>
          <div className={styles.newsSection}>
            <p className={styles.newsTitle}>Latest News</p>
          </div>
        </div>
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
            <ContentHeader src="./bsharebnblp1@2x.png" header="BOMB-BTCB" TVL="rand" />
            <DataGrid
              dailyReturns="2%"
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
            <ContentHeader src="./bomb-bitcoin-LP.png" header="BSHARE-BNB" TVL="rand" />
            <DataGrid
              dailyReturns="2%"
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
        <div className={styles.bonds}>
          <div className={styles.paddingAdder}>
            <div className={styles.bondsHeader}>
              <span className={styles.bondsLogo}>
                <img src="./bbonds.png" alt="" />
              </span>
              <div className={styles.bondsHeaderChild}>
                <p className={styles.bondsTitle}>Bonds</p>
                <p className={styles.bondsDetails}>
                  BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
                </p>
              </div>
            </div>
            <div className={styles.bondContent}>
              <div className={styles.bombCur}>
                <span className={styles.bombPrice}>Current Price: (Bomb)^2</span>
                <span className={styles.bombVl}>
                  BBond = <span>{Number(bondStat?.tokenInFtm).toFixed(4) || '-'} BTCB</span>
                </span>
              </div>
              <div className={styles.bombRedeem}>
                <span className={styles.bombRedeemTitle}>Available to {isBondRedeemable ? 'Redeem' : 'Purchase'}:</span>
                <span className={styles.bombRedeemVl}>
                  <img src="./bbonds.png" alt="" />
                  <span>
                    {isBondRedeemable ? getDisplayBalance(bondBalance) : getDisplayBalance(bondsPurchasable, 18, 4)}
                  </span>
                </span>
              </div>
              <div className={styles.BombPurchaseandRedeem}>
                <span className={styles.bombPurchaseOption}>
                  <span style={{ opacity: isBondRedeemable ? 0.5 : 1 }}>
                    <p>Purchase BBond</p>
                    {isBondRedeemable ? <p className={styles.msgPr}>Bomb is over peg</p> : null}
                  </span>
                  {/* <BondTest
                    action="Purchase"
                    fromToken={bombFinance.BOMB}
                    fromTokenName="BOMB"
                    toToken={bombFinance.BBOND}
                    toTokenName="BBOND"
                    priceDesc={
                      !isBondPurchasable
                        ? 'BOMB is over peg'
                        : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
                    }
                    onExchange={handleBuyBonds}
                    disabled={!bondStat || isBondRedeemable}
                  /> */}
                  <BondButtons
                    action="Purchase"
                    fromToken={bombFinance.BOMB}
                    fromTokenName="BOMB"
                    onExchange={handleBuyBonds}
                    priceDesc={
                      !isBondPurchasable
                        ? 'BOMB is over peg'
                        : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
                    }
                    propWidth="20%"
                    src="./shop.svg"
                    disabled={!bondStat || isBondRedeemable}
                  />
                  {/* <FuncButton header="Purchase" propWidth="20%" src="./shop.svg" onc={onReward} /> */}
                </span>
                <hr />
                <span className={styles.bombRedeemOption}>
                  <span style={{ opacity: !isBondRedeemable ? 0.5 : 1 }}>
                    <p>Redeem BBond</p>
                    {!isBondRedeemable ? <p className={styles.msgPr}>Bomb is below peg</p> : null}
                  </span>

                  {/* <BondTest
                    action="Redeem"
                    fromToken={bombFinance.BBOND}
                    fromTokenName="BBOND"
                    toToken={bombFinance.BOMB}
                    toTokenName="BOMB"
                    priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                    onExchange={handleRedeemBonds}
                    disabled={false}
                    disabledDescription={
                      !isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null
                    }
                  /> */}
                  <BondButtons
                    action="Redeem"
                    fromToken={bombFinance.BBOND}
                    fromTokenName="BBOND"
                    onExchange={handleRedeemBonds}
                    priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                    propWidth="20%"
                    src="./down.svg"
                    disabled={!isBondRedeemable}
                    disabledDescription={!isBondRedeemable ? `Bomb is below peg` : null}
                  />
                  {/* <FuncButton header="Redeem" propWidth="20%" src="./down.svg" onc={onReward} /> */}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
    // </Switch>
  );
};

export default Dashboard;
