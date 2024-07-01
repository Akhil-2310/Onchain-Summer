import { watchAccount, disconnect, getAccount } from '@wagmi/core'

import { createWeb3Modal } from '@web3modal/wagmi'

import { reconnect, http, createConfig } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors'

// 1. Get a project ID at https://cloud.walletconnect.com
const projectId = Meteor.settings.public.WALLETCONNECT_PROJECT_ID

const metadata = {
  name: 'Airdroppify',
  description: 'Connect for airdrops!',
  url: 'https://web3modal.com', // url must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const walletConnectConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ]
})
reconnect(walletConnectConfig)

const walletConnectModal = createWeb3Modal({
  wagmiConfig: walletConnectConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export {
    walletConnectModal,
    walletConnectConfig,
    watchAccount, disconnect, getAccount,
}