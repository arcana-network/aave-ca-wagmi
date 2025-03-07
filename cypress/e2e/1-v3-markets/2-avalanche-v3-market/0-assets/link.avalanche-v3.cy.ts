import assets from '../../../../fixtures/assets.json';
import constants from '../../../../fixtures/constans.json';
import { skipState } from '../../../../support/steps/common';
import { configEnvWithTenderlyAvalancheFork } from '../../../../support/steps/configuration.steps';
import { borrow, repay, supply, withdraw } from '../../../../support/steps/main.steps';
import { dashboardAssetValuesVerification } from '../../../../support/steps/verification.steps';
import { RequestedTokens, tokenSet } from '../../../4-gho-ethereum/helpers/token.helper';

const tokensToRequest: RequestedTokens = {
  aAVAXAvalancheV3: 9000,
};

const testData = {
  testCases: {
    borrow: [
      {
        asset: assets.avalancheV3Market.LINK,
        amount: 50,
        apyType: constants.borrowAPYType.default,
        hasApproval: true,
      },
    ],
    deposit: {
      asset: assets.avalancheV3Market.LINK,
      amount: 10.1,
      hasApproval: false,
    },
    checkDisabledApy: {
      asset: assets.avalancheV3Market.LINK,
      apyType: constants.apyType.variable,
    },
    repay: [
      {
        asset: assets.avalancheV3Market.LINK,
        apyType: constants.apyType.variable,
        amount: 2,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
      {
        asset: assets.avalancheV3Market.LINK,
        apyType: constants.apyType.variable,
        repayableAsset: assets.avalancheV3Market.aLINK,
        amount: 2,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
    ],
    withdraw: {
      asset: assets.avalancheV3Market.LINK,
      isCollateral: true,
      amount: 1,
      hasApproval: true,
    },
  },
  verifications: {
    finalDashboard: [
      {
        type: constants.dashboardTypes.deposit,
        assetName: assets.avalancheV3Market.LINK.shortName,
        amount: 7.0,
        collateralType: constants.collateralType.isCollateral,
        isCollateral: true,
      },
      {
        type: constants.dashboardTypes.borrow,
        assetName: assets.avalancheV3Market.LINK.shortName,
        amount: 46.0,
        apyType: constants.borrowAPYType.variable,
      },
    ],
  },
};

describe('LINK INTEGRATION SPEC, AVALANCHE V3 MARKET', () => {
  const skipTestState = skipState(false);
  configEnvWithTenderlyAvalancheFork({
    market: 'fork_proto_avalanche_v3',
    v3: true,
    tokens: tokenSet(tokensToRequest),
  });
  testData.testCases.borrow.forEach((borrowCase) => {
    borrow(borrowCase, skipTestState, true);
  });
  supply(testData.testCases.deposit, skipTestState, true);
  testData.testCases.repay.forEach((repayCase) => {
    repay(repayCase, skipTestState, false);
  });
  withdraw(testData.testCases.withdraw, skipTestState, false);
  dashboardAssetValuesVerification(testData.verifications.finalDashboard, skipTestState);
});
