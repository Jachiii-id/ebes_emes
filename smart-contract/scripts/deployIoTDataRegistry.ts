import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { IoTDataRegistry } from '../build/IoTDataRegistry/IotDataRegistry_IoTDataRegistry';

export async function run(provider: NetworkProvider) {
    const iotDataRegistry = provider.open(
        await IoTDataRegistry.fromInit(provider.sender().address!)
    );

    await iotDataRegistry.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(iotDataRegistry.address);

    console.log('Contract deployed at:', iotDataRegistry.address.toString());
}
