import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type CursorConfig = {
    id : Text;
    name : Text;
    image : Storage.ExternalBlob;
    size : Nat; // 16-256
    opacity : Float; // 0.0-1.0
    effect : EffectType;
    shape : ShapeType;
    createdAt : Int;
  };

  type EffectType = {
    #none;
    #trail;
    #glow;
  };

  type ShapeType = {
    #circle;
    #square;
  };

  module CursorConfig {
    public func compare(a : CursorConfig, b : CursorConfig) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let userCursors = Map.empty<Principal, List.List<CursorConfig>>();

  public shared ({ caller }) func saveCursorConfig(id : Text, name : Text, image : Storage.ExternalBlob, size : Nat, opacity : Float, effect : EffectType, shape : ShapeType) : async () {
    if (size < 16 or size > 256) {
      Runtime.trap("Size must be between 16 and 256");
    };
    if (opacity < 0.0 or opacity > 1.0) {
      Runtime.trap("Opacity must be between 0.0 and 1.0");
    };

    let newCursor : CursorConfig = {
      id;
      name;
      image;
      size;
      opacity;
      effect;
      shape;
      createdAt = Time.now();
    };

    let existingCursors = switch (userCursors.get(caller)) {
      case (null) {
        let list = List.empty<CursorConfig>();
        list.add(newCursor);
        list;
      };
      case (?cursors) {
        // Replace if id already exists
        let filtered = cursors.values().filter(func(c) { c.id != id });
        let filteredList = List.fromIter<CursorConfig>(filtered);
        filteredList.add(newCursor);
        filteredList;
      };
    };

    userCursors.add(caller, existingCursors);
  };

  public query ({ caller }) func listCursors() : async [CursorConfig] {
    switch (userCursors.get(caller)) {
      case (null) { [] };
      case (?cursors) {
        cursors.toArray().sort();
      };
    };
  };

  public shared ({ caller }) func deleteCursor(id : Text) : async () {
    switch (userCursors.get(caller)) {
      case (null) {
        Runtime.trap("No cursors found for user");
      };
      case (?cursors) {
        let filtered = cursors.values().filter(func(c) { c.id != id });
        let filteredList = List.fromIter<CursorConfig>(filtered);
        userCursors.add(caller, filteredList);
      };
    };
  };

  public query ({ caller }) func getCursor(id : Text) : async CursorConfig {
    switch (userCursors.get(caller)) {
      case (null) { Runtime.trap("No cursors found for user") };
      case (?cursors) {
        let found = cursors.values().find(func(c) { c.id == id });
        switch (found) {
          case (null) { Runtime.trap("Cursor not found") };
          case (?cursor) { cursor };
        };
      };
    };
  };
};
