import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Option "mo:core/Option";
import AdminCMS "admin-cms";
import New "object/types";
import Old "object/old_types";


module {

  public func run(old : Old.Actor) : New.Actor {

    {
      nextMessageId = old.nextMessageId;
      nextMediaId = old.nextMediaId;
      nextOrderId = old.nextOrderId;
      nextProductId = old.nextProductId;
      nextCategoryId = old.nextCategoryId;
      nextContactId = old.nextContactId;
      nextUserId = old.nextUserId;
      nextTeamMemberId = old.nextTeamMemberId;
      nextIconLinkId = old.nextIconLinkId;
      nextArticleId = old.nextArticleId;
      nextStockistId = old.nextStockistId;

      showProductPrices = old.showProductPrices;
      // userProfiles = old.userProfiles; // Assuming no changes needed
      userProfiles = Map.map<Principal, Old.UserProfile, New.UserProfile>(old.userProfiles, func (k : Principal, x1 : Old.UserProfile) : New.UserProfile {
        x1
      });
      // categories = old.categories; // Assuming no changes needed
      categories = Map.map<Nat, Old.Category, New.Category>(old.categories, func (k : Nat, x1 : Old.Category) : New.Category {
        x1
      });
      // products = old.products; // Assuming no changes needed
      products = Map.map<Nat, Old.Product, New.Product>(old.products, func (k : Nat, x1 : Old.Product) : New.Product {
        x1
      });
      // orders = old.orders; // Assuming no changes needed
      orders = Map.map<Nat, Old.Order, New.Order>(old.orders, func (k : Nat, x1 : Old.Order) : New.Order {
        x1
      });
      // customerMessages = old.customerMessages; // Assuming no changes needed
      customerMessages = Map.map<Nat, Old.CustomerMessage, New.CustomerMessage>(old.customerMessages, func (k : Nat, x1 : Old.CustomerMessage) : New.CustomerMessage {
        x1
      });
      // mediaItems = old.mediaItems; // Assuming no changes needed
      mediaItems = Map.map<Nat, Old.MediaItem, New.MediaItem>(old.mediaItems, func (k : Nat, x1 : Old.MediaItem) : New.MediaItem {
        x1
      });
      // contentSections = old.contentSections; // Assuming no changes needed
      contentSections = Map.map<Text, Old.ContentSection, New.ContentSection>(old.contentSections, func (k : Text, x1 : Old.ContentSection) : New.ContentSection {
        x1
      });
      // iconLinks = old.iconLinks; // Assuming no changes needed
      iconLinks = Map.map<Nat, Old.IconLink, New.IconLink>(old.iconLinks, func (k : Nat, x1 : Old.IconLink) : New.IconLink {
        x1
      });

      floatingBubbleConfig = {
        backgroundColor = old.floatingBubbleConfig.backgroundColor;
        icon = old.floatingBubbleConfig.icon;
        hotlineNumberOverride = old.floatingBubbleConfig.hotlineNumberOverride;
        isEnabled = old.floatingBubbleConfig.isEnabled;
      };
      footerData = old.footerData; // Assuming no changes needed
      aboutSection = {
        introductoryHeading = old.aboutSection.introductoryHeading;
        mainDescription = old.aboutSection.mainDescription;
        mediaSections = old.aboutSection.mediaSections;
      };

      // articles = old.articles;
      articles = Map.map<Nat, Old.Article, New.Article>(old.articles, func (k : Nat, x1 : Old.Article) : New.Article {
        x1
      });
      // userOrders = old.userOrders;
      userOrders = Map.map<Principal, Old.OrderList, New.OrderList>(old.userOrders, func (k : Principal, x1 : Old.OrderList) : New.OrderList {
        x1
      });
      // teams = old.teams;
      teams = Map.map<Nat, Old.TeamMember, New.TeamMember>(old.teams, func (k : Nat, x1 : Old.TeamMember) : New.TeamMember {
        x1
      });
      // contacts = old.contacts;
      contacts = Map.map<Nat, Old.ContactLocation, New.ContactLocation>(old.contacts, func (k : Nat, x1 : Old.ContactLocation) : New.ContactLocation {
        x1
      });
      // Map.empty<Nat, New.StockistRegion>();
      stockists = Map.map<Nat, Old.StockistRegion, New.StockistRegion>(old.stockists, func (k : Nat, x1 : Old.StockistRegion) : New.StockistRegion {
        x1
        // {x1 with location = ""}
      });
    };
  };
};
