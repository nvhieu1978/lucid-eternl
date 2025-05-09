import { EmulatorState, Hasher, paymentCredentialOf, } from "../mod.js";
export class Emulator {
    constructor(accounts) {
        Object.defineProperty(this, "network", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const time = Date.now();
        this.network = { Emulator: time };
        const GENESIS_HASH = "00".repeat(32);
        const utxos = accounts.map(({ address, assets, outputData }, index) => {
            const { scriptRef, ...datumVariant } = outputData || {};
            const datumHash = "AsHash" in datumVariant
                ? Hasher.hashData(datumVariant.AsHash)
                : "Hash" in datumVariant
                    ? datumVariant.Hash
                    : undefined;
            const datum = "AsHash" in datumVariant
                ? datumVariant.AsHash
                : "Inline" in datumVariant
                    ? datumVariant.Inline
                    : undefined;
            return {
                txHash: GENESIS_HASH,
                outputIndex: index,
                address,
                assets,
                datumHash,
                datum,
                scriptRef,
            };
        });
        this.state = new EmulatorState(time, utxos);
    }
    getDatum(datumHash) {
        const datum = this.state.getDatum(datumHash);
        if (!datum)
            throw new Error(`No datum found: datum hash ${datumHash}`);
        return Promise.resolve(datum);
    }
    getProtocolParameters() {
        return Promise.resolve(PROTOCOL_PARAMETERS_DEFAULT);
    }
    getDelegation(rewardAddress) {
        const staking = this.state.getStaking(rewardAddress);
        return Promise.resolve({
            poolId: staking?.poolId || null,
            drep: staking?.drep || null,
            rewards: BigInt(staking?.rewards || 0),
        });
    }
    getUtxoByUnit(unit) {
        const ledger = this.state.getLedger();
        const utxos = ledger.filter((utxo) => utxo.assets[unit] > 0n);
        if (utxos.length > 1) {
            throw new Error("Unit needs to be an NFT or only held by one address");
        }
        return Promise.resolve(utxos[0]);
    }
    getUtxos(addressOrCredential) {
        const ledger = this.state.getLedger();
        const matchesAddress = (utxo) => typeof addressOrCredential === "string"
            ? utxo.address === addressOrCredential
            : addressOrCredential.hash === paymentCredentialOf(utxo.address).hash;
        return Promise.resolve(ledger.filter((utxo) => matchesAddress(utxo)));
    }
    getUtxosByOutRef(outRefs) {
        const ledger = this.state.getLedger();
        return Promise.resolve(ledger.filter((utxo) => outRefs.some((outRef) => utxo.txHash === outRef.txHash &&
            utxo.outputIndex === outRef.outputIndex)));
    }
    getUtxosWithUnit(addressOrCredential, unit) {
        const ledger = this.state.getLedger();
        const matchesAddress = (utxo) => typeof addressOrCredential === "string"
            ? utxo.address === addressOrCredential
            : addressOrCredential.hash === paymentCredentialOf(utxo.address).hash;
        return Promise.resolve(ledger.filter((utxo) => matchesAddress(utxo) && utxo.assets[unit] > 0n));
    }
    awaitTx(txHash) {
        const mempool = this.state.getMempool();
        if (mempool.find((utxo) => utxo.txHash === txHash)) {
            this.state.awaitBlock();
            return Promise.resolve(true);
        }
        return Promise.resolve(true);
    }
    submit(tx) {
        return Promise.resolve(this.state.validate(tx));
    }
    distributeRewards(rewards) {
        this.state.distributeRewards(rewards);
    }
    awaitBlock(height = 1) {
        this.state.awaitBlock(height);
    }
    awaitSlot(slot = 1) {
        this.state.awaitSlot(slot);
    }
    now() {
        return this.state.getTime();
    }
}
export const PROTOCOL_PARAMETERS_DEFAULT = {
    minFeeA: 44,
    minFeeB: 155381,
    maxTxSize: 16384,
    maxValSize: 5000,
    keyDeposit: 2000000,
    poolDeposit: 500000000,
    priceMem: 0.0577,
    priceStep: 0.0000721,
    maxTxExMem: 14000000,
    maxTxExSteps: 10000000000,
    coinsPerUtxoByte: 4310,
    collateralPercentage: 150,
    maxCollateralInputs: 3,
    minfeeRefscriptCostPerByte: 15,
    costModels: {
        PlutusV1: [
            205665,
            812,
            1,
            1,
            1000,
            571,
            0,
            1,
            1000,
            24177,
            4,
            1,
            1000,
            32,
            117366,
            10475,
            4,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            100,
            100,
            23000,
            100,
            19537,
            32,
            175354,
            32,
            46417,
            4,
            221973,
            511,
            0,
            1,
            89141,
            32,
            497525,
            14068,
            4,
            2,
            196500,
            453240,
            220,
            0,
            1,
            1,
            1000,
            28662,
            4,
            2,
            245000,
            216773,
            62,
            1,
            1060367,
            12586,
            1,
            208512,
            421,
            1,
            187000,
            1000,
            52998,
            1,
            80436,
            32,
            43249,
            32,
            1000,
            32,
            80556,
            1,
            57667,
            4,
            1000,
            10,
            197145,
            156,
            1,
            197145,
            156,
            1,
            204924,
            473,
            1,
            208896,
            511,
            1,
            52467,
            32,
            64832,
            32,
            65493,
            32,
            22558,
            32,
            16563,
            32,
            76511,
            32,
            196500,
            453240,
            220,
            0,
            1,
            1,
            69522,
            11687,
            0,
            1,
            60091,
            32,
            196500,
            453240,
            220,
            0,
            1,
            1,
            196500,
            453240,
            220,
            0,
            1,
            1,
            806990,
            30482,
            4,
            1927926,
            82523,
            4,
            265318,
            0,
            4,
            0,
            85931,
            32,
            205665,
            812,
            1,
            1,
            41182,
            32,
            212342,
            32,
            31220,
            32,
            32696,
            32,
            43357,
            32,
            32247,
            32,
            38314,
            32,
            9462713,
            1021,
            10,
        ],
        PlutusV2: [
            205665,
            812,
            1,
            1,
            1000,
            571,
            0,
            1,
            1000,
            24177,
            4,
            1,
            1000,
            32,
            117366,
            10475,
            4,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            23000,
            100,
            100,
            100,
            23000,
            100,
            19537,
            32,
            175354,
            32,
            46417,
            4,
            221973,
            511,
            0,
            1,
            89141,
            32,
            497525,
            14068,
            4,
            2,
            196500,
            453240,
            220,
            0,
            1,
            1,
            1000,
            28662,
            4,
            2,
            245000,
            216773,
            62,
            1,
            1060367,
            12586,
            1,
            208512,
            421,
            1,
            187000,
            1000,
            52998,
            1,
            80436,
            32,
            43249,
            32,
            1000,
            32,
            80556,
            1,
            57667,
            4,
            1000,
            10,
            197145,
            156,
            1,
            197145,
            156,
            1,
            204924,
            473,
            1,
            208896,
            511,
            1,
            52467,
            32,
            64832,
            32,
            65493,
            32,
            22558,
            32,
            16563,
            32,
            76511,
            32,
            196500,
            453240,
            220,
            0,
            1,
            1,
            69522,
            11687,
            0,
            1,
            60091,
            32,
            196500,
            453240,
            220,
            0,
            1,
            1,
            196500,
            453240,
            220,
            0,
            1,
            1,
            1159724,
            392670,
            0,
            2,
            806990,
            30482,
            4,
            1927926,
            82523,
            4,
            265318,
            0,
            4,
            0,
            85931,
            32,
            205665,
            812,
            1,
            1,
            41182,
            32,
            212342,
            32,
            31220,
            32,
            32696,
            32,
            43357,
            32,
            32247,
            32,
            38314,
            32,
            35892428,
            10,
            57996947,
            18975,
            10,
            38887044,
            32947,
            10,
        ],
        PlutusV3: [
            100788,
            420,
            1,
            1,
            1000,
            173,
            0,
            1,
            1000,
            59957,
            4,
            1,
            11183,
            32,
            201305,
            8356,
            4,
            16000,
            100,
            16000,
            100,
            16000,
            100,
            16000,
            100,
            16000,
            100,
            16000,
            100,
            100,
            100,
            16000,
            100,
            94375,
            32,
            132994,
            32,
            61462,
            4,
            72010,
            178,
            0,
            1,
            22151,
            32,
            91189,
            769,
            4,
            2,
            85848,
            123203,
            7305,
            -900,
            1716,
            549,
            57,
            85848,
            0,
            1,
            1,
            1000,
            42921,
            4,
            2,
            24548,
            29498,
            38,
            1,
            898148,
            27279,
            1,
            51775,
            558,
            1,
            39184,
            1000,
            60594,
            1,
            141895,
            32,
            83150,
            32,
            15299,
            32,
            76049,
            1,
            13169,
            4,
            22100,
            10,
            28999,
            74,
            1,
            28999,
            74,
            1,
            43285,
            552,
            1,
            44749,
            541,
            1,
            33852,
            32,
            68246,
            32,
            72362,
            32,
            7243,
            32,
            7391,
            32,
            11546,
            32,
            85848,
            123203,
            7305,
            -900,
            1716,
            549,
            57,
            85848,
            0,
            1,
            90434,
            519,
            0,
            1,
            74433,
            32,
            85848,
            123203,
            7305,
            -900,
            1716,
            549,
            57,
            85848,
            0,
            1,
            1,
            85848,
            123203,
            7305,
            -900,
            1716,
            549,
            57,
            85848,
            0,
            1,
            955506,
            213312,
            0,
            2,
            270652,
            22588,
            4,
            1457325,
            64566,
            4,
            20467,
            1,
            4,
            0,
            141992,
            32,
            100788,
            420,
            1,
            1,
            81663,
            32,
            59498,
            32,
            20142,
            32,
            24588,
            32,
            20744,
            32,
            25933,
            32,
            24623,
            32,
            43053543,
            10,
            53384111,
            14333,
            10,
            43574283,
            26308,
            10,
            16000,
            100,
            16000,
            100,
            962335,
            18,
            2780678,
            6,
            442008,
            1,
            52538055,
            3756,
            18,
            267929,
            18,
            76433006,
            8868,
            18,
            52948122,
            18,
            1995836,
            36,
            3227919,
            12,
            901022,
            1,
            166917843,
            4307,
            36,
            284546,
            36,
            158221314,
            26549,
            36,
            74698472,
            36,
            333849714,
            1,
            254006273,
            72,
            2174038,
            72,
            2261318,
            64571,
            4,
            207616,
            8310,
            4,
            1293828,
            28716,
            63,
            0,
            1,
            1006041,
            43623,
            251,
            0,
            1,
            100181,
            726,
            719,
            0,
            1,
            100181,
            726,
            719,
            0,
            1,
            100181,
            726,
            719,
            0,
            1,
            107878,
            680,
            0,
            1,
            95336,
            1,
            281145,
            18848,
            0,
            1,
            180194,
            159,
            1,
            1,
            158519,
            8942,
            0,
            1,
            159378,
            8813,
            0,
            1,
            107490,
            3298,
            1,
            106057,
            655,
            1,
            1964219,
            24520,
            3,
        ],
    },
};
