import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

module {
  public type Time = Time.Time;
  public type Transaction = {
    originOwner: Principal;
    destinationOwner : Principal;
    transferredAmount : Nat;
    transactionDate : Time;
  };
};
