import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  
  // Добавляем кастомные заголовки
  async headers() {
    return [
      {
        // Ловим все файлы с расширениями шрифтов в папке public
        source: "/:path*.(woff|woff2|ttf|eot|otf)",
        headers: [
          {
            key: "Cache-Control",
            // 31536000 секунд = 1 год. 
            // immutable говорит браузеру: "Даже не проверяй, изменился ли файл, он вечный"
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;