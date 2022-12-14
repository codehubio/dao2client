import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
import { Dao } from "../serde/states/dao";
dotenv.config();
const {
  SC_ADDRESS = ''
} = process.env;
export async function getProposalById(connection: Connection, proposalId: string) {
  const [pda] = PublicKey.findProgramAddressSync([
    Buffer.from(proposalId),
    Buffer.from('proposal'),
  ], new PublicKey(SC_ADDRESS));
  const daoAccount = await connection.getAccountInfo(pda);
  const daoData = Dao.deserialize(daoAccount?.data as Buffer);
  const readbleDaoData = Dao.deserializeToReadable(daoAccount?.data as Buffer);
  return {
    pda,
    data: daoData,
    readableData: readbleDaoData
  }
}