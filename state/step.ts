import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
import { getProposalById } from './dao';
import { Step } from '../serde/states/step';
import { Approval } from '../serde/states/approval';
dotenv.config();
const {
  SC_ADDRESS = ''
} = process.env;
export async function getSteps(connection: Connection, proposalId: string) {
  const {
    pda: daoPda,
    data: daoData,
    readableData: readbleDaoData
  } = await getProposalById(connection, proposalId);
  let stepPdas: any [] = [];
  let approvedPdas: any [] [] = []
  for (let i = 1; i <= readbleDaoData.numberOfSteps; i+= 1) {
    const [pda] = PublicKey.findProgramAddressSync([
      Buffer.from(i.toString()),
      Buffer.from(proposalId),
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
        Buffer.from(step.index.toString()),
        Buffer.from(proposalId),
        Buffer.from('approval'),
      ], new PublicKey(SC_ADDRESS));
      approvedPdas[i].push(approvalPda);
    }
  }
  const approvalData = await Promise.all(approvedPdas.map(async (pdas) => {
    const data = await connection.getMultipleAccountsInfo(pdas);
    console.log(pdas.map(p => p.toBase58()))
    return data.map(s => Approval.deserializeToReadble(s?.data as Buffer));
  }))
  return {
    daoPda: daoPda.toBase58(),
    daoData: readbleDaoData,
    daoSteps: stepData.map((s, index) => {
      return {
        ...s,
      approvals: approvalData[index]
      }
    })
  }
}