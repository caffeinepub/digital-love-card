import Array "mo:core/Array";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

import MixinStorage "blob-storage/Mixin";


actor {
  include MixinStorage();

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

  public type CardContent = {
    letterText : Text;
    loveCards : [LoveCard];
    galleryPhotos : [GalleryPhoto];
    audioFileName : Text;
    uploadedImages : [Storage.ExternalBlob];
    uploadedAudio : [Storage.ExternalBlob];
  };

  // Default content function
  func defaultContent() : CardContent {
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
      uploadedImages = [];
      uploadedAudio = [];
    };
  };

  var content : ?CardContent = null;

  public shared ({ caller }) func getContent() : async CardContent {
    switch (content) {
      case (?existingContent) { existingContent };
      case (null) { defaultContent() };
    };
  };

  public shared ({ caller }) func saveContent(newContent : CardContent) : async () {
    content := ?newContent;
  };

  public shared ({ caller }) func addImage(blob : Storage.ExternalBlob) : async () {
    switch (content) {
      case (?existingContent) {
        let updatedImages = existingContent.uploadedImages.concat([blob]);
        let updatedContent = {
          existingContent with
          uploadedImages = updatedImages
        };
        content := ?updatedContent;
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func addAudio(blob : Storage.ExternalBlob) : async () {
    switch (content) {
      case (?existingContent) {
        let updatedAudio = existingContent.uploadedAudio.concat([blob]);
        let updatedContent = {
          existingContent with
          uploadedAudio = updatedAudio
        };
        content := ?updatedContent;
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func getImage(index : Nat) : async ?Storage.ExternalBlob {
    switch (content) {
      case (?existingContent) {
        if (index < existingContent.uploadedImages.size()) {
          ?existingContent.uploadedImages[index];
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func getAudio(index : Nat) : async ?Storage.ExternalBlob {
    switch (content) {
      case (?existingContent) {
        if (index < existingContent.uploadedAudio.size()) {
          ?existingContent.uploadedAudio[index];
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func replaceImage(index : Nat, blob : Storage.ExternalBlob) : async Bool {
    switch (content) {
      case (?existingContent) {
        if (index < existingContent.uploadedImages.size()) {
          let images = existingContent.uploadedImages.toVarArray();
          images[index] := blob;
          let updatedContent = {
            existingContent with
            uploadedImages = images.toArray();
          };
          content := ?updatedContent;
          true;
        } else {
          false;
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func replaceAudio(index : Nat, blob : Storage.ExternalBlob) : async Bool {
    switch (content) {
      case (?existingContent) {
        if (index < existingContent.uploadedAudio.size()) {
          let audioFiles = existingContent.uploadedAudio.toVarArray();
          audioFiles[index] := blob;
          let updatedContent = {
            existingContent with
            uploadedAudio = audioFiles.toArray();
          };
          content := ?updatedContent;
          true;
        } else {
          false;
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func listImages() : async [Storage.ExternalBlob] {
    switch (content) {
      case (?existingContent) { existingContent.uploadedImages };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func listAudio() : async [Storage.ExternalBlob] {
    switch (content) {
      case (?existingContent) { existingContent.uploadedAudio };
      case (null) { [] };
    };
  };
};
