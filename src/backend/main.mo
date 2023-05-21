import Text "mo:base/Text";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import JSON "mo:json/JSON";
import Account "Account";

actor MotokoWallet {
  
  public type Account = Account.Account;

  let ledger : TrieMap.TrieMap<Account, Nat> = TrieMap.TrieMap(Account.accountsEqual, Account.accountsHash);

  public shared ({ caller }) func checkOrRegister(account: Account): async Text {

    // Comprobar que la cuenta existe.
      // En caso de no existir, registrar, agregar 100 MOC y mostrar balance. 
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

    // En caso de existir, obtener cuenta y entregar balance. 
    let existingBalance : Nat = await balanceOf(account);
 
    return JSON.show(
      #Object([
        ("principal", #String(Principal.toText(account.owner)) ),
        ("balance", #String(Nat.toText(existingBalance)) ),
        ("receivedBonus", #Boolean(false)),
      ])
    );
  };  

  public shared query ({ caller }) func test(account: Account): async Text {

    return "Caller: " # Principal.toText(caller) # ", account " # Principal.toText(account.owner);
  };

  public query func balanceOf(account : Account) : async (Nat) {
    return Option.get(ledger.get(account), 0);
  };

  public query func greet(name: Text) : async Text {
    return "Hello, " # name # "! This is greet() from src/motoko/main.mo";
  };

  private func accountExists(account: Account) : Bool {

    return Option.isSome(ledger.get(account));
  };
};