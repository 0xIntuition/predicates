
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

  const earth = await getOrCreateAtom(
    multivault,
    await pinThing({
      name: "Earth",
      description: 'The third planet from the Sun and the only astronomical object known to harbor life.',
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/580px-The_Earth_seen_from_Apollo_17.jpg",
      url: "https://en.wikipedia.org/wiki/Earth"
    }),
    config.minDeposit
  )

  const is = await getOrCreateAtom(
    multivault,
    await pinThing({
      name: "is",
      description: '',
      image: "",
      url: ""
    }),
    config.minDeposit
  )

  const round = await getOrCreateAtom(
    multivault,
    await pinThing({
      name: "Round",
      description: 'A two-dimensional geometric shape that has a circular or oval form.',
      image: "",
      url: ""
    }),
    config.minDeposit
  )

  const triple = await multivault.createTriple({
    subjectId: earth,
    predicateId: is,
    objectId: round
  }
  )

  console.log(`Triple created: ${triple.vaultId}`)

  await multivault.depositTriple(triple.vaultId, config.minDeposit)

  console.log(`Triple deposited: ${triple.vaultId}`)

  await multivault.redeemTriple(triple.vaultId, config.minDeposit / 2n)

  console.log(`Triple redeemed: ${triple.vaultId}`)
}

main()
  .catch(console.error)
  .finally(() => console.log('done'))
