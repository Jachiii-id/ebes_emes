# EMES-EBES: IoT Data Registry on TON Blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TON](https://img.shields.io/badge/Built%20on-TON-blue)](https://ton.org/)

A decentralized IoT data registry smart contract built on The Open Network (TON) blockchain, designed for storing and retrieving GPS and air quality sensor data from IoT devices in a trustless, immutable manner.

## 🎯 Problem & Solution

### Problem

Traditional IoT data storage systems face several challenges:
- **Centralization**: Data stored in centralized databases can be manipulated or lost
- **Trust Issues**: No verifiable proof of data authenticity and integrity
- **Single Point of Failure**: Centralized systems are vulnerable to downtime and attacks
- **Lack of Transparency**: Data consumers cannot verify the origin and authenticity of sensor readings
- **High Costs**: Maintaining centralized infrastructure for large-scale IoT deployments is expensive

### Solution

EMES-EBES leverages blockchain technology to provide:
- **Decentralized Storage**: Data stored on TON blockchain is immutable and distributed
- **Trustless Verification**: Anyone can verify data authenticity without trusting a central authority
- **High Availability**: Blockchain network ensures 99.9% uptime
- **Transparency**: All data is publicly verifiable on-chain
- **Cost Efficiency**: TON's low transaction fees make it ideal for IoT data storage
- **DePIN Integration**: Supports decentralized physical infrastructure networks (DePIN) for device management

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  IoT Devices    │
│  (Sensors)      │
└────────┬────────┘
         │
         │ MQTT/HTTP
         ▼
┌─────────────────┐
│  NestJS Backend │
│  (Data Gateway)  │
└────────┬────────┘
         │
         │ TON Messages
         ▼
┌─────────────────┐
│  TON Blockchain  │
│  (IoTDataRegistry│
│   Smart Contract)│
└─────────────────┘
         │
         │ Query
         ▼
┌─────────────────┐
│  Next.js Frontend│
│  (Dashboard)     │
└─────────────────┘
```

### Smart Contract Structure

The `IoTDataRegistry` contract provides:

1. **Data Storage**:
   - GPS data records (latitude, longitude, speed, satellites)
   - Air quality data records (PPM, status, RO value)
   - Automatic timestamp generation

2. **Data Retrieval**:
   - Get records by ID
   - Get latest reading per device
   - Get total record counts
   - Get all records (with pagination support)

3. **Device Tracking**:
   - Latest GPS reading per device
   - Latest air quality reading per device
   - Device-specific data queries

## 🛠️ Technology Stack

### Core Technologies
- **Tact Language**: High-level smart contract language for TON
- **TON Blockchain**: Fast, scalable blockchain with low fees
- **TypeScript**: Type-safe contract wrappers
- **Jest**: Testing framework

### Development Tools
- **Blueprint**: TON development framework
- **@ton/blueprint**: Contract development toolkit
- **@ton/sandbox**: Local blockchain testing
- **@ton/test-utils**: Testing utilities

### Dependencies
- `@ton/core`: Core TON library
- `@ton/ton`: TON client library
- `@ton/crypto`: Cryptographic utilities
- `@tact-lang/compiler`: Tact compiler

## 🌐 PinGo/DePIN Integration

### What is DePIN?

DePIN (Decentralized Physical Infrastructure Networks) refers to networks that use blockchain technology to coordinate and incentivize the deployment and operation of physical infrastructure, such as IoT sensors, wireless networks, and computing resources.

### How EMES-EBES Integrates with DePIN

1. **Device Registration**: IoT devices can be registered on-chain with unique identifiers
2. **Data Provenance**: Each sensor reading is cryptographically linked to its device
3. **Incentivization**: Device operators can be rewarded for providing accurate data
4. **Network Coordination**: Multiple devices can coordinate through the blockchain
5. **Trustless Verification**: Anyone can verify data authenticity without trusting intermediaries

### PinGo Integration

PinGo is a DePIN platform that enables:
- **Device Management**: Register and manage IoT devices
- **Data Aggregation**: Collect data from multiple devices
- **Reward Distribution**: Automatically reward device operators
- **Network Effects**: Scale infrastructure through decentralized participation

EMES-EBES serves as the data layer for PinGo, providing immutable storage and verification of IoT sensor data.

## 🚀 Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **TON Wallet**: For deploying contracts (testnet or mainnet)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd emes-ebes
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the contract**:
   ```bash
   npm run build
   # or
   yarn build
   ```

### Environment Configuration

Create a `.env` file in the project root (see `.env.example`):

```env
# TON Network Configuration
TON_NETWORK=testnet  # or 'mainnet'
TON_CONTRACT_ADDRESS=your_contract_address_here

