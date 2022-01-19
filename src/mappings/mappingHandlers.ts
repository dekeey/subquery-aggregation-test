import { SubstrateEvent } from '@subql/types'
import { StakingReward, SumReward } from '../types'
import { Balance } from '@polkadot/types/interfaces'

function createSumReward(accountId: string): SumReward {
    const entity = new SumReward(accountId)
    entity.totalReward = BigInt(0)
    return entity
}
export async function handleSumRewarded({
    block,
    event: {
        data: [account, newReward],
    },
}: SubstrateEvent): Promise<void> {
    let entity = await SumReward.get(account.toString())
    if (entity === undefined) {
        entity = createSumReward(account.toString())
    }
    entity.totalReward = entity.totalReward + (newReward as Balance).toBigInt()
    entity.blockheight = block.block.header.number.toNumber()
    await entity.save()
}

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
