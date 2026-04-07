import List "mo:core/List";

module {

  // ── Old types (inlined from .old/src/backend/main.mo) ──────────────────────

  type OldLoveCard = {
    title : Text;
    description : Text;
    photos : [{ src : Text; rotation : Int }];
  };

  type OldGalleryPhoto = {
    src : Text;
    caption : Text;
    rotation : Int;
    size : Nat;
    top : Nat;
    left : Nat;
    zIndex : Nat;
  };

  type OldCardContent = {
    letterText : Text;
    loveCards : [OldLoveCard];
    galleryPhotos : [OldGalleryPhoto];
    audioFileName : Text;
    uploadedImages : [Blob];
    uploadedAudio : [Blob];
  };

  type OldActor = {
    var content : ?OldCardContent;
  };

  // ── New types (matching main.mo declarations) ───────────────────────────────

  type NewLoveCard = {
    title : Text;
    description : Text;
    photos : [{ src : Text; rotation : Int }];
  };

  type NewGalleryPhoto = {
    src : Text;
    caption : Text;
    rotation : Int;
    size : Nat;
    top : Nat;
    left : Nat;
    zIndex : Nat;
  };

  type NewCardContentMeta = {
    letterText : Text;
    loveCards : [NewLoveCard];
    galleryPhotos : [NewGalleryPhoto];
    audioFileName : Text;
  };

  type NewActor = {
    var meta : ?NewCardContentMeta;
    images : List.List<Blob>;
    audioFiles : List.List<Blob>;
  };

  // ── Migration function ──────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    let (newMeta, imgs, auds) = switch (old.content) {
      case (null) { (null, List.empty<Blob>(), List.empty<Blob>()) };
      case (?c) {
        let m : NewCardContentMeta = {
          letterText = c.letterText;
          loveCards = c.loveCards;
          galleryPhotos = c.galleryPhotos;
          audioFileName = c.audioFileName;
        };
        let imgList = List.fromArray(c.uploadedImages);
        let audList = List.fromArray(c.uploadedAudio);
        (?m, imgList, audList);
      };
    };
    {
      var meta = newMeta;
      images = imgs;
      audioFiles = auds;
    };
  };
};
