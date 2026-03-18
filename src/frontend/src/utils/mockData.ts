import { AboutSection, Article, AboutMediaSection, ArticleContent } from '@/declarations/backend/backend.did';

// Helper function to convert Date to bigint (nanoseconds)
const dateToBigint = (date: Date): bigint => {
  return BigInt(date.getTime()) * BigInt(1_000_000); // Convert milliseconds to nanoseconds
};

export const createMockAboutSection = (): AboutSection => ({
  introductoryHeading: "Torch Bearer Biodynamic wine of Tasmania",
  mainDescription: "Torch Bearer is making wines on the land of the Mumirimina people of the nipaluna Nation, where our vines have been planted since 1993. We acknowledge the ongoing effects of colonisation and how it changes the soil, the environment, and in turn the foods and wines we eat today. We pay our respects to the elders past and present, it always was and always will be Aboriginal land. In making a product that makes sense of our place and our time on planet earth. Torch Bearer - in building our name we think a century ahead. We are the Pathfinder, producing drinks from extreme terroirs where a balanced and harmonious drinks are handcrafted for a finer vision of flavours - natural, regenerative, and wholesome for wellbeing. Torch Bearer Wines products represent three hallmarks: the fineness of Wine, People, and Planet. We create a product that’s pleasurable to drink, bring people together, and a good stewardship of our community and the planet.",
  mediaSections: [
    {
      title: "Kinship with ngurra (country)",
      description: "Respect, conserve, and regenerate the natural environment, biodiversity, and the communities where we live and operate.",
      mediaUrl: "https://picsum.photos/id/1016/800/600",
      mediaType: { 'Image': null }, // Assuming variant type
    },
    {
      title: "Craftsmanship",
      description: "We apply our minds and hands in the making of our products to achieve unique individuality and quality characteristics at every aspect of the business. Crafted wines of Purity, Precision, & Depth of flavours.",
      mediaUrl: "https://picsum.photos/id/1028/800/600",
      mediaType: { 'Image': null },
    },
    {
      title: "Integrity",
      description: "Always have the courage to act and do the right things for our people, our customers, our community and the planet Earth.",
      mediaUrl: "https://picsum.photos/id/1031/800/600",
      mediaType: { 'Image': null },
    },
    {
      title: "Entrepreneurship",
      description: "Our disciplined entrepreneurship is to nurture an ecosystem of work and partnership for creativity- constantly creating values, superior values in the marketplace through innovation with the least resources utilised in a viscous cycle of constant improvement and transformation for growth.",
      mediaUrl: "https://picsum.photos/id/1033/800/600",
      mediaType: { 'Image': null },
    },
    {
      title: "Openness",
      description: "Being open allows communication, ideas, and information to be shared seamlessly without friction and walls hence new knowledge and innovations to thrive.",
      mediaUrl: "https://picsum.photos/id/1035/800/600",
      mediaType: { 'Image': null },
    },
    {
      title: "Interdisciplinary collaboration",
      description: "Smart solutions come from interdisciplinary team.",
      mediaUrl: "https://picsum.photos/id/1036/800/600",
      mediaType: { 'Image': null },
    },
  ],
});

export const createMockArticleContent = (type: "text" | "image" | "video", title?: string, description?: string, mediaUrl?: string): ArticleContent => {
  if (type === "image") {
    return {
      title: title || "Tiêu đề hình ảnh giả lập",
      description: description || "Mô tả hình ảnh giả lập.",
      mediaUrl: mediaUrl || "https://picsum.photos/id/" + Math.floor(Math.random() * 100 + 10) + "/800/500",
      mediaType: "image",
    };
  } else if (type === "video") {
    return {
      title: title || "Tiêu đề video giả lập",
      description: description || "Mô tả video giả lập.",
      mediaUrl: mediaUrl || "https://www.w3schools.com/html/mov_bbb.mp4", // Example public MP4
      mediaType: "video",
    };
  } else {
    return {
      title: title || "",
      description: description || "Đây là một đoạn văn bản giả lập cho bài viết. Nó chứa đựng những thông tin hữu ích và thú vị về thế giới rượu vang, lịch sử của thương hiệu Torchbearer, hoặc các mẹo chọn rượu phù hợp. Mục đích là để lấp đầy không gian và hiển thị cách nội dung văn bản sẽ được trình bày. " + (Math.random() > 0.5 ? "Chúng tôi luôn nỗ lực mang đến những giá trị tốt nhất cho khách hàng, từ khâu trồng nho, ủ rượu cho đến khi sản phẩm đến tay bạn." : "Thung lũng sông Coal là một trong những vùng sản xuất rượu vang nổi tiếng nhất ở Tasmania, với khí hậu độc đáo và đất đai màu mỡ tạo ra những trái nho chất lượng cao."),
      mediaUrl: "",
      mediaType: "text",
    };
  }
};

