import * as borsh from 'borsh';

export class ExecuteStepIns {
  instruction;
  
  constructor() {
    this.instruction = 6;
  }

  serialize(): Uint8Array {
    return borsh.serialize(ExecuteStepInstructionSchema, this);
  }
  
}

export const ExecuteStepInstructionSchema = new Map([[ExecuteStepIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
  ],
}],
]);
