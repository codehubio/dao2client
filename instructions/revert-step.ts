import debug from 'debug';
import { Connection, PublicKey, SystemProgram, TransactionInstruction, TransactionMessage } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Step } from '../serde/states/step';
import { RevertStepIns } from '../serde/instructions/revert-step';
const log = debug('settle-proposal:info');
export default async function approveStep(
  connection: Connection,
  creator: PublicKey,
  {
    proposalId,
    stepIndex,
    approvalIndex = 1,
  }: {
    proposalId: string,
    stepIndex: number,
    approvalIndex: number
  },
) {
  const {
    SC_ADDRESS = ''
  } = process.env;

  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from(proposalId),
    Buffer.from('proposal'),
  ], new PublicKey(SC_ADDRESS));
  const [stepPda] = PublicKey.findProgramAddressSync([
    Buffer.from(stepIndex.toString()),
    Buffer.from(proposalId),
    Buffer.from('step'),
  ], new PublicKey(SC_ADDRESS));
  log(`Getting step data from ${stepPda}`);
  const [approvalPda] = PublicKey.findProgramAddressSync([
    Buffer.from(approvalIndex.toString()),
    Buffer.from(stepIndex.toString()),
    Buffer.from(proposalId),
    Buffer.from('approval'),
  ], new PublicKey(SC_ADDRESS));
  const stepAccountInfo = await connection.getAccountInfo(stepPda);
  const stepData = Step.deserialize(stepAccountInfo?.data as Buffer);
  const {
    sender,
    amount,
    token,
  } = stepData;
  const senderPubKey = new PublicKey(sender);
  const tokenPubKey = new PublicKey(token);
  log(`Reverting sending ${amount.toNumber()} of ${tokenPubKey.toBase58()} to ${senderPubKey.toBase58()}`);
  const srcAta = await getAssociatedTokenAddress(
    tokenPubKey,
    pda,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  const dstAta = await getAssociatedTokenAddress(
    tokenPubKey,
    senderPubKey,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  const dstFeeAta = await getAssociatedTokenAddress(
    tokenPubKey,
    creator,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  log(`Dao PDA: ${pda}`);
  log(`Step PDA: ${stepPda}`);
  const revertStepIx = new RevertStepIns();
  const serializedData = revertStepIx.serialize();
  const dataBuffer = Buffer.from(serializedData);
  // console.log(testPub.toBuffer());
  const instruction = new TransactionInstruction({
    keys: [{
      pubkey: creator,
      isSigner: true,
      isWritable: true,
    }, {
      pubkey: senderPubKey,
      isSigner: false,
      isWritable: false,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: pda,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: stepPda,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: approvalPda,
    }, {
      isSigner: false,
      isWritable: false,
      pubkey: tokenPubKey,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: srcAta,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: dstAta,
    }, {
      isSigner: false,
      isWritable: true,
      pubkey: dstFeeAta,
    }, {
      isSigner: false,
      isWritable: false,
      pubkey: SystemProgram.programId,
    }, {
      isSigner: false,
      isWritable: false,
      pubkey: TOKEN_PROGRAM_ID,
    }, {
      isSigner: false,
      isWritable: false,
      pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
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
