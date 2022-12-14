import * as borsh from 'borsh';

export class RevertStepIns {
  instruction;
  
  constructor() {
    this.instruction = 7;
  }

  serialize(): Uint8Array {
    return borsh.serialize(RevertStepInstructionSchema, this);
  }
  
}

export const RevertStepInstructionSchema = new Map([[RevertStepIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
  ],
}],
]);