export const createMockArticle = (id: number): Article => {
  const publishTime = new Date(Date.now() - (id * 24 * 60 * 60 * 1000)); // Older articles have smaller IDs
  const updateTime = new Date(publishTime.getTime() + (12 * 60 * 60 * 1000)); // Updated 12 hours later

  return {
    id: BigInt(id),
    title: `Bài viết giả lập về Rượu vang số ${id}`,
    content: [
      createMockArticleContent("text", "", `Chào mừng đến với bài viết chi tiết số ${id}.`),
      createMockArticleContent("image", "Vườn nho xanh mướt", "Khám phá vẻ đẹp của vườn nho Torchbearer vào mùa vụ."),
      createMockArticleContent("text", "Lịch sử hình thành", "Torchbearer được thành lập với tầm nhìn tạo ra những chai rượu vang độc đáo, phản ánh tinh hoa của vùng đất Tasmania."),
      createMockArticleContent("video", "Quy trình sản xuất", "Video giới thiệu tổng quan về quy trình sản xuất rượu vang của chúng tôi."),
      createMockArticleContent("text", "Giải thưởng và Công nhận", "Trong những năm qua, chúng tôi đã nhận được nhiều giải thưởng danh giá, khẳng định chất lượng sản phẩm và uy tín thương hiệu."),
      createMockArticleContent("image", "Hầm rượu cổ điển", "Hình ảnh hầm rượu nơi những chai vang quý được ủ kỹ lưỡng."),
      createMockArticleContent("text", "Tương lai của Torchbearer", "Chúng tôi không ngừng đổi mới và sáng tạo để mang đến những sản phẩm rượu vang tốt nhất cho người yêu rượu trên toàn thế giới."),
    ],
    publishTime: dateToBigint(publishTime),
    updateTime: dateToBigint(updateTime),
  };
};

export const createMockArticleList = (count: number = 5): Article[] => {
  const articles: Article[] = [];
  for (let i = 1; i <= count; i++) {
    articles.push(createMockArticle(i));
  }
  return articles;
};

// User Profile
export const createMockUserProfile = (): UserProfile => ({
  userName: "Mock User",
  userEmail: "mock.user@example.com",
  userPhone: "123-456-7890",
  userAddress: "123 Mock Street, Mock City",
  isAdmin: false,
});

// ContentSection (for Hero and Header)
export const createMockContentSection = (title: string, description: string, mediaUrl: string): ContentSection => ({
  title: title,
  description: description,
  mediaUrl: mediaUrl,
  mediaType: { 'image': null }, // Corrected type for mediaType
});

// FooterData
export const createMockFooterData = (): FooterData => ({
  logoUrl: "/assets/logo-footer.png",
  description: "Torch Bearer is making wines on the land of the Mumirimina people of the nipaluna Nation, where our vines have been planted since 1993. We acknowledge the ongoing effects of colonisation and how it changes the soil, the environment, and in turn the foods and wines we eat today. We pay our respects to the elders past and present, it always was and always will be Aboriginal land.",
  contactEmail: "contact@torchbearerwine.com",
  contactPhone: "+61 469 440 995",
  address: "1013-1015 Tea Tree Road, Tea Tree, TAS 7017, Australia",
  socialLinks: [
    { title: "Facebook", url: "https://facebook.com/torchbearer", iconClass: "fab fa-facebook-f" },
    { title: "Instagram", url: "https://instagram.com/torchbearer", iconClass: "fab fa-instagram" },
    // Add more social links if found on the website
  ],
});

// TeamMember
export const createMockTeamMember = (id: number): TeamMember => {
  const bios = [
    "Đam mê với tinh thần 'Kinship with ngurra (country)', luôn nỗ lực bảo tồn và tái tạo môi trường tự nhiên.",
    "Là một 'Craftsmanship' đích thực, tỉ mỉ trong từng công đoạn sản xuất để đạt được chất lượng và sự độc đáo.",
    "Luôn hành động với 'Integrity', đặt lợi ích của con người, khách hàng, cộng đồng và hành tinh lên hàng đầu.",
    "Tinh thần 'Entrepreneurship' thúc đẩy sự sáng tạo và đổi mới liên tục để tạo ra giá trị vượt trội.",
    "Thúc đẩy 'Openness' trong giao tiếp, ý tưởng để nuôi dưỡng tri thức và sự đổi mới.",
    "Tin tưởng vào 'Interdisciplinary collaboration' để tìm kiếm các giải pháp thông minh và toàn diện.",
  ];
  return {
    id: BigInt(id),
    name: `Thành viên ${id}`,
    role: id % 2 === 0 ? "Winemaker" : "CEO",
    bio: bios[(id - 1) % bios.length],
    imageUrl: `https://picsum.photos/id/${1060 + id}/200/200`,
  };
};

