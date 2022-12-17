import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as borsh from 'borsh';

export type TStep = {
  accountType: number,
  numberOfProposals: BN,
}
export class Stat {
  accountType;

  numberOfProposals;

  constructor(fields: TStep) {
    this.accountType = fields.accountType;
    this.numberOfProposals = fields.numberOfProposals;

  }

  serialize(): Uint8Array {
    return borsh.serialize(StatSchema, this);
  }

  static deserialize(raw: Buffer): Stat {
    return borsh.deserialize(StatSchema, Stat, raw);
  }
  static deserializeToReadable(raw: Buffer): any {
    const {
      accountType,
      numberOfProposals
    } = Stat.deserialize(raw);
    return {
      accountType,
      numberOfProposals: numberOfProposals.toNumber(),
    }
  }
}
 
export const StatSchema = new Map([[Stat, {
  kind: 'struct',
  fields: [
    ['accountType', 'u8'],
    ['numberOfProposals', 'u64'],
  ],
}],
]);
