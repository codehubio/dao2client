import * as dotenv from 'dotenv';
import { Connection } from "@solana/web3.js";
import executeStep from '../instructions/execute-step';
import { sendTransactionWithMainWallet } from '../services/tx.service';
import { getMainWallet } from '../services/util.service';
dotenv.config()
const {
  RPC_ENDPOINT = '',
} = process.env;
async function run() {
  const params: any = {}
  const args = process.argv.slice(2);
  const signer = getMainWallet();
  for (const arg of args) {
    const [key, value] = arg.split('=').map(s => s.trim());
    params[key] = value || '';
  }
  const connection = new Connection(RPC_ENDPOINT);
  const tx = await executeStep(
    connection,
    signer.publicKey,
    params
  );
  return sendTransactionWithMainWallet(connection, tx);
}
run();