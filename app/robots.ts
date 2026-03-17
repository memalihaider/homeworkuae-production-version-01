import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/employee/",
        ],
      },
      {
        // Block AI scrapers from crawling the site
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: "/",
      },
    ],
    sitemap: "https://www.homeworkuae.com/sitemap.xml",
    host: "https://www.homeworkuae.com",
  };
}
