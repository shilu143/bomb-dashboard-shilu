import React from 'react';
import { useMemo, useCallback } from 'react';
import styles from '../Dashboard.module.css';
import useBondStats from '../../../hooks/useBondStats';

import useCashPriceInLastTWAP from '../../../hooks/useCashPriceInLastTWAP';
import { BOND_REDEEM_PRICE_BN } from '../../../bomb-finance/constants';
import { getDisplayBalance } from '../../../utils/formatBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useBondsPurchasable from '../../../hooks/useBondsPurchasable';
import useBombFinance from '../../../hooks/useBombFinance';
import BondButtons from './BondButtons';
import { useTransactionAdder } from '../../../state/transactions/hooks';

const BondCard: React.FC = () => {
  const bombFinance = useBombFinance();

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

  return (
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
                disabled={isBondRedeemable}
              />
            </span>
            <hr />
            <span className={styles.bombRedeemOption}>
              <span style={{ opacity: !isBondRedeemable ? 0.5 : 1 }}>
                <p>Redeem BBond</p>
                {!isBondRedeemable ? <p className={styles.msgPr}>Bomb is below peg</p> : null}
              </span>
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
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondCard;
