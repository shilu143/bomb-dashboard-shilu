import React from 'react';
import { useMemo } from 'react';
import styles from '../Dashboard.module.css';
import useShareStats from '../../../hooks/usebShareStats';
import useModal from '../../../hooks/useModal';

import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useBombFinance from '../../../hooks/useBombFinance';
import DataGrid from './DataGrid';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useTotalStakedOnBoardroom from '../../../hooks/useTotalStakedOnBoardroom';
import useFetchBoardRoomTVL from '../../../hooks/fetchBoardRoomTVL';
import useFetchBoardroomAPR from '../../../hooks/useFetchBoardroomAPR';
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import DepositModal from '../../Boardroom/components/DepositModal';
import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import WithdrawModal from '../../Boardroom/components/WithdrawModal';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../../hooks/boardroom/useWithdrawCheck';

const BoardRoomCard: React.FC = () => {
  const bombFinance = useBombFinance();
  const bShareStats = useShareStats();
  const boardRoomTotalStaked = useTotalStakedOnBoardroom();
  const boardroomTVL = useFetchBoardRoomTVL();
  const boardroomDailyAPR = useFetchBoardroomAPR() / 365;
  const boardRoomMyStake = useStakedBalanceOnBoardroom();
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const mydlrstake = Number(boardRoomMyStake) * Number(bSharePriceInDollars);
  const boardRoomEarn = useEarningsOnBoardroom();
  const stakedTokenPriceInDollarsBoard = useStakedTokenPriceInDollars('BSHARE', bombFinance.BSHARE);
  const stakedBalanceBoard = useStakedBalanceOnBoardroom();
  const tokenPriceInDollarsBoard = useMemo(
    () =>
      stakedTokenPriceInDollarsBoard
        ? (Number(stakedTokenPriceInDollarsBoard) * Number(getDisplayBalance(stakedBalanceBoard))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollarsBoard, stakedBalanceBoard],
  );
  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();
  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const stakedBalance = useStakedBalanceOnBoardroom();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );
  const { onReward } = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();
  const canWithdrawFromBoardroom = useWithdrawCheck();

  return (
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
            {getDisplayBalance(boardRoomTotalStaked)}
          </span>
        </p>
      </div>
      <div className={styles.paddingAdder}>
        <DataGrid
          dailyReturns={boardroomDailyAPR.toFixed(2)}
          yourStakeval={boardRoomMyStake.toString()}
          yourStakevalDlr={mydlrstake.toFixed(2)}
          earned={boardRoomEarn.toString()}
          earnedDlr={tokenPriceInDollarsBoard}
          isBoardFarms={false}
          onc1={onPresentDeposit}
          onc2={onPresentWithdraw}
          onc3={onReward}
          disable2={!canWithdrawFromBoardroom}
          disable3={earnings.eq(0) || !canClaimReward}
        />
      </div>
    </div>
  );
};

export default BoardRoomCard;
