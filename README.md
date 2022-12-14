
# TokenFlow - a simple yet flexible contract for token flow

## I. Problems

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

## II. How TokenFlow solves them

**(S1)** TokenFlow defines a multi-on-demand-transaction proposal and involves all the senders into the signing process.

Funds from approved transactions are safely moved to a vault and locked. Only after the agreement is approved (**all** of its transactions are approved by its senders), the locked funds will be released to the receivers accordingly.

**(S2)** TokenFlow defines a multi-on-demand-anonymous-transaction funding proposal. Anyone can involve into the funding process. Similar to **(S1)**, funds from approved transactions are safely moved to a vault and locked. Only after the agreement is approved (**all** of its transactions are approved), the locked funds will be released to the receivers accordingly.


## III. Proposal and transaction

Proposal is an agreement defines 1 or many transactions moving funds among parties


## IV. Transaction type

There are 2 transaction types

- **(T1)** Transactions of which sender is 1111111111111111111111111111111.
- **(T2)** Transactions of which sender is **not** 1111111111111111111111111111111.


## V. Transaction approval

- Condition

  - Transaction was not approved or rejected before
  - Proposal is settled and not yet finalized
  - A **(T1)** transaction can be approved by anyone
  - Only sender of which address matches can approve a **(T2)** transaction.


- Approval to a transaction means senders fulfilling the fund desired in that transaction.

- A transaction can be funded many times by senders **until** its fund is fulfilled

- Transaction is approved right after its fund is fulfilled.


## VI. Transaction execution

- Condition

  - The proposal which it belongs to is approved.

## VII. Transaction rejection

- Condition

  - Transaction was not approved or rejected before
  - Proposal is settled and not yet finalized
  - A **(T1)** transaction cannot be rejected
  - Only sender of which address matches can reject a **(T2)** transaction.

## VIII. Transaction revert

Revert of a transaction means reverting all of its approvals.

- Condition:

  - The proposal that transacion belongs to is rejected



## IX. Phase of a proposal
- *pending*: Proposal is pending right after its creation which allows creator to add the transaction (step) into it

- *settled*: After done adding the transactions, creator can settle the proposal. After that, the proposal would be locked from adding more transactions into it.

- *approved*: Proposal is approved if all of its transactions are approved

- *rejected*: Proposal is rejected if at least 1 of its transactions is rejected

- *expire*: Proposal reaches its end of life after the timestamp defined at *expire_or_finalize_after* field without being *approved* or *rejected*


## X.  Incentive rate and incentive fee

- Incentive fee is transaction-based and is calculated as follow

    ```incentive_fee  = incentive_rate * amount / 10000```

- The fee applies in 2 cases

  - Execution of an approved transaction

  - Revert of an approved transaction

- Since the above actions can be run by *anyone*, a small fee will be credited to the caller. The fee is paid by the parties who approve the transaction.


## XI. Installation


Devnet address: *FHQLyQrTkgbpH42ukPExb6i1L22Wbm3vcaKLc8FiwFsp*


- For now, only cli is supported (will add more fancy UI in future)

- Put your base58 secret wallet in .env file

- Pour some test SOL to you wallet on devnet

- Open your terminal

  - run ```cd <code_folder>```
  - run ```chmod +x ./dao.sh```
  - All cli commands have same format: ```./dao.sh action param1=value1 params2=value2```
  
    E.g: ```./dao.sh create-proposal description=3 name=2 id=0011223300112237```

- Supported actions:
  
  - create proposal ----> *create-proposal*
  - add transaction (step) to a proposal ---> *add-step*
  - settle the proposal ----> *settle-proposal*
  - partially approve a transaction (step) of a proposal ----> *approve-step*
  - reject a step of a proposal ----> *reject-step*
  - execute a step of an approved proposal ----> *execute-step*
  - reverted a sub transaction of approved transacton of a rejected proposal ----> *revert-step*
  - get info of a proposal ----> *get-proposal-by-id*


## XII. Reference

  ### a) Creating a new proposal


  ```js
  ./dao.sh create-proposal description=put_description name=put_name expireOrFinalizeAfter=duration id=0011223300112237
  ```
  - `id`: a globally unique id must be provided (16 chars fixed)
  
  - `name`: Name of the proposal (16 char max)
  
  - `description`: Description of the proposal (128 char max)
  
  - `expireOrFinalizeAfter`: How long in seconds would the proposal last if it is not finalized (approved or rejected). If the proposal is rejected or approved, this field can be ignored in further logic
  

  After a proposal being created, transactions can be added to the proposal by its creator.


  ### b) Adding a transaction (step) to a proposal

  Transactions can be added to a propposal if it is not yet settled. Only proposal creator can add new transactions to proposal

