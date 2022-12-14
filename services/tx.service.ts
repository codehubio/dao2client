import debug from 'debug';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  Keypair,
  Connection,
  MessageV0,
  VersionedTransaction
} from '@solana/web3.js';
import { getMainWallet } from './util.service';
const log = debug('tx:info');
export async function sendTransaction(connection: Connection, signer: Keypair, serializedTransaction: Uint8Array): Promise<any> {
  log(`Sending tx with payer ${signer.publicKey.toBase58()}`);
  const tx = new VersionedTransaction(MessageV0.deserialize(serializedTransaction));
  tx.sign([signer]);
  const simulation = await connection.simulateTransaction(tx);
  log(simulation.value);
  const txid = await connection.sendTransaction(tx, {
    preflightCommitment: 'finalized',
    maxRetries: 3,
  });
  log(`txid: ${txid}`);
  log('NOTE: tx may take some moments to be finalized!')
  return txid;
}

export async function sendTransactionWithMainWallet(connection: Connection, serializedTransaction: Uint8Array): Promise<any> {
  const signer = getMainWallet();
  return sendTransaction(connection, signer, serializedTransaction);
}