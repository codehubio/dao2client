import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as borsh from 'borsh';

export type TDao = {
  accountType: number,
  id: Uint8Array,
  name: Uint8Array,
  numberOfSteps: BN,
  numberOfApproval: BN,
  description: Uint8Array,
  createdAt: BN,
  expireOrFinalizeAfter: BN,
  creator: Uint8Array,
  isApproved: number,
  approvedAt: BN,
  isSettled: number,
  settledAt: BN,
  isRejected: number,
  rejectedAt: BN,
}
export class Dao {
  accountType;
  
  id

  name;

  numberOfSteps;
  
  numberOfApproval;
  
  createdAt;
  
  expireOrFinalizeAfter;
  
  isApproved;

  approvedAt;
  
  creator;

  description;

  isSettled;

  settledAt;

  isRejected;

  rejectedAt;
  
  constructor(fields: TDao) {
    this.accountType = fields.accountType;
    this.id = fields.id
    this.name = fields.name;
    this.numberOfSteps = fields.numberOfSteps;
    this.numberOfApproval = fields.numberOfApproval;
    this.expireOrFinalizeAfter = fields.expireOrFinalizeAfter;
    this.creator = fields.creator;
    this.description = fields.description;
    this.createdAt = fields.createdAt;
    this.isApproved = fields.isApproved;
    this.approvedAt = fields.approvedAt;
    this.isSettled = fields.isSettled;
    this.settledAt = fields.settledAt;
    this.isRejected = fields.isRejected;
    this.rejectedAt = fields.rejectedAt;
  }

  serialize(): Uint8Array {
    return borsh.serialize(DaoSchema, this);
  }

  static deserialize(raw: Buffer): Dao {
    return borsh.deserialize(DaoSchema, Dao, raw);
  }
  static deserializeToReadable(raw: Buffer): any {
    const {
      accountType,
      id,
      name,
      numberOfSteps,
      numberOfApproval,
      createdAt,
      expireOrFinalizeAfter,
      isApproved,
      approvedAt,
      creator,
      isSettled,
      settledAt,
      isRejected,
      rejectedAt,
      description,
    } = Dao.deserialize(raw);
    return {
      accountType,
      id: Buffer.from(id).toString(),
      name: Buffer.from(name).toString(),
      numberOfSteps: numberOfSteps.toNumber(),
      numberOfApproval: numberOfApproval.toNumber(),
      createdAt: new Date(createdAt.toNumber() * 1000),
      expireOrFinalizeAfter: new Date(expireOrFinalizeAfter.toNumber() * 1000),
      isApproved,
      approvedAt: new Date(approvedAt.toNumber() * 1000),
      isSettled,
      settledAt: new Date(settledAt.toNumber() * 1000),
      isRejected,
      rejectedAt: new Date(rejectedAt.toNumber() * 1000),
      creator: new PublicKey(creator).toBase58(),
      description: Buffer.from(description).toString(),
    }
  }
}

export const DaoSchema = new Map([[Dao, {
  kind: 'struct',
  fields: [
    ['accountType', 'u8'],
    ['id', [16]],
    ['name', [16]],
    ['numberOfSteps', 'u64'],
    ['numberOfApproval', 'u64'],
    ['description', [256]],
    ['createdAt', 'u64'],
    ['expireOrFinalizeAfter', 'u64'],
    ['creator', [32]],
    ['isApproved', 'u8'],
    ['approvedAt', 'u64'],
    ['isSettled', 'u8'],
    ['settledAt', 'u64'],
    ['isRejected', 'u8'],
    ['rejectedAt', 'u64'],
  ],
}],
]);
