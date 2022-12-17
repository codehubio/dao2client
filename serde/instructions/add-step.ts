import BN from 'bn.js';
import * as borsh from 'borsh';

export type TAddStepInstruction = {
  name: Uint8Array,
  description: Uint8Array,
  amount: BN,
  sender: Uint8Array,
  receiver: Uint8Array,
  token: Uint8Array,
  executeAfter: BN,
  incentiveRate: BN,
}
export class AddStepIns {
  instruction;
  
  name;
  
  description;
  
  amount;
  
  sender;
  
  receiver;
  
  token;
  
  executeAfter;

  incentiveRate;
  
  constructor(fields: TAddStepInstruction) {
    this.instruction = 2;
    this.name = fields.name;
    this.description = fields.description;
    this.amount = fields.amount;
    this.sender = fields.sender;
    this.receiver = fields.receiver;
    this.token = fields.token;
    this.executeAfter = fields.executeAfter;
    this.incentiveRate = fields.incentiveRate;
  }

  serialize(): Uint8Array {
    return borsh.serialize(AddStepInstructionSchema, this);
  }
  
}

export const AddStepInstructionSchema = new Map([[AddStepIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
    ['name', [16]],
    ['description', [128]],
    ['amount', 'u64'],
    ['sender', [32]],
    ['receiver', [32]],
    ['token', [32]],
    ['executeAfter', 'u64'],
    ['incentiveRate', 'u64'],
  ],
}],
]);
