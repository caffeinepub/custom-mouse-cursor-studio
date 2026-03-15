import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    userCursors : Map.Map<Principal, List.List<CursorConfig>>;
  };

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

  public func run(_old : OldActor) : {} {
    {};
  };
};
