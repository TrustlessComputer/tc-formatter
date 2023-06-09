import { IHumanAmount, IReplaceDecimals } from '@/types/amount';
import { getDecimalSeparator } from '@/lib/amount/separator';
import { BigNumber } from 'bignumber.js';
import { toFixed } from '@/lib/amount/format';

const checkAmount = (amount: number) => {
  if (!Number.isFinite(amount))
    throw new Error('Can not format invalid amount');
};

const replaceDecimals = ({ text, autoCorrect = false }: IReplaceDecimals) => {
  let result = text;
  const decimalSeparator = getDecimalSeparator();
  if (
    decimalSeparator === ',' &&
    !result?.includes?.('e+') &&
    !result?.includes?.('e-')
  ) {
    result = result.replace(/\./g, '_');
    result = result.replace(/,/g, '.');
    result = result.replace(/_/g, ',');
  }
  if (autoCorrect) {
    result = result.replace(/,/g, '');
  }
  return result;
};

const toHumanAmount = (payload: IHumanAmount) => {
  const { originalAmount = 0, decimals } = payload;
  const amount = new BigNumber(originalAmount);
  if (amount.isNaN()) {
    return 0;
  }
  const indexNumber = new BigNumber(10).pow(decimals);
  return amount.dividedBy(indexNumber).toNumber();
};

const toHumanAmountString = (payload: IHumanAmount) => {
  return toFixed({
    number: toHumanAmount({
      originalAmount: payload.originalAmount || 0,
      decimals: payload.decimals,
    }),
    decimals: payload.decimals,
  });
};

const toOriginalAmount = ({
  humanAmount,
  decimals,
  round = true,
}: {
  humanAmount: string;
  decimals: number;
  round?: boolean;
}) => {
  let amount = 0;
  try {
    const amountRepDecimals = replaceDecimals({
      text: humanAmount,
    });
    const bnAmount = new BigNumber(amountRepDecimals);
    if (bnAmount.isNaN()) {
      return 0;
    }
    const indexNumber = new BigNumber(10).pow(decimals || 0).toNumber();
    amount = bnAmount.multipliedBy(new BigNumber(indexNumber)).toNumber();
    if (round) {
      amount = Math.floor(amount);
    }
  } catch (error) {
    amount = 0;
    throw error;
  }
  return amount;
};

const toNumber = ({
  text,
  autoCorrect = true,
}: {
  text: string;
  autoCorrect?: boolean;
}) => {
  const number = replaceDecimals({
    text,
    autoCorrect,
  });
  return new BigNumber(number).toNumber();
};

const toString = ({
  text,
  autoCorrect = true,
}: {
  text: string;
  autoCorrect?: boolean;
}) => {
  const number = replaceDecimals({
    text,
    autoCorrect,
  });
  return new BigNumber(number).toString();
};

export {
  checkAmount,
  replaceDecimals,
  toHumanAmount,
  toHumanAmountString,
  toOriginalAmount,
  toNumber,
  toString,
};
