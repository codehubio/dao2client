import BN from 'bn.js';
import * as borsh from 'borsh';

export type TCreateProposalInstruction = {
  id: Uint8Array,
  name: Uint8Array,
  description: Uint8Array,
  expireOrFinalizedAfter: BN,
}
export class CreateProposalIns {
  instruction;
  
  id;

  name;

  description;
  
  expireOrFinalizedAfter;

  constructor(fields: TCreateProposalInstruction) {
    this.instruction = 1;
    this.name = fields.name;
    this.id = fields.id;
    this.description = fields.description;
    this.expireOrFinalizedAfter = fields.expireOrFinalizedAfter;
  }

  serialize(): Uint8Array {
    return borsh.serialize(CreateProposalInstructionSchema, this);
  }
  
}

export const CreateProposalInstructionSchema = new Map([[CreateProposalIns, {
  kind: 'struct',
  fields: [
    ['instruction', 'u8'],
    ['id', [16]],
    ['name', [16]],
    ['description', [256]],
    ['expireOrFinalizedAfter', 'u64'],
  ],
}],
]);
