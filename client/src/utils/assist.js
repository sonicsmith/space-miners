import assist from "bnc-assist"

import { NETWORK_ID, ASSIST_DAPP_ID } from "../config"

let assistInstance

// Assist methods
export const initializeAssist = web3 => getAssist(web3) // Call this function as soon as web3 is initialized
export const onboardUser = () => getAssist().onboard()
export const decorateContract = contract => getAssist().Contract(contract)
export const decorateTransaction = txObject => getAssist().Transaction(txObject)
export const getUserState = () => getAssist().getState()

// Returns initialized assist object if previously initialized.
// Otherwise will initialize assist with the config object
export function getAssist(web3) {
  if (!assistInstance) {
    assistInstance = assist.init({
      dappId: ASSIST_DAPP_ID,
      networkId: NETWORK_ID,
      mobileBlocked: false,
      web3,
      style: {
        darkMode: true,
        notificationsPosition: { desktop: "topRight", mobile: "top" },
        css: `
          .bn-onboard-modal { border-radius: 10px; box-shadow: -3px 3px 15px #71A9BA; }
          .bn-onboard-basic .bn-onboard-sidebar { border-radius: 10px; }
          .bn-onboard-basic .bn-onboard-main { border-radius: 10px; }
          .h4 { color: #FFF; text-shadow: -2px 2px 3px #71A9BA; }
          .bn-notification { border-radius: 5px; box-shadow: -3px 3px 15px #71A9BA; }
        `
      },

      messages: {
        txRequest: () => "Waiting for you to confirm the action",
        txStall: ({ contract }) =>
          contract.methodName === "sendMinersToPlanet"
            ? `The miners are taking longer to get to the planet than expected...`
            : `Selling Kerium is taking longer than expected...`,
        txSent: ({ contract }) =>
          contract.methodName === "sendMinersToPlanet"
            ? "Preparing your miners"
            : "Putting in a request to sell your Kerium",
        txPending: ({ contract }) =>
          contract.methodName === "sendMinersToPlanet"
            ? "Your miners are on their way!"
            : "Selling your Kerium",
        txConfirmed: ({ contract }) =>
          contract.methodName === "sendMinersToPlanet"
            ? "Your miners have arrived on the planet!"
            : "Your Kerium sold!",
        txFailed: ({ contract }) =>
          contract.methodName === "sendMinersToPlanet"
            ? "Something went wrong while deploying your miners"
            : "Something went wrong while selling your Kerium"
      }
    })
  }

  return assistInstance
}