export const createMockTeamMembers = (count: number = 3): TeamMember[] => {
  const members: TeamMember[] = [];
  for (let i = 1; i <= count; i++) {
    members.push(createMockTeamMember(i));
  }
  return members;
};

// Product
export const createMockProduct = (id: number): Product => ({
  id: BigInt(id),
  name: `Rượu Vang Đỏ Cao Cấp ${id}`,
  description: `Đây là mô tả chi tiết cho sản phẩm rượu vang số ${id}. Một loại rượu hảo hạng với hương vị đậm đà và hậu vị kéo dài.`,
  price: BigInt(Math.floor(Math.random() * 1000000) + 200000), // 200k - 1.2M VND
  imageUrl: `https://picsum.photos/id/${200 + id}/400/600`,
  category: "Wine",
  stock: BigInt(Math.floor(Math.random() * 100) + 10),
  isOnSale: id % 3 === 0,
  oldPrice: id % 3 === 0 ? [BigInt(Math.floor(Math.random() * 500000) + 1500000)] : [], // 1.5M - 2M VND
  createdAt: dateToBigint(new Date()),
  updatedAt: dateToBigint(new Date()),
});

export const createMockProductList = (count: number = 5): [bigint, Product][] => {
  const products: [bigint, Product][] = [];
  for (let i = 1; i <= count; i++) {
    const product = createMockProduct(i);
    products.push([product.id, product]);
  }
  return products;
};

// IconLink
export const createMockIconLink = (id: number): IconLink => ({
  id: BigInt(id),
  title: `Link nhanh ${id}`,
  url: `https://example.com/link-${id}`,
  icon: id % 2 === 0 ? "facebook" : "instagram", // Changed from iconClass to icon, and simplified name
  order: BigInt(id),
});

export const createMockIconLinks = (count: number = 4): IconLink[] => {
  const links: IconLink[] = [];
  for (let i = 1; i <= count; i++) {
    links.push(createMockIconLink(i));
  }
  return links;
};

// MediaItem
export const createMockMediaItem = (id: number): MediaItem => ({
  id: BigInt(id),
  url: `https://picsum.photos/id/${Math.floor(Math.random() * 100 + 10)}/1000/700`,
  caption: `Thư viện ảnh ${id}`,
  description: `Mô tả chi tiết cho ảnh ${id} trong bộ sưu tập media.`,
  mediaType: { 'image': null }, // Corrected type for mediaType
  createdAt: dateToBigint(new Date()),
  updatedAt: dateToBigint(new Date()),
});

export const createMockMediaItems = (count: number = 6): MediaItem[] => {
  const items: MediaItem[] = [];
  for (let i = 1; i <= count; i++) {
    items.push(createMockMediaItem(i));
  }
  return items;
};

// ContactLocation
export const createMockContactLocation = (id: number): ContactLocation => ({
  id: BigInt(id),
  name: id === 1 ? "Trụ sở chính Torchbearer" : `Chi nhánh ${id - 1}`,
  address: `${id * 10} Lê Lợi, Quận 1, TP.HCM`,
  phone: `+84 9${id} 123 456`,
  email: `contact${id}@torchbearer.com`,
  mapUrl: `https://maps.google.com/?q=${id * 10}+Le+Loi`,
  isHeadOffice: id === 1,
});

export const createMockContactLocations = (count: number = 2): ContactLocation[] => {
  return [
    {
      id: BigInt(1),
      name: "Australia Headquarter",
      address: "1013-1015 Tea Tree Road, Tea Tree, TAS 7017, Australia",
      phone: "+61 469 440 995",
      email: "contact@torchbearerwine.com",
      mapUrl: "https://www.google.com/maps/place/1013-1015+Tea+Tree+Rd,+Tea+Tree+TAS+7017,+Australia",
      isHeadOffice: true,
    },
    {
      id: BigInt(2),
      name: "Vietnam Office - Hanoi",
      address: "16/C9, Mac Thai Tong, Nam Trung Yen, Cau Giay, Hanoi",
      phone: "+84 915668968",
      email: "vietnam@torchbearerwine.com",
      mapUrl: "https://www.google.com/maps/place/16+C9+M%E1%BA%A1c+Th%C3%A1i+T%C3%B4ng,+Nam+Trung+Y%C3%AAn,+C%E1%BA%A7u+Gi%E1%BA%A5y,+H%C3%A0+N%E1%BB%99i,+Vi%E1%BB%87t+Nam",
      isHeadOffice: false,
    },
  ];
};

