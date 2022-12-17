import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as borsh from 'borsh';

export type TProposal = {
  accountType: number,
  index: BN,
  name: Uint8Array,
  numberOfSteps: BN,
  numberOfApprovals: BN,
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
export class Proposal {
  accountType;
  
  index;

  name;

  numberOfSteps;
  
  numberOfApprovals;
  
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
  
  constructor(fields: TProposal) {
    this.accountType = fields.accountType;
    this.index = fields.index;
    this.name = fields.name;
    this.numberOfSteps = fields.numberOfSteps;
    this.numberOfApprovals = fields.numberOfApprovals;
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
    return borsh.serialize(ProposalSchema, this);
  }

  static deserialize(raw: Buffer): Proposal {
    return borsh.deserialize(ProposalSchema, Proposal, raw);
  }
  static deserializeToReadable(raw: Buffer): any {
    const {
      accountType,
      index,
      name,
      numberOfSteps,
      numberOfApprovals,
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
    } = Proposal.deserialize(raw);
    return {
      accountType,
      index: index.toNumber(),
      name: Buffer.from(name).toString(),
      numberOfSteps: numberOfSteps.toNumber(),
      numberOfApprovals: numberOfApprovals.toNumber(),
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

export const ProposalSchema = new Map([[Proposal, {
  kind: 'struct',
  fields: [
    ['accountType', 'u8'],
    ['index', 'u64'],
    ['name', [16]],
    ['numberOfSteps', 'u64'],
    ['numberOfApprovals', 'u64'],
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
