import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  public type LoveReasonCard = {
    title : Text;
    description : Text;
  };

  public type PhotoCaptions = {
    berlinMuseum : Text;
    firstBerlinPhoto : Text;
    romeColosseum : Text;
    daughterPhotos : Text;
    winterGarden : Text;
    hamptonsNight : Text;
    graduation : Text;
  };

  public type CardContent = {
    loveLetter : Text;
    reasonCards : [LoveReasonCard];
    photoCaptions : PhotoCaptions;
  };

  let loveLetter = "Dear Karla, you are a truly amazing person and the light of my life. I love you because you are kind, caring and supportive. Thank you for everything!";

  let reasonCards : [LoveReasonCard] = [
    {
      title = "Intelligence";
      description = "Your intelligence and quick thinking never cease to impress me. Whether it\'s finding solutions to problems or learning new things, you always excel.";
    },
    {
      title = "Kindness";
      description = "You are incredibly caring and always put others before yourself. Your compassion and empathy for others truly make you a wonderful partner.";
    },
    {
      title = "Sense of Humor";
      description = "Your sense of humor is infectious. You can always make me laugh, even when I’m having a bad day.";
    },
  ];

  let photoCaptions : PhotoCaptions = {
    berlinMuseum = "Cuddly moment at the Berlin museum";
    firstBerlinPhoto = "Baby’s first Berlin photo";
    romeColosseum = "Unforgettable trip to Rome, Italy";
    daughterPhotos = "Our daughter throughout the seasons";
    winterGarden = "Having fun at the Winter Garden";
    hamptonsNight = "Beautiful night in the Hamptons";
    graduation = "Celebrating your graduation";
  };

  let cardContent = {
    loveLetter;
    reasonCards;
    photoCaptions;
  };

  public query ({ caller }) func getLoveLetter() : async Text {
    loveLetter;
  };

  public query ({ caller }) func getReasonCard(index : Nat) : async LoveReasonCard {
    if (index >= reasonCards.size()) { Runtime.trap("Index out of bounds") };
    reasonCards[index];
  };

  public query ({ caller }) func getAllReasonCards() : async [LoveReasonCard] {
    reasonCards;
  };

  public query ({ caller }) func getPhotoCaptions() : async PhotoCaptions {
    photoCaptions;
  };

  public query ({ caller }) func getCardContent() : async CardContent {
    cardContent;
  };
};
