import React from 'react';
import styles from './FuncButton.module.css';
import { useWallet } from 'use-wallet';
import useTokenBalance from '../../../hooks/useTokenBalance';
import ERC20 from '../../../bomb-finance/ERC20';
import useModal from '../../../hooks/useModal';
import ExchangeModal from '../../Bond/components/ExchangeModal';
import UnlockWallet from '../../../components/UnlockWallet';

interface Prop {
  action: string;
  src: string;
  propWidth: string;
  fromToken: ERC20;
  priceDesc: string;
  onExchange: (amount: string) => void;
  fromTokenName: string;
  disabled?: boolean;
  disabledDescription?: string;
}

const BondButtons: React.FunctionComponent<Prop> = ({
  action,
  src,
  propWidth,
  fromToken,
  priceDesc,
  onExchange,
  fromTokenName,
  disabled = false,
  disabledDescription,
}) => {
  // const {
  //   contracts: { Treasury },
  // } = useBombFinance();
  //   const [approveStatus, approve] = useApprove(fromToken, Treasury.address);

  const { account } = useWallet();
  const balance = useTokenBalance(fromToken);
  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={action}
      description={priceDesc}
      max={balance}
      onConfirm={(value) => {
        onExchange(value);
        onDismiss();
      }}
      action={action}
      tokenName={fromTokenName}
    />,
  );

  return (
    <>
      {!!account ? (
        <>
          <button className={styles.funcButton} style={{ width: propWidth }} onClick={onPresent} disabled={disabled}>
            <span className={styles.buttonHeader}>{action}</span>
            <span className={styles.buttonIcon}>
              <img src={src} alt="" />
            </span>
          </button>
        </>
      ) : (
        <UnlockWallet />
      )}
    </>
  );
};

export default BondButtons;
