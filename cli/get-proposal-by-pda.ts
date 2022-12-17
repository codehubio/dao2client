import debug from 'debug';
import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
// import { getProposalById } from '../state/dao';
import { getSteps } from '../state/step';
dotenv.config()
const {
  RPC_ENDPOINT = '',
} = process.env;
const log = debug('get-proposal-by-pda:info');
async function run() {
  const params: any = {}
  const args = process.argv.slice(2);
  for (const arg of args) {
    const [key, value] = arg.split('=').map(s => s.trim());
    params[key] = value || '';
  }
  const connection = new Connection(RPC_ENDPOINT);
  const proposal = await getSteps(
    connection,
    new PublicKey(params.proposalPda)
  );
  log(proposal);
  return proposal;
}
run();