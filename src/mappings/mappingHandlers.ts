import { SubstrateEvent } from '@subql/types'
import { StakingReward } from '../types'
import { Balance } from '@polkadot/types/interfaces'

export async function handleStakingRewarded({
    idx,
    block,
    event: {
        data: [account, newReward],
    },
}: SubstrateEvent): Promise<void> {
    const entity = new StakingReward(
        `${block.block.header.number}-${idx.toString()}`
    )
    entity.account = account.toString()
    entity.balance = (newReward as Balance).toBigInt()
    entity.date = block.timestamp
    entity.blockHeight = block.block.header.number.toNumber()
    await entity.save()
}
