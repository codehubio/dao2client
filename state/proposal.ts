import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
import { Proposal } from "../serde/states/proposal";
dotenv.config();
const {
  SC_ADDRESS = ''
} = process.env;
export async function getProposalByPda(connection: Connection, pda: PublicKey) {
  const proposalAccount = await connection.getAccountInfo(pda);
  const data = Proposal.deserialize(proposalAccount?.data as Buffer);
  const readableData = Proposal.deserializeToReadable(proposalAccount?.data as Buffer);
  return {
    pda,
    data,
    readableData,
  }
}