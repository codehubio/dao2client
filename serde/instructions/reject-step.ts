import * as borsh from 'borsh';

export class RejectStepIns {
  instruction;
  
  reason

  constructor(fields: { reason: string }) {
    this.instruction = 5;
    this.reason = fields.reason;
  }

  serialize(): Uint8Array {
    return borsh.serialize(RejectStepInstructionSchema, this);
  }
  
}

export const RejectStepInstructionSchema = new Map([[RejectStepIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
    ['reason', [128]],
  ],
}],
]);
