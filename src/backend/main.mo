import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  type EarbudsProfile = {
    id : Nat;
    name : Text;
    leftBattery : Nat;
    rightBattery : Nat;
    caseBattery : Nat;
    backgroundColor : Text;
    accentColor : Text;
    fontStyle : Text;
    image : Storage.ExternalBlob;
  };

  module EarbudsProfile {
    public func compare(a : EarbudsProfile, b : EarbudsProfile) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let profiles = Map.empty<Nat, EarbudsProfile>();
  var nextId = 0;

  public shared ({ caller }) func addProfile(
    name : Text,
    leftBattery : Nat,
    rightBattery : Nat,
    caseBattery : Nat,
    backgroundColor : Text,
    accentColor : Text,
    fontStyle : Text,
    image : Storage.ExternalBlob,
  ) : async Nat {
    let id = nextId;
    let profile : EarbudsProfile = {
      id;
      name;
      leftBattery;
      rightBattery;
      caseBattery;
      backgroundColor;
      accentColor;
      fontStyle;
      image;
    };
    profiles.add(id, profile);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func updateProfile(
    id : Nat,
    name : Text,
    leftBattery : Nat,
    rightBattery : Nat,
    caseBattery : Nat,
    backgroundColor : Text,
    accentColor : Text,
    fontStyle : Text,
    image : Storage.ExternalBlob,
  ) : async () {
    switch (profiles.get(id)) {
      case (null) { () };
      case (?_) {
        let updatedProfile : EarbudsProfile = {
          id;
          name;
          leftBattery;
          rightBattery;
          caseBattery;
          backgroundColor;
          accentColor;
          fontStyle;
          image;
        };
        profiles.add(id, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func deleteProfile(id : Nat) : async () {
    profiles.remove(id);
  };

  public query ({ caller }) func getProfile(id : Nat) : async ?EarbudsProfile {
    profiles.get(id);
  };

  public query ({ caller }) func getAllProfiles() : async [EarbudsProfile] {
    profiles.values().toArray().sort();
  };
};
