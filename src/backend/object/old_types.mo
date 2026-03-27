import Map "mo:core/Map";
import Text "mo:core/Text";

module {

  public type IconLink = {
    id : Nat;
    icon : Text;
    link : Text;
  };

  public type MediaItem = {
    id : Nat;
    url : Text;
    caption : Text;
    description : Text;
    uploadTimestamp : Int;
    mediaType : Text;
  };

  public type Category = {
    id : Nat;
    name : Text;
  };

  public type TastingNote = {
    name : Text;
    imageUrl : Text;
    description : Text;
  };

  public type PairingFood = {
    name : Text;
    imageUrl : Text;
    description : Text;
  };

  public type FlavorProfile = {
    name : Text;
    value : Float;
  };

  public type ProductInfo = {
    name : Text;
    value : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : Text;
    price : Nat;
    categories : [Category];
    tasting : [TastingNote];
    paring : [PairingFood];
    profile : [FlavorProfile];
    info : [ProductInfo];
    isHighlighted : Bool;
    classificationTag : ProductInfo;
  };

  public type CartItem = {
    product : Product;
    quantity : Nat;
  };

  public type OrderItem = {
    product : Product;
    quantity : Nat;
    totalPrice : Nat;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    customerPhone : Text;
    items : [OrderItem];
    totalAmount : Nat;
    timestamp : Int;
    status : OrderStatus;
    note : Text;
  };

  public type OrderList = {
    id : [Nat];
  };

  public type OrderStatus = {
    #pending;
    #completed;
    #cancelled;
  };

  public type ContactLocation = {
    id : Nat;
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
    mapUrl : Text;
    isHeadOffice : Bool;
  };

  public type UserProfile = {
    id : Nat;
    name : Text;
    principal : Text;
    email : Text;
    role : Text;
  };

  public type FloatingBubbleConfig = {
    backgroundColor : Text;
    icon : Text;
    hotlineNumberOverride : Text;
    isEnabled : Bool;
  };

  // public type ProcessStep = {
  //   stepTitle : Text;
  //   description : Text;
  //   mediaUrl : Text;
  // };

  public type TeamMember = {
    id : Nat;
    name : Text;
    role : Text;
    imageUrl : Text;
    bio : Text;
  };

  public type CustomerMessage = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };

  public type Article = {
    id : Nat;
    title : Text;
    publishTime : Int;
    updateTime : Int;
    content : [ArticleContent];
  };

  public type ArticleContent = {
    title : Text;
    description : Text;
    mediaUrl : Text;
    mediaType : Text;
  };

  public type AboutMediaSection = {
    title : Text;
    description : Text;
    mediaUrl : Text;
    mediaType : Text;
  };

  public type AboutSection = {
    introductoryHeading : Text;
    mainDescription : Text;
    mediaSections : [AboutMediaSection];
    // processSteps : [ProcessStep];
    // teamMembers : [TeamMember];
  };

  public type ContentSection = {
    title : Text;
    content : Text;
    mediaUrl : Text;
  };

  public type FooterData = {
    copyright : Text;
    links : [Text];
    socialMedia : [Text];
  };

  public type SerializableAdminCMSData = {
    header : ContentSection;
    footer : FooterData;
    iconLinks : [IconLink];
    heroSection : ContentSection;
    aboutSection : ContentSection;
    products : [Product];
    // processSteps : [ProcessStep];
    teamMembers : [TeamMember];
    media : [MediaContent];
    contacts : [ContactLocation];
    floatingBubbleConfig : FloatingBubbleConfig;
  };
  

  public type AdminCMSData = {
    header : ContentSection;
    footer : FooterData;
    iconLinks : [IconLink];
    heroSection : ContentSection;
    aboutSection : ContentSection;
    products : Map.Map<Nat, Product>;
    // processSteps : [ProcessStep];
    teamMembers : [TeamMember];
    contacts : [ContactLocation];
    media : [MediaContent];
  };

  public type AdminEntry = {
    principalId : Text;
  };

  public type MediaContent = {
    url : Text;
    mediaType : Text;
  };

  public type Actor = {
    nextMessageId : Nat;
    nextMediaId : Nat;
    nextOrderId : Nat;
    nextProductId : Nat;
    nextCategoryId : Nat;
    nextContactId : Nat;
    nextUserId : Nat;
    nextTeamMemberId : Nat;
    nextIconLinkId : Nat;
    nextArticleId: Nat;

    showProductPrices : Bool;
    
    userProfiles : Map.Map<Principal, UserProfile>;
    categories : Map.Map<Nat, Category>;
    products : Map.Map<Nat, Product>;
    orders : Map.Map<Nat, Order>;
    customerMessages : Map.Map<Nat, CustomerMessage>;
    mediaItems : Map.Map<Nat, MediaItem>;
    contentSections : Map.Map<Text, ContentSection>;
    iconLinks : Map.Map<Nat, IconLink>;

    floatingBubbleConfig : FloatingBubbleConfig;
    footerData : FooterData;
    aboutSection : AboutSection;

    articles : Map.Map<Nat, Article>;
    userOrders : Map.Map<Principal, OrderList>;

    teams : Map.Map<Nat, TeamMember>;
    contacts : Map.Map<Nat, ContactLocation>;
  };
};