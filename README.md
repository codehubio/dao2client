
# TokenFlow - a simple yet flexible contract for token flow

## Problems

**(P1)** User A creates an proposal among multiple parties where
  - user B sends 10 tokens X to user C
  - user C sends 2 Sols to user B
  - user D sends 100 token Y to user A

  All transactions must be agreed upon by its sender in order for the agreement to be approved and executed. If one transaction is rejected by its sender, the agreement will fail

**(P2)** User A seeks fundings for his project by creating a proposal
  - 1000 tokens X in Q1
  - 200 Sols in Q2
  - 300 tokens Y in Q3

  Funds may come from different parties. All funding inquiries must be satisfied before 2023/01/01. Otherwise, the proposal will fail.

## How TokenFlow solves them

**(S1)** TokenFlow defines a multi-on-demand-transaction proposal and involves all the senders into the signing process.

Funds from approved transactions are safely moved to a vault and locked. Only after the agreement is approved (**all** of its transactions are approved by its senders), the locked funds will be released to the receivers accordingly.

**(S2)** TokenFlow defines a multi-on-demand-anonymous-transaction funding proposal. Anyone can involve into the funding process. Similar to **(S1)**, funds from approved transactions are safely moved to a vault and locked. Only after the agreement is approved (**all** of its transactions are approved), the locked funds will be released to the receivers accordingly.


## Proposal and transaction

Proposal is an agreement defines 1 or many transactions moving funds among parties


## Transaction type

There are 2 transaction types

- **(T1)** Transactions of which sender is 1111111111111111111111111111111.
- **(T2)** Transactions of which sender is **not** 1111111111111111111111111111111.


## Transaction approval

- Condition

  - Transaction was not approved or rejected before
  - Proposal is settled and not yet finalized
  - A **(T1)** transaction can be approved by anyone
  - Only sender of which address matches can approve a **(T2)** transaction.


- Approval to a transaction means senders fulfilling the fund desired in that transaction.

- A transaction can be funded many times by senders **until** its fund is fulfilled

- Transaction is approved right after its fund is fulfilled.


## Transaction execution

- Condition

  - The proposal which it belongs to is approved.

## Transaction rejection

- Condition

  - Transaction was not approved or rejected before
  - Proposal is settled and not yet finalized
  - A **(T1)** transaction cannot be rejected
  - Only sender of which address matches can reject a **(T2)** transaction.

## Transaction revert

Revert of a transaction means reverting all of its sub-transactions fulfilling the funds

- Condition:

  - The proposal that transacion belongs to is rejected



## Proposal phase
- pending: Proposal is pending right after its creation which allows creator to add the transaction (step) into it

- settled: After done adding the transactions, creator can settle the proposal. After that, the proposal would be locked from adding more transactions into it.

- approved: Proposal is approved if all of its transactions are approved

- rejected: Proposal is rejected if at least 1 of its transactions is rejected

- expire: Proposal reaches its end of life after the timestamp defined at *expire_or_finalize_after* field without being *approved* or *rejected*



