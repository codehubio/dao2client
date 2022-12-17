import debug from 'debug';
import BN from 'bn.js';
import { Connection, PublicKey, SystemProgram, TransactionInstruction, Transaction, TransactionMessage } from "@solana/web3.js";
import { CreateProposalIns } from '../serde/instructions/create-proposal';
import {
  pad
} from '../services/util.service';
import { getStatByAddress } from '../state/stat';
const log = debug('create-proposal:info');
export default async function createProposal(
  connection: Connection,
  creator: PublicKey,
  {
    name,
    description,
    expireOrFinalizeAfter,
  }: {
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
  const [statPda] = PublicKey.findProgramAddressSync([
    creator.toBuffer(),
    Buffer.from('stat'),
  ], new PublicKey(SC_ADDRESS));
  log(`Stat PDA: ${statPda}`);
  let numberOfProposals = new BN(0);
  try {
    const {
      data: statData,
    } = await getStatByAddress(connection, creator.toBase58());
    numberOfProposals = statData.numberOfProposals;
  } catch (error) {
    
  }
  const [proposalPda] = PublicKey.findProgramAddressSync([
    Buffer.from(numberOfProposals.toString()),
    creator.toBuffer(),
    Buffer.from('proposal'),
  ], new PublicKey(SC_ADDRESS));
  log(`Proposal PDA: ${proposalPda}`);
  const createDaoIx = new CreateProposalIns({
    name: Buffer.from(newName),
    description: Buffer.from(newDescription),
    expireOrFinalizedAfter: new BN(expireOrFinalizeAfter).divRound(new BN(1000)),
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
      pubkey: proposalPda,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: statPda,
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
