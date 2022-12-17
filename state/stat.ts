import * as dotenv from 'dotenv';
import { Connection, PublicKey } from "@solana/web3.js";
import { Stat } from '../serde/states/stat';
dotenv.config();
const {
  SC_ADDRESS = ''
} = process.env;
export async function getStatByAddress(connection: Connection, address: string) {
  const [pda] = PublicKey.findProgramAddressSync([
    new PublicKey(address).toBuffer(),
    Buffer.from('stat'),
  ], new PublicKey(SC_ADDRESS));
  const statAccount = await connection.getAccountInfo(pda);
  const statData = Stat.deserialize(statAccount?.data as Buffer);
  const readableData = Stat.deserializeToReadable(statAccount?.data as Buffer);
  return {
    pda,
    data: statData,
    readableData
  }
}