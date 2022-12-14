import debug from 'debug';
import BN from 'bn.js';
import { Connection, PublicKey, SystemProgram, TransactionInstruction, Transaction, TransactionMessage } from "@solana/web3.js";
import { CreateProposalIns } from '../serde/instructions/create-proposal';
import {
  pad
} from '../services/util.service';
const log = debug('create-proposal:info');
export default async function createProposal(
  connection: Connection,
  creator: PublicKey,
  {
    name,
    id,
    description,
    expireOrFinalizeAfter,
  }: {
    id: string,
    name: string,
    description: string,
    expireOrFinalizeAfter: number,
  },
) {
  const {
    SC_ADDRESS = ''
  } = process.env;
  const newName = pad(name, 16);
  const newDescription= pad(description, 256);

  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from(id),
    Buffer.from('proposal'),
  ], new PublicKey(SC_ADDRESS));
  log(`Dao PDA: ${pda}`);
  const createDaoIx = new CreateProposalIns({
    name: Buffer.from(newName),
    description: Buffer.from(newDescription),
    expireOrFinalizedAfter: new BN(expireOrFinalizeAfter).divRound(new BN(1000)),
    id: Buffer.from(id),
  });
  const serializedData = createDaoIx.serialize();
  const dataBuffer = Buffer.from(serializedData);
  // console.log(testPub.toBuffer());
  const instruction = new TransactionInstruction({
    keys: [{
      pubkey: creator,
      isSigner: true,
      isWritable: true,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: pda,
    }, {
      isSigner: false,
      isWritable: false,
      pubkey: SystemProgram.programId,
    }],
    programId: new PublicKey(SC_ADDRESS),
    data: dataBuffer,
  });
  const {
    blockhash,
  } =  await connection.getLatestBlockhash({
    commitment: 'finalized',
  });
  const tx = new TransactionMessage({
    payerKey: creator,
    recentBlockhash: blockhash,
    instructions: [instruction],
  }).compileToV0Message();
  return tx.serialize();
  
}
