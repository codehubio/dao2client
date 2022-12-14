import * as borsh from 'borsh';

export class SettleProposalIns {
  instruction;

  constructor() {
    this.instruction = 3;
  }

  serialize(): Uint8Array {
    return borsh.serialize(CreateProposalInstructionSchema, this);
  }
  
}

export const CreateProposalInstructionSchema = new Map([[SettleProposalIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
  ],
}],
]);
