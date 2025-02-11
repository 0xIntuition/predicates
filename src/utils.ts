import { Multivault } from '@0xintuition/protocol'
import {
  Address,
  createPublicClient,
  createWalletClient,
  extractChain,
  http,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { mainnet, base, baseSepolia, linea, lineaSepolia } from 'viem/chains'
import { createServerClient } from '@0xintuition/graphql'
const client = createServerClient({})

export function getMultivault(contractAddress: Address, chainId: number) {

  if (!process.env.SEED_PHRASE) {
    throw new Error('SEED_PHRASE is required')
  }

  const chain = extractChain({
    chains: [mainnet, base, baseSepolia, linea, lineaSepolia],
    id: chainId as any,
  })

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  })

  const account = mnemonicToAccount(
    process.env.SEED_PHRASE,
    { accountIndex: 0 }
  )

  const walletClient = createWalletClient({
    chain,
    transport: http(),
    account,
  })

  const multivault = new Multivault({
    //@ts-ignore
    publicClient,
    //@ts-ignore
    walletClient,
  }, contractAddress)

  return multivault
}

export async function getOrCreateAtom(multivault: Multivault, uri: string, initialDeposit?: bigint) {
  const atomId = await multivault.getVaultIdFromUri(uri)
  if (atomId) {
    console.log(`Atom already exists: ${uri}`)
    return atomId
  } else {
    console.log(`Creating atom: ${uri}`)
    const { vaultId } = await multivault.createAtom({ uri, initialDeposit })
    return vaultId
  }
}

export async function pinThing(thing: { name: string, description: string, image: string, url: string }) {
  const result: any = await client.request(`
mutation PinThing($thing: PinThingInput!) {
  pinThing(thing: $thing) {
    uri
  }
}`, { thing })
  return result.pinThing.uri as string
}
