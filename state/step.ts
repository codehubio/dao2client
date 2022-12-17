import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalByPda } from './proposal';
import { Step } from '../serde/states/step';
import { Approval } from '../serde/states/approval';
dotenv.config();
const {
  SC_ADDRESS = ''
} = process.env;
export async function getSteps(connection: Connection, proposalPda: PublicKey) {
  const {
    readableData: readableProposalData
  } = await getProposalByPda(connection, proposalPda);
  let stepPdas: any [] = [];
  let approvedPdas: any [] [] = []
  for (let i = 0; i < readableProposalData.numberOfSteps; i+= 1) {
    const [pda] = PublicKey.findProgramAddressSync([
      Buffer.from(i.toString()),
      proposalPda.toBuffer(),
      Buffer.from('step'),
    ], new PublicKey(SC_ADDRESS));
    stepPdas.push(pda);
  }
  const stepInfos = await connection.getMultipleAccountsInfo(stepPdas);
  const stepData = stepInfos.map(s => Step.deserializeToReadble(s?.data as Buffer));
  for (let i = 0; i < stepData.length; i += 1) {
    const step = stepData[i];
    approvedPdas[i] = [];
    for (let j = 0; j < step.numberOfApprovals; j+= 1) {
      const [approvalPda] = PublicKey.findProgramAddressSync([
        Buffer.from(j.toString()),
        stepPdas[i].toBuffer(),
        Buffer.from('approval'),
      ], new PublicKey(SC_ADDRESS));
      approvedPdas[i].push(approvalPda);
    }
  }
  const approvalData = await Promise.all(approvedPdas.map(async (pdas) => {
    const data = await connection.getMultipleAccountsInfo(pdas);
    return data.map(s => Approval.deserializeToReadble(s?.data as Buffer));
  }))
  return {
    proposalPda: proposalPda.toBase58(),
    proposalData: readableProposalData,
    proposalSteps: stepData.map((s, index) => {
      return {
        ...s,
      approvals: approvalData[index]
      }
    })
  }
}