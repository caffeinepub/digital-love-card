import List "mo:core/List";
import Migration "migration";

(with migration = Migration.run)
actor {

  public type LoveCard = {
    title : Text;
    description : Text;
    photos : [{ src : Text; rotation : Int }];
  };

  public type GalleryPhoto = {
    src : Text;
    caption : Text;
    rotation : Int;
    size : Nat;
    top : Nat;
    left : Nat;
    zIndex : Nat;
  };

  // Metadata only — no blobs stored here
  public type CardContentMeta = {
    letterText : Text;
    loveCards : [LoveCard];
    galleryPhotos : [GalleryPhoto];
    audioFileName : Text;
  };

  // Public API type (with blob fields for backward compat with frontend)
  public type CardContent = {
    letterText : Text;
    loveCards : [LoveCard];
    galleryPhotos : [GalleryPhoto];
    audioFileName : Text;
    uploadedImages : [Blob];
    uploadedAudio : [Blob];
  };

  // Metadata storage (no blobs — persists via enhanced orthogonal persistence)
  var meta : ?CardContentMeta = null;

  // Separate blob storage — blobs never go through saveContent
  let images : List.List<Blob> = List.empty<Blob>();
  let audioFiles : List.List<Blob> = List.empty<Blob>();

  func defaultMeta() : CardContentMeta {
    {
      letterText = "Write your love letter here…";
      loveCards = [
        {
          title = "The Way You Care";
          description = "Write your description here…";
          photos = [];
        },
        {
          title = "Your Smile";
          description = "Write your description here…";
          photos = [];
        },
        {
          title = "How You Hold Me";
          description = "Write your description here…";
          photos = [];
        },
      ];
      galleryPhotos = [];
      audioFileName = "";
    };
  };

  public shared func getContent() : async CardContent {
    let m = switch (meta) {
      case (?m) { m };
      case (null) { defaultMeta() };
    };
    {
      letterText = m.letterText;
      loveCards = m.loveCards;
      galleryPhotos = m.galleryPhotos;
      audioFileName = m.audioFileName;
      uploadedImages = images.toArray();
      uploadedAudio = audioFiles.toArray();
    };
  };

  // Save only metadata — ignore uploadedImages/uploadedAudio from payload
  public shared func saveContent(newContent : CardContent) : async () {
    meta := ?{
      letterText = newContent.letterText;
      loveCards = newContent.loveCards;
      galleryPhotos = newContent.galleryPhotos;
      audioFileName = newContent.audioFileName;
    };
  };

  public shared func addImage(blob : Blob) : async () {
    images.add(blob);
  };

  public shared func addAudio(blob : Blob) : async () {
    audioFiles.add(blob);
  };

  public shared func getImage(index : Nat) : async ?Blob {
    if (index >= images.size()) return null;
    ?images.at(index);
  };

  public shared func getAudio(index : Nat) : async ?Blob {
    if (index >= audioFiles.size()) return null;
    ?audioFiles.at(index);
  };

  public shared func replaceImage(index : Nat, blob : Blob) : async Bool {
    if (index >= images.size()) return false;
    images.put(index, blob);
    true;
  };

  public shared func replaceAudio(index : Nat, blob : Blob) : async Bool {
    if (index >= audioFiles.size()) return false;
    audioFiles.put(index, blob);
    true;
  };

  public shared func listImages() : async [Blob] {
    images.toArray();
  };

  public shared func listAudio() : async [Blob] {
    audioFiles.toArray();
  };
};
