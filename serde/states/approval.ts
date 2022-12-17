import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as borsh from 'borsh';

export type TApproval = {
  accountType: number,
  index: BN,
  proposalPda: Uint8Array,
  stepPda: Uint8Array,
  approvedAmount: BN,
  sender: BN,
  isReverted: number,
  revertedAt: BN,
  createdAt: BN,
  incentiveFee: BN,
  incentiveRate: BN,
}
export class Approval {
  accountType;

  index;

  proposalPda;

  stepPda;

  approvedAmount;

  sender;

  isReverted;

  revertedAt;

  createdAt;

  incentiveFee;

  incentiveRate;

  constructor(fields: TApproval) {
    this.accountType = fields.accountType;
    this.index = fields.index;
    this.proposalPda = fields.proposalPda;
    this.stepPda = fields.stepPda;
    this.approvedAmount = fields.approvedAmount;
    this.sender = fields.sender;
    this.isReverted = fields.isReverted;
    this.revertedAt = fields.revertedAt;
    this.createdAt = fields.createdAt;
    this.incentiveFee = fields.incentiveFee;
    this.incentiveRate = fields.incentiveRate;

  }

  serialize(): Uint8Array {
    return borsh.serialize(ApprovalSchema, this);
  }

  static deserialize(raw: Buffer): Approval {
    return borsh.deserialize(ApprovalSchema, Approval, raw);
  }
  static deserializeToReadble(raw: Buffer): any {
    const {
      accountType,
      index,
      proposalPda,
      stepPda,
      approvedAmount,
      sender,
      isReverted,
      revertedAt,
      createdAt,
      incentiveFee,
      incentiveRate,
    } = Approval.deserialize(raw);
    return {
      accountType,
      index: index.toNumber(),
      incentiveRate: incentiveRate.toNumber(),
      incentiveFee: incentiveFee.toNumber(),
      approvedAmount: approvedAmount.toNumber(),
      proposalPda: new PublicKey(proposalPda).toBase58(),
      stepPda: new PublicKey(stepPda).toBase58(),
      sender: new PublicKey(sender).toBase58(),
      revertedAt: new Date(revertedAt.toNumber() * 1000),
      isReverted,
      createdAt: new Date(createdAt.toNumber() * 1000),
    }
  }
}
 
export const ApprovalSchema = new Map([[Approval, {
  kind: 'struct',
  fields: [
    ['accountType', 'u8'],
    ['index', 'u64'],
    ['proposalPda', [32]],
    ['stepPda', [32]],
    ['approvedAmount', 'u64'],
    ['incentiveFee', 'u64'],
    ['incentiveRate', 'u64'],
    ['sender', [32]],
    ['isReverted', 'u8'],
    ['revertedAt', 'u64'],
    ['createdAt', 'u64'],
    
  ],
}],
]);