// FloatingBubbleConfig
export const createMockFloatingBubbleConfig = (): FloatingBubbleConfig => ({
  isEnabled: true,
  buttonText: "Hỗ trợ",
  primaryColor: "#A52A2A", // Brown
  secondaryColor: "#FFFFFF",
  icon: "comment-dots", // Changed from iconClass to icon, and simplified to just the name for getIconComponent
  links: [
    { title: "Zalo", url: "https://zalo.me/yourid", icon: "phone" }, // Simplified icon name
    { title: "Messenger", url: "https://m.me/yourpage", icon: "facebook" }, // Simplified icon name
    { title: "Gọi điện", url: "tel:+84987654321", icon: "phone" }, // Simplified icon name
  ],
});

// Category
export const createMockCategory = (id: number): Category => ({
  id: BigInt(id),
  name: `Loại sản phẩm ${id}`,
  description: `Mô tả cho loại sản phẩm số ${id}.`,
  order: BigInt(id),
  imageUrl: `https://picsum.photos/id/${300 + id}/300/200`,
});

export const createMockCategories = (count: number = 4): Category[] => {
  const categories: Category[] = [];
  for (let i = 1; i <= count; i++) {
    categories.push(createMockCategory(i));
  }
  return categories;
};

// CustomerMessage
export const createMockCustomerMessage = (id: number): CustomerMessage => ({
  id: BigInt(id),
  customerName: `Khách hàng ${id}`,
  customerEmail: `customer${id}@example.com`,
  customerPhone: `090${id % 10}123456`,
  subject: `Về đơn hàng #${1000 + id}`,
  message: `Nội dung tin nhắn từ khách hàng số ${id} liên quan đến một vấn đề hoặc câu hỏi về sản phẩm.`,
  isRead: id % 3 === 0,
  createdAt: dateToBigint(new Date(Date.now() - (id * 3600 * 1000))), // Older messages have smaller IDs
});

export const createMockCustomerMessages = (count: number = 5): [bigint, CustomerMessage][] => {
  const messages: [bigint, CustomerMessage][] = [];
  for (let i = 1; i <= count; i++) {
    const msg = createMockCustomerMessage(i);
    messages.push([msg.id, msg]);
  }
  return messages;
};

// AdminEntry
export const createMockAdminEntry = (id: number): AdminEntry => ({
  principalId: `aaaaa-aa${id}-aaaaa-aaaaa-cai`, // Example principal ID
  addedAt: dateToBigint(new Date()),
});

export const createMockAdminEntries = (count: number = 2): AdminEntry[] => {
  const admins: AdminEntry[] = [];
  for (let i = 1; i <= count; i++) {
    admins.push(createMockAdminEntry(i));
  }
  return admins;
};

// OrderStatus
const orderStatuses: OrderStatus[] = [
  { 'Pending': null },
  { 'Processing': null },
  { 'Shipped': null },
  { 'Delivered': null },
  { 'Cancelled': null },
];

const getRandomOrderStatus = (): OrderStatus => {
  return orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
};

// CartItem (used within Order)
const createMockCartItem = (productId: bigint): CartItem => ({
  productId: productId,
  quantity: BigInt(Math.floor(Math.random() * 3) + 1), // 1-3 items
});

// Order
export const createMockOrder = (id: number): Order => {
  const items: CartItem[] = [
    createMockCartItem(BigInt(Math.floor(Math.random() * 5) + 1)),
    createMockCartItem(BigInt(Math.floor(Math.random() * 5) + 1)),
  ];
  return {
    id: BigInt(id),
    customerName: `Khách hàng đặt hàng ${id}`,
    customerEmail: `order${id}@example.com`,
    customerPhone: `090${id % 10}789012`,
    items: items,
    totalPrice: BigInt(items.reduce((sum, item) => sum + Number(createMockProduct(Number(item.productId)).price) * Number(item.quantity), 0)),
    status: getRandomOrderStatus(),
    createdAt: dateToBigint(new Date(Date.now() - (id * 2 * 24 * 60 * 60 * 1000))), // Older orders
    updatedAt: dateToBigint(new Date()),
  };
};

export const createMockOrders = (count: number = 5): [bigint, Order][] => {
  const orders: [bigint, Order][] = [];
  for (let i = 1; i <= count; i++) {
    const order = createMockOrder(i);
    orders.push([order.id, order]);
  }
  return orders;
};

// Product Price Visibility
export const createMockProductPriceVisibility = (isVisible: boolean = true): boolean => isVisible;

