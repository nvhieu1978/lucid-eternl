import { Blockfrost, Data, Lucid } from "../lib//esm/mod.js";

/*
  AlwaysSucceeds Example
  Lock a UTxO with some ADA
  UTxO can be unlocked by anyone
  Showcasing PlutusV2

  Contract:

  validate :: () -> () -> ScriptContext -> Bool
  validate _ _ _ = True
 */

let lucid: Lucid;
let alwaysSucceedAddress: string;

const Datum = () => Data.void();
const Redeemer = () => Data.void();

let alwaysSucceed: ReturnType<Lucid['newScript']>;

export async function initializeLucid() {
  lucid = new Lucid({
    provider: new Blockfrost(
      "https://cardano-preview.blockfrost.io/api/v0",
      "previewq3MMGbeLAnWqYgxnCGncYNXM3fvHzrTl"
    ),
  });

  const api = await (globalThis as any).cardano.eternl.enable();
  lucid.selectWalletFromApi(api);

  alwaysSucceed = lucid.newScript({
    type: "PlutusV2",
    script: "49480100002221200101",
  });

  alwaysSucceedAddress = alwaysSucceed.toAddress();
}


export async function lockUtxo(lovelace: bigint): Promise<string> {
  if (!lucid || !alwaysSucceedAddress) {
    throw new Error("Lucid is not initialized. Call initializeLucid() first.");
  }

  const tx = await lucid
    .newTx()
    .payToContract(alwaysSucceedAddress, { Inline: Datum() }, { lovelace })
    // .payToContract(alwaysSucceedAddress, {
    //   AsHash: Datum(),
    //   scriptRef: lucid.newScript({
    //     type: "PlutusV2",
    //     script: "49480100002221200101",
    //   }).script, // adding PlutusV2 script to output
    // }, {})
    .commit();

  const signedTx = await tx.sign().commit();

  const txHash = await signedTx.submit();

  return txHash;
}


// Lock UTxO
export async function lockUtxo1(lovelace: bigint,): Promise<string> {
  const tx = await lucid
    .newTx()
    .payToContract(alwaysSucceedAddress, { Inline: Datum() }, { lovelace })
    .commit();

  const signedTx = await tx.sign().commit();
  console.log(signedTx);

  const txHash = await signedTx.submit();

  return txHash;
}

// Mở khóa UTxO
export async function unlockUtxo(lovelace: bigint ): Promise<string> {
  if (!lucid || !alwaysSucceedAddress) {
    throw new Error("Lucid is not initialized. Call initializeLucid() first.");
  }
 const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find((utxo) => 
  utxo.assets.lovelace > lovelace && utxo.datum === Datum() && !utxo.scriptRef 
);
console.log(utxo);
 if (!utxo) throw new Error("No UTxO with found");
  const tx = await lucid
    .newTx()
    .collectFrom([utxo], Redeemer())
    .attachScript(alwaysSucceed.script) // attach the script to the transaction
    .commit();
  console.log(`tx: ${tx}`);
  const signedTx = await tx.sign().commit();
  
  const txHash = await signedTx.submit();
  return txHash;
}

export async function redeemUtxo(): Promise<string> {
  if (!lucid || !alwaysSucceedAddress) {
    throw new Error("Lucid is not initialized. Call initializeLucid() first.");
  }

  // const referenceScriptUtxo = (await lucid.utxosAt(alwaysSucceedAddress)).find(
  //   (utxo) => Boolean(utxo.scriptRef)
  // );
  // if (!referenceScriptUtxo) throw new Error("Reference script not found");

  const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find(
    (utxo) => utxo.datum === Datum() && !utxo.scriptRef
  );
  if (!utxo) throw new Error("Spending script utxo not found");

  const tx = await lucid
    .newTx()
    .readFrom([referenceScriptUtxo]) // spending utxo by reading PlutusV2 from reference utxo
    .collectFrom([utxo], Redeemer())
    .commit();

  const signedTx = await tx.sign().commit();

  const txHash = await signedTx.submit();

  return txHash;
}