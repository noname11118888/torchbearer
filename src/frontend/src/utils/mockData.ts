import { AboutSection, Article, AboutMediaSection, ArticleContent } from '@/declarations/backend/backend.did';

// Helper function to convert Date to bigint (nanoseconds)
const dateToBigint = (date: Date): bigint => {
  return BigInt(date.getTime()) * BigInt(1_000_000); // Convert milliseconds to nanoseconds
};

export const createMockAboutSection = (): AboutSection => ({
  introductoryHeading: "Doanh nghiệp Rượu Vang Torchbearer",
  mainDescription: "Với trang trại rượu được thành lập từ năm năm 1994, công ty rượu Người Cầm Đuốc được thành lập từ vùng rượu nổi tiếng thế giới – thung lũng sông Coal, thuộc tiểu bang Tasmania, Úc Đại Lợi. Trang trại rượu nhỏ 'ese được chăm sóc theo phương pháp thuần tự nhiên (zen farming), để cao và tôn trọng đất mẹ và sự kì diệu của quả nho hóa.",
  mediaSections: [
    {
      title: "Hành trình của chúng tôi",
      description: "Từ một trang trại nhỏ năm 1994, chúng tôi đã phát triển thành một thương hiệu rượu vang uy tín, luôn đặt chất lượng và sự tôn trọng thiên nhiên lên hàng đầu.",
      mediaUrl: "wine.jpg",
      mediaType: "1", // Text first, then image (stacked)
    },
    {
      title: "Bí quyết làm rượu",
      description: "Chúng tôi tin rằng rượu vang ngon bắt nguồn từ những trái nho được chăm sóc tỉ mỉ và quy trình ủ rượu truyền thống kết hợp với công nghệ hiện đại.",
      mediaUrl: "/assets/image.png",
      mediaType: "2", // Text right, image left
    },
    {
      title: "Vùng đất Tasmania",
      description: "Thung lũng sông Coal với khí hậu mát mẻ và thổ nhưỡng phong phú là nơi lý tưởng để tạo ra những chai rượu vang có hương vị độc đáo.",
      mediaUrl: "https://picsum.photos/id/1015/800/600", // External image example
      mediaType: "3", // Text left, image right
    },
    {
      title: "Sự kiện và Trải nghiệm",
      description: "Tham gia cùng chúng tôi trong các sự kiện nếm thử rượu vang và khám phá vẻ đẹp của trang trại rượu Torchbearer.",
      mediaUrl: "https://picsum.photos/id/1080/1200/500", // Full-width image example
      mediaType: "4", // Full-width with overlay
    },
    {
      title: "Cam kết về Chất lượng",
      description: "Mỗi chai rượu vang Torchbearer là sự kết hợp của niềm đam mê, sự cống hiến và cam kết mang đến trải nghiệm tuyệt vời nhất cho khách hàng.",
      mediaUrl: "https://picsum.photos/id/1025/1200/500", // Full-width image example
      mediaType: "5", // Image with text overlay (centered)
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