```
./dao.sh add-step incentiveRate=incentiveRate name=name description=description amount=amount sender=sender receiver=receiver token=token executeAfter=executeAfter proposalId=proposalId
```


  - `incentiveRate`: used to calculate the incentive fee to execute or revert an approved transaction (can be set to 0)
  
  - `name`: Name of the transaction (step) (16 char max)
  
  - `description`: Description of the transaction (128 char max)

  - `amount`: How much would be sent
  
  - `sender`: sender address
      
      - if sender is `11111111111111111111111111111111` (32 chars), this transaction can be approved by *anyone*
      - otherwise, only wallet of which address matches sender can approve the transaction

  - `receiver`: receiver address

  - `token`: mint address of token to be sent, use `11111111111111111111111111111111` (32 chars) for native token (SOL)

  - `executeAfter`: How long that transaction will be locked from execution after the proposal is approved

  - `proposalId`: id of the proposal which the transaction belongs to

  
  ### c) Settling a proposal

  Once done adding new transactions to a proposal, its creator can settle the proposal which means
  
    - No more transaction can be added to the proposal
    - Proposal is ready to review


```js
./dao.sh settle-proposal proposalId=proposalId
```

  - `proposalId`: id of the proposal to be settled



  ### d) Approving a transaction

  After a proposal is settled, its transaction can be approved by sender. A transaction can be *partly* approved by its sender until all required amount is fulfilled. After required amount is fulfilled, transaction is *fully* approved.


  Beside paying the amount, sender also pays the incentive fee if the fee is > 0.

  If a transaction's sender is `11111111111111111111111111111111`, *anyone* can call to approve the transaction, otherwise, the caller address must match the sender.

  Finalized transation (fully approved or rejected) cannot be approved again.

  After calling this instruction, an *approvedAmount* + incentiveFee amount of tokens will be taken from the caller's wallet to the vault and locked

  ```js
./dao.sh approve-step proposalId=proposalId stepIndex=stepIndex approvedAmount=approvedAmount
  ```


  - `stepIndex`: 1-based index of transaction in the proposal
  
  - `approvedAmount`: amount which approved, the approved amount of a transaction will be added up after each approve until the required amount is satisfied. If the approved amount is larger than the remaining amount, only the minimum required amount is taken.
  

  - `proposalId`: id of the proposal of which transaction belongs to

  ### e) Rejecting a transaction

  After a proposal is settled, a transaction can only be rejected by its sender.

  After a transaction is rejected, the proposal which it belongs to is rejected

  Finalized transation (fully approved or rejected) cannot be rejected again.

  ```js
./dao.sh approve-step proposalId=proposalId stepIndex=stepIndex approvedAmount=approvedAmount
  ```


  - `stepIndex`: 1-based index of transaction in the proposal
  
  - `reason`: reason to reject (128 char max)

  - `proposalId`: id of the proposal of which transaction belongs to

  ### e) Executing a transaction

  After a proposal is approved, its transaction can be executed. 
  An incentive fee will be paid to the executor.

  After calling this instruction,
   
    - Incentive fee will be paid to the executor.
    - Required transaction amount will be sent to receiver.

  A transaction cannot be executed more than 1 time.

  ```js
./dao.sh execute-step proposalId=proposalId stepIndex=stepIndex 
  ```


  - `stepIndex`: 1-based index of transaction in the proposal
  
  - `proposalId`: id of the proposal of which transaction belongs to

  ### e) Reverting an approval

  After a proposal is rejected, partyly or fullly approved transactions can be reverted by reverting their approvals.

  After calling this instruction,
   
    - Incentive fee will be paid to the executor.
    - Required transaction amount will be sent to sender.
  
  An approval cannot be reverted more than 1 time
  

  ```js
./dao.sh revert-step proposalId=proposalId stepIndex=stepIndex approvalIndex=approvalIndex
  ```


  - `stepIndex`: 1-based index of transaction in the proposal

  - `approvalIndex`: 1-based index of the approval of the transaction
  
  - `proposalId`: id of the proposal of which transaction belongs to

   ### e) Retrieving info of a proposal


  ```js
./dao.sh get-proposal-by-id proposalId=proposalId
  ```

  
  - `proposalId`: id of the proposal to get

