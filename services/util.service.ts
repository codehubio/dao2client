import {
  Keypair
} from '@solana/web3.js';
import bs58 from 'bs58';

import * as dotenv from 'dotenv';
dotenv.config();
const {
  WALLET_KEY = ''
} = process.env;
export function pad(str: string, len: number) {
  return str.padEnd(len, String.fromCharCode(0x00));
}
export function getMainWallet(): Keypair {
  const wallet = getWalletFromBase58(WALLET_KEY);
  return wallet;
}
export function getWalletFromBase58(bs58Key: string): Keypair {
  const wallet = Keypair.fromSecretKey(bs58.decode(bs58Key));
  return wallet;
}