import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import TrieMap "mo:base/TrieMap";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Order "mo:base/Order";
import JSON "mo:json/JSON";
import Account "Account";
import Transaction "Transaction";

actor MotokoWallet {
  
  public type Account = Account.Account;
  public type Transaction = Transaction.Transaction;
  public type TransactionType = Transaction.TransactionType;

  let ledger : TrieMap.TrieMap<Account, Nat> = TrieMap.TrieMap(Account.accountsEqual, Account.accountsHash);
  let logBook : TrieMap.TrieMap<Account, Buffer.Buffer<Transaction>> = TrieMap.TrieMap(Account.accountsEqual, Account.accountsHash);

  public shared ({ caller }) func checkOrRegister(account: Account): async Text {

    // Check if the account exists.
    // If it doesn't then register user, add it 100 MOC and show its balance. 
    if (not accountExists(account)) {

      let welcomeBonus : Nat = 100;
      let newAccount : Account = { owner = caller; subaccount = null; };

      ledger.put(newAccount, welcomeBonus);

      let balance : Nat = await balanceOf(newAccount);

      return JSON.show(
        #Object([
          ("principal", #String(Principal.toText(newAccount.owner)) ),
          ("balance", #String(Nat.toText(balance)) ),
          ("receivedBonus", #Boolean(true)),
        ])
      );
    };

    // If the user already exists, the get its balance and show
    let existingBalance : Nat = await balanceOf(account);
 
    return JSON.show(
      #Object([
        ("principal", #String(Principal.toText(account.owner)) ),
        ("balance", #String(Nat.toText(existingBalance)) ),
        ("receivedBonus", #Boolean(false)),
      ])
    );
  };  

  public shared ({ caller }) func transfer(from : Account, to : Account, amount : Nat) : async Result.Result<(), Text> {
    
    // Verify 'Account from' belongs to you.
    if (not Account.accountBelongToPrincipal(from, caller)) {

      return #err(
        JSON.show(
          #Object([
            ("FORBIDDEN_ACCOUNT", #String("You are no the owner of this account, you will be reported ASAP.")),
          ])
        )
      );
    };

    // Verify 'Account to' does exists.
    if (not accountExists(to)) {
      
      return #err(
        JSON.show(
          #Object([
            ("NON_EXISTENT_TARGET_ACCOUNT", #String("The account you are transferring to does not exists.")),
          ])
        )
      );
    };
    
    // Verify amount is greater than 0.
    if(amount <= 0) {
      
      return #err(
        JSON.show(
          #Object([
            ("AMOUNT_MUST_BE_GREATER_THAN_ZERO", #String("The amount you're trying to send must be greater than zero!.")),
          ])
        )
      );
    };

    // This account belongs to me, target account exists and the amount to transfer is greater than zero.
    // Get my balance. 
    let AccountFromBalance : Nat = Option.get(ledger.get(from), 0);
    
    // If my balance is less than the amount I'm trying to transfer, let me know I don't have enough tokens.
    if (AccountFromBalance < amount) {
      
      return #err(
        JSON.show(
          #Object([
            ("AMOUNT_MUST_BE_GREATER_THAN_ZERO", #String("You don't have enough tokens to make the transfer!")),
          ])
        )
      );
    };
    
    // Ok, seems I have enough tokens in my wallet, let's make the transfer.
    // Deduce the amount from my balance. 
    ledger.put(from, (AccountFromBalance - amount));
    
    // Add it to the destination account.
    // Get destination balance.
    let AccountToBalance : Nat = Option.get(ledger.get(to), 0);
    // Add it to ledger.
    ledger.put(to, (AccountToBalance + amount));

    // Save transaction.
    await logTransaction(from, to, amount);

    return #ok;
  };

  public shared ({ caller }) func logTransaction(from : Account, to : Account, amount : Nat) : async () {
    
    // Get your logBook
    let originTransactions = Option.get(logBook.get(from), Buffer.Buffer<Transaction>(0));
    // Get the other end transactions. 
    let destinationTransactions = Option.get(logBook.get(to), Buffer.Buffer<Transaction>(0));
 
    // Sender log.
    originTransactions.add({
      originOwner = from.owner; 
      destinationOwner = to.owner; 
      transferredAmount = amount;
      transactionDate = Time.now();
      transactionType = #Dispatched;
    });
    
    logBook.put(from, originTransactions);

    // Receiver log.
    destinationTransactions.add({
      originOwner = from.owner; 
      destinationOwner = to.owner; 
      transferredAmount = amount;
      transactionDate = Time.now();
      transactionType = #Received;
    });

    logBook.put(to, destinationTransactions);

    return ();
  };
  
  public query func balanceOf(account : Account) : async (Nat) {
    return Option.get(ledger.get(account), 0);
  };

  public query func getLogBook(account : Account) : async Text {

    var transactionType: Text = "";
    
    // Get your logBook. 
    let transactions: Buffer.Buffer<Transaction> = Option.get(logBook.get(account), Buffer.Buffer<Transaction>(0));
    let transactionsReplica = Buffer.clone(transactions);

    let transactionsArray = Iter.toArray<Transaction>(transactionsReplica.vals());
    let descSortedTransactions = Array.sort(transactionsArray, descOrder);
    let transactionEntries = Buffer.fromArray<Transaction>(descSortedTransactions);

    let transactionJSONObjects = Buffer.map<Transaction, JSON.JSON>(transactionEntries, func (t) { 

      if (t.transactionType == #Dispatched) {
        transactionType := "dispatched";
      } else {
        transactionType := "received";
      };

      return #Object([
        ("originOwner", #String(Principal.toText(t.originOwner))),
        ("destinationOwner", #String(Principal.toText(t.destinationOwner))),
        ("transferredAmount", #String(Nat.toText(t.transferredAmount))),
        ("transactionDate", #Number(t.transactionDate)),
        ("transactionType", #String(transactionType))
      ]);
    });

    return JSON.show( #Array(Buffer.toArray(transactionJSONObjects)) );
  };

  private func accountExists(account: Account) : Bool {
    return Option.isSome(ledger.get(account));
  };

  private func descOrder(x: Transaction, y: Transaction) : Order.Order {
    return Int.compare(y.transactionDate, x.transactionDate);
  };
};