import BN from 'bn.js';
import * as borsh from 'borsh';
export type TApproveStepInstruction = {
  approvedAmount: BN,
}
export class ApproveStepIns {
  instruction;

  approvedAmount;
  
  constructor(fields: TApproveStepInstruction) {
    this.instruction = 4;
    this.approvedAmount = fields.approvedAmount
  }

  serialize(): Uint8Array {
    return borsh.serialize(AddStepInstructionSchema, this);
  }
  
}

export const AddStepInstructionSchema = new Map([[ApproveStepIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
    ['approvedAmount', 'u64'],
  ],
}],
]);
