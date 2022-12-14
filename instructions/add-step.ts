import debug from 'debug';
import BN from 'bn.js';
import { Connection, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage } from "@solana/web3.js";
import { AddStepIns } from '../serde/instructions/add-step';
import {
  pad
} from '../services/util.service';
import { getProposalById } from '../state/dao';
const log = debug('add-step:info');
export default async function addStep(
  connection: Connection,
  creator: PublicKey,
  {
    proposalId,
    name,
    description,
    amount,
    sender,
    receiver,
    token,
    executeAfter,
    incentiveRate,
  }: {
    proposalId: string,
    name: string,
    description: string,
    amount: number,
    sender: string,
    receiver: string,
    token: string,
    executeAfter: string,
    incentiveRate: number,
  },
) {
  const {
    SC_ADDRESS = ''
  } = process.env;
  const newName = pad(name, 16);
  const newDescription= pad(description, 128);
  const {
    data: daoData,
    pda: daoPda
  } = await getProposalById(connection, proposalId);
  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from(daoData.numberOfSteps.add(new BN(1)).toString()),
    Buffer.from(proposalId),
    Buffer.from('step'),
  ], new PublicKey(SC_ADDRESS));
  log(`Adding step ${pda} to dao id: ${Buffer.from(daoData.id).toString()}, pda: ${daoPda.toBase58()}`);
  const addStepIx = new AddStepIns({
    proposalId: Buffer.from(proposalId),
    name: Buffer.from(newName),
    description: Buffer.from(newDescription),
    amount: new BN(amount),
    sender: new PublicKey(sender).toBuffer(),
    receiver: new PublicKey(receiver).toBuffer(),
    token: new PublicKey(token).toBuffer(),
    executeAfter: new BN(executeAfter),
    incentiveRate: new BN(incentiveRate),
  });
  const serializedData = addStepIx.serialize();
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
      pubkey: daoPda,
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
