import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as borsh from 'borsh';

export type TStep = {
  accountType: number,
  index: BN,
  proposalPda: Uint8Array,
  name: Uint8Array,
  description: Uint8Array,
  amount: BN,
  receivedAmount: BN,
  numberOfApprovals: BN,
  sender: Uint8Array,
  receiver: Uint8Array,
  token: Uint8Array,
  executeAfter: BN,
  addedAt: BN,
  isApproved: number,
  approvedAt: BN,
  isExecuted: number,
  executedAt: BN,
  isRejected: number,
  rejectedAt: BN,
  incentiveRate: BN,
  incentiveFee: BN,
  isReverted: number,
  revertedAt: BN,
  revertedAmount: BN
  rejectedReason: Uint8Array;
}
export class Step {
  accountType;
  
  index;
  
  proposalPda;
  
  name;
  
  description;
  
  amount;

  receivedAmount;

  numberOfApprovals;
  
  sender;
  
  receiver;
  
  token;
  
  executeAfter;
  
  addedAt;
  
  isApproved;
  
  approvedAt;

  isExecuted;
  
  executedAt;

  isRejected;
  
  rejectedAt;

  incentiveRate;
  
  incentiveFee;
  
  isReverted;

  revertedAt;

  revertedAmount;

  rejectedReason;
  
  
  constructor(fields: TStep) {
    this.accountType = fields.accountType;
    this.index = fields.index;
    this.proposalPda = fields.proposalPda;
    this.name = fields.name;
    this.description = fields.description;
    this.amount = fields.amount;
    this.receivedAmount = fields.receivedAmount;
    this.sender = fields.sender;
    this.receiver = fields.receiver;
    this.token = fields.token;
    this.executeAfter = fields.executeAfter;
    this.addedAt = fields.addedAt;
    this.isApproved = fields.isApproved;
    this.approvedAt = fields.approvedAt;
    this.isExecuted = fields.isExecuted;
    this.executedAt = fields.executedAt;
    this.isRejected = fields.isRejected;
    this.rejectedAt = fields.rejectedAt;
    this.incentiveRate = fields.incentiveRate;
    this.incentiveFee = fields.incentiveFee;
    this.isReverted = fields.isReverted;
    this.revertedAt = fields.revertedAt;
    this.revertedAmount = fields.revertedAmount;
    this.numberOfApprovals =  fields.numberOfApprovals;
    this.rejectedReason = fields.rejectedReason;
  }

  serialize(): Uint8Array {
    return borsh.serialize(StepSchema, this);
  }

  static deserialize(raw: Buffer): Step {
    return borsh.deserialize(StepSchema, Step, raw);
  }
  static deserializeToReadble(raw: Buffer): any {
    const {
      accountType,
      index,
      proposalPda,
      name,
      description,
      amount,
      receivedAmount,
      numberOfApprovals,
      sender,
      receiver,
      token,
      executeAfter,
      addedAt,
      isApproved,
      approvedAt,
      isExecuted,
      executedAt,
      isRejected,
      rejectedAt,
      incentiveRate,
      incentiveFee,
      isReverted,
      revertedAt,
      revertedAmount,
      rejectedReason,
    } = Step.deserialize(raw);
    return {
      accountType,
      index: index.toNumber(),
      amount: amount.toNumber(),
      receivedAmount: receivedAmount.toNumber(),
      revertedAmount: revertedAmount.toNumber(),
      numberOfApprovals: numberOfApprovals.toNumber(),
      rejectedReason: Buffer.from(rejectedReason).toString(),
      name: Buffer.from(name).toString(),
      description: Buffer.from(description).toString(),
      proposalPda: new PublicKey(proposalPda).toBase58(),
      addedAt: new Date(addedAt.toNumber() * 1000),
      sender: new PublicKey(sender).toBase58(),
      receiver: new PublicKey(receiver).toBase58(),
      token: new PublicKey(token).toBase58(),
      executeAfter: new Date(executeAfter.toNumber() * 1000),
      approvedAt: new Date(approvedAt.toNumber() * 1000),
      isApproved,
      executedAt: new Date(executedAt.toNumber() * 1000),
      isExecuted,
      rejectedAt: new Date(rejectedAt.toNumber() * 1000),
      isRejected,
      incentiveRate: incentiveRate.toNumber(),
      incentiveFee: incentiveFee.toNumber(),
      isReverted,
      revertedAt: new Date(revertedAt.toNumber() * 1000),

    }
  }
}
 
export const StepSchema = new Map([[Step, {
  kind: 'struct',
  fields: [
    ['accountType', 'u8'],
    ['index', 'u64'],
    ['proposalPda', [32]],
    ['name', [16]],
    ['description', [128]],
    ['amount', 'u64'],
    ['receivedAmount', 'u64'],
    ['numberOfApprovals', 'u64'],
    ['sender', [32]],
    ['receiver', [32]],
    ['token', [32]],
    ['executeAfter', 'u64'],
    ['incentiveRate', 'u64'],
    ['incentiveFee', 'u64'],
    ['addedAt', 'u64'],
    ['isApproved', 'u8'],
    ['approvedAt', 'u64'],
    ['isRejected', 'u8'],
    ['rejectedAt', 'u64'],
    ['rejectedReason', [128]],
    ['isExecuted', 'u8'],
    ['executedAt', 'u64'],
    ['isReverted', 'u8'],
    ['revertedAt', 'u64'],
    ['revertedAmount', 'u64'],
    
  ],
}],
]);
