import React from 'react';
import { Bank } from '../../../bomb-finance';
import useStatsForPool from '../../../hooks/useStatsForPool';
import styles from '../Dashboard.module.css';
import ContentHeader from './ContentHeader';
import DataGrid from './DataGrid';
import useModal from '../../../hooks/useModal';
import DepositModal from '../../Bank/components/DepositModal';
import WithdrawModal from '../../Bank/components/WithdrawModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useStake from '../../../hooks/useStake';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useWithdraw from '../../../hooks/useWithdraw';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import { useMemo } from 'react';
import useEarnings from '../../../hooks/useEarnings';
import useHarvest from '../../../hooks/useHarvest';

interface Prop {
  bank: Bank;
  src: string;
}

const BombFarmCardUtil: React.FC<Prop> = ({ bank, src }) => {
  const { onReward } = useHarvest(bank);
  let statsOnPool = useStatsForPool(bank);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const { onStake } = useStake(bank);
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const { onWithdraw } = useWithdraw(bank);
  const stakedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <div className={styles.paddingAdder}>
      <ContentHeader src={src} header={bank.depositTokenName} TVL={statsOnPool?.TVL} />
      <DataGrid
        dailyReturns={bank.closedForStaking ? '0.00' : statsOnPool?.dailyAPR}
        yourStakeval={getDisplayBalance(stakedBalance, bank.depositToken.decimal)}
        yourStakevalDlr={`$${stakedInDollars}`}
        earned={getDisplayBalance(earnings)}
        earnedDlr={`$${earnedInDollars}`}
        isBoardFarms={true}
        onc1={bank.closedForStaking ? null : onPresentDeposit}
        onc2={onPresentWithdraw}
        onc3={onReward}
        disable1={bank.closedForStaking}
        disable3={earnings.eq(0)}
      />
    </div>
  );
};
export default BombFarmCardUtil;
