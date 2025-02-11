
import dotenv from 'dotenv'
import { getMultivault, getOrCreateAtom, pinThing } from './utils'
import { isAddress, formatEther } from 'viem'
import { mnemonicToAccount } from 'viem/accounts';
dotenv.config()

async function main() {
  if (!process.env.CONTRACT_ADDRESS || !isAddress(process.env.CONTRACT_ADDRESS)) {
    throw new Error('CONTRACT_ADDRESS is required')
  }
  if (!process.env.CHAIN_ID) {
    throw new Error('CHAIN_ID is required')
  }
  if (!process.env.SEED_PHRASE) {
    throw new Error('SEED_PHRASE is required')
  }
  const multivault = getMultivault(process.env.CONTRACT_ADDRESS, parseInt(process.env.CHAIN_ID))

  const account = mnemonicToAccount(
    process.env.SEED_PHRASE,
    { accountIndex: 0 }
  )
  const address = account.address

  console.log(`Contract address: ${process.env.CONTRACT_ADDRESS}`)
  console.log(`Chain ID: ${process.env.CHAIN_ID}`)

  const config = await multivault.getGeneralConfig()
  console.log(`Min deposit: ${formatEther(config.minDeposit)} ETH`)

  await getOrCreateAtom(
    multivault,
    address,
    config.minDeposit
  )
  await getOrCreateAtom(
    multivault,
    'https://schema.org/Thing',
    config.minDeposit
  )
  await getOrCreateAtom(
    multivault,
    'https://schema.org/FollowAction',
    config.minDeposit
  )
  await getOrCreateAtom(
    multivault,
    'https://schema.org/keywords',
    config.minDeposit
  )
  await getOrCreateAtom(
    multivault,
    'https://schema.org/Person',
    config.minDeposit
  )
  await getOrCreateAtom(
    multivault,
    'https://schema.org/Organization',
    config.minDeposit
  )

  await getOrCreateAtom(
    multivault,
    await pinThing({
      name: "I",
      description: 'A first-person singular pronoun used by a speaker to refer to themselves. For example, "I am studying for a test". "I" can also be used to refer to the narrator of a first-person singular literary work.',
      image: "",
      url: ""
    }),
    config.minDeposit
  )

  await getOrCreateAtom(
    multivault,
    await pinThing({
      name: "Ethereum",
      description: 'Ethereum is the main platform for thousands of apps and blockchains, all powered by the Ethereum protocol.',
      image: "https://gateway.pinata.cloud/ipfs/bafkreicxk7flizyv3svhvlahvfucsfo2lh2nmjwzcwnpeyptmb7xc2sfdy",
      url: "https://ethereum.org/en/"
    }),
    config.minDeposit
  )

  await getOrCreateAtom(
    multivault,
    await pinThing({
      name: "has value",
      description: 'Expresses a relationship where an entity possesses worth, significance, or utility due to specific attributes or qualities. It indicates that the subject derives importance, usefulness, or benefit from the associated object.',
      image: "",
      url: ""
    }),
    config.minDeposit
  )


}

main()
  .catch(console.error)
  .finally(() => console.log('done'))
