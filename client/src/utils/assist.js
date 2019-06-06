import assist from 'bnc-assist'

import { NETWORK_ID, ASSIST_DAPP_ID } from "../config"

let assistInstance;

// Assist methods
export const initializeAssist = (web3) => getAssist(web3); // Call this function as soon as web3 is initialized
export const onboardUser = () => getAssist().onboard();
export const decorateContract = contract => getAssist().Contract(contract);
export const decorateTransaction = txObject => getAssist().Transaction(txObject);
export const getUserState = () => getAssist().getState();

// Returns initialized assist object if previously initialized.
// Otherwise will initialize assist with the config object
export function getAssist(web3) {
  if (!assistInstance) {
    assistInstance = assist.init(
      {
        dappId: ASSIST_DAPP_ID,
        networkId: NETWORK_ID,
        web3,
        style: { darkMode: true },
        messages: {
          txRequest: () => 'Waiting for you to confirm the action',
          txStall: ({contract}) => 
            contract.methodName === 'sendMinersToPlanet'
              ? `Sending the miners is taking longer than expected...`
              : `Selling Kerium is taking longer than expected...`,
          txSent: ({contract}) => 
            contract.methodName === 'sendMinersToPlanet'
              ? 'Preparing your miners'
              : 'Putting in a request to sell your Kerium',
          txPending: ({contract}) => 
            contract.methodName === 'sendMinersToPlanet' 
              ? 'The miners are on their way!'
              : 'Selling your Kerium',
          txConfirmed: ({contract}) => 
            contract.methodName === 'sendMinersToPlanet' 
              ? 'Miners deployed!'
              : 'Your Kerium sold!',
          txFailed: ({contract}) => 
            contract.methodName === 'sendMinersToPlanet' 
              ? 'Something went wrong while deploying your miners'
              : 'Something went wrong while selling your Kerium',
        }
      }
    )
  }
  
  return assistInstance
}
