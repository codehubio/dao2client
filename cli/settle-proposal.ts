import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
import settleProposal from '../instructions/settle-proposal';
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
  const tx = await settleProposal(
    connection,
    signer.publicKey, {
      ...params,
      proposalPda: new PublicKey(params.proposalPda)
    }
  );
  return sendTransactionWithMainWallet(connection, tx);
}
run();