# Wallet Configuration (for deployment)
TON_MNEMONIC=your_wallet_mnemonic_phrase_here
```

## 📖 Usage Guide

### Building the Contract

```bash
npm run build
```

This compiles the Tact contract and generates TypeScript bindings in the `build/` directory.

### Running Tests

```bash
npm test
```

Run all contract tests using Jest and TON Sandbox.

### Deploying the Contract

1. **Configure your wallet**:
   - Set `TON_MNEMONIC` in `.env`
   - Ensure your wallet has sufficient TON for deployment

2. **Deploy to testnet**:
   ```bash
   npm run start
   # Select: deployIoTDataRegistry
   ```

3. **Deploy to mainnet**:
   ```bash
   TON_NETWORK=mainnet npm run start
   ```

### Contract Interaction

#### Recording GPS Data

```typescript
import { IoTDataRegistry, RecordGpsData } from './build/IoTDataRegistry/IotDataRegistry_IoTDataRegistry';

const contract = client.open(IoTDataRegistry.fromAddress(contractAddress));

await contract.send(sender, {
    value: toNano('0.05'),
}, {
    $$type: 'RecordGpsData',
    deviceId: 1n,
    companyId: 100n,
    lat: '40.7128',
    lng: '-74.0060',
    speed: '25',
    sats: '8',
});
```

#### Recording Air Quality Data

```typescript
await contract.send(sender, {
    value: toNano('0.05'),
}, {
    $$type: 'RecordAirData',
    deviceId: 1n,
    companyId: 100n,
    ppm: '350',
    status: 'safe',
    ro: '15.2',
});
```

#### Querying Data

```typescript
// Get latest GPS data for a device
const latestGps = await contract.getGetLatestGps(1n);

// Get latest air quality data for a device
const latestAir = await contract.getGetLatestAir(1n);

// Get specific record by ID
const gpsRecord = await contract.getGetGpsData(1n);
const airRecord = await contract.getGetAirData(1n);

// Get total record counts
const totalGps = await contract.getGetTotalGpsRecords();
const totalAir = await contract.getGetTotalAirRecords();
```

## 🧪 Testing

### Test Structure

Tests are located in `tests/IoTDataRegistry.spec.ts` and cover:
- Contract deployment
- GPS data recording and retrieval
- Air quality data recording and retrieval
- Multi-device tracking
- Edge cases and error handling

## 🚢 Deployment

### Testnet Deployment

1. Get testnet TON from [TON Faucet](https://t.me/testgiver_ton_bot)
2. Set `TON_NETWORK=testnet` in `.env`
3. Run deployment script:
   ```bash
   npm run start
   ```

### Mainnet Deployment

1. Ensure you have sufficient TON for deployment (~0.1 TON)
2. Set `TON_NETWORK=mainnet` in `.env`
3. Run deployment script:
   ```bash
   TON_NETWORK=mainnet npm run start
   ```

### Post-Deployment

After deployment, update your backend configuration with the contract address:
```env
TON_CONTRACT_ADDRESS=EQD...your_contract_address
```

## 📁 Project Structure

```
emes-ebes/
├── contracts/              # Tact smart contract source code
│   └── IoTDataRegistry.tact
├── build/                  # Compiled contract and TypeScript bindings
│   └── IoTDataRegistry/
├── tests/                  # Contract tests
│   └── IoTDataRegistry.spec.ts
├── scripts/                # Deployment and utility scripts
│   └── deployIoTDataRegistry.ts
├── package.json
├── tact.config.json        # Tact compiler configuration
├── tsconfig.json
└── README.md
```

## 👥 Team Members & Contributions

### Core Team

- **Smart Contract Developer**: Alwi
- **Backend Developer**: Alwi
- **Frontend Developer**: Ahmad Galih Nur Jati
- **Designer**: Ahmad Kharis

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **TON Documentation**: https://docs.ton.org/
- **Tact Language**: https://tact-lang.org/
- **Blueprint Framework**: https://github.com/ton-org/blueprint

---

**Built with ❤️ for the decentralized IoT future**
