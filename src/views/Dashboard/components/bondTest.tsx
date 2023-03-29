import React from 'react';
import styled from 'styled-components';

import { Button, Card } from '@material-ui/core';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import useBombFinance from '../../../hooks/useBombFinance';
import Label from '../../../components/Label';
import TokenSymbol from '../../../components/TokenSymbol';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import useModal from '../../../hooks/useModal';
import ExchangeModal from '../../Bond/components/ExchangeModal';
import ERC20 from '../../../bomb-finance/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';
import { useWallet } from 'use-wallet';
import UnlockWallet from '../../../components/UnlockWallet';



interface ExchangeCardProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
}

const BondTest: React.FC<ExchangeCardProps> = ({
  action,
  fromToken,
  fromTokenName,
  toToken,
  toTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
}) => {
  const catchError = useCatchError();
  const {
    contracts: { Treasury },
  } = useBombFinance();
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
          <Button className={disabled ? 'shinyButtonDisabled' : 'shinyButton'} onClick={onPresent} disabled={disabled}>
            {action}
          </Button>
        </>
      ) : (
        <UnlockWallet />
      )}
    </>
  );
};

export default BondTest;
