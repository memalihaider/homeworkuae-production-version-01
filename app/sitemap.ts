import { MetadataRoute } from "next";
import { INITIAL_BLOG_POSTS } from "@/lib/blog-data";

const SITE_URL = "https://www.homeworkuae.com";

const staticRoutes: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { url: "/",                                    priority: 1.0,  changeFrequency: "weekly" },
  { url: "/services",                            priority: 0.95, changeFrequency: "weekly" },
  { url: "/services/villa-deep-cleaning",        priority: 0.95, changeFrequency: "monthly" },
  { url: "/services/ac-duct-cleaning",           priority: 0.95, changeFrequency: "monthly" },
  { url: "/services/residential-cleaning",       priority: 0.95, changeFrequency: "monthly" },
  { url: "/services/kitchen-deep-cleaning",      priority: 0.9,  changeFrequency: "monthly" },
  { url: "/services/office-deep-cleaning",       priority: 0.9,  changeFrequency: "monthly" },
  { url: "/services/office-cleaning",            priority: 0.85, changeFrequency: "monthly" },
  { url: "/services/post-construction-cleaning", priority: 0.85, changeFrequency: "monthly" },
  { url: "/services/sofa-deep-cleaning",         priority: 0.8,  changeFrequency: "monthly" },
  { url: "/services/curtain-cleaning",           priority: 0.8,  changeFrequency: "monthly" },
  { url: "/services/carpets-deep-cleaning",      priority: 0.8,  changeFrequency: "monthly" },
  { url: "/services/window-cleaning",            priority: 0.8,  changeFrequency: "monthly" },
  { url: "/services/apartment-deep-cleaning",    priority: 0.8,  changeFrequency: "monthly" },
  { url: "/services/move-in-out-cleaning",       priority: 0.8,  changeFrequency: "monthly" },
  { url: "/services/gym-deep-cleaning",          priority: 0.75, changeFrequency: "monthly" },
  { url: "/services/water-tank-cleaning",        priority: 0.75, changeFrequency: "monthly" },
  { url: "/services/swimming-pool-cleaning",     priority: 0.75, changeFrequency: "monthly" },
  { url: "/services/floor-deep-cleaning",        priority: 0.75, changeFrequency: "monthly" },
  { url: "/services/grout-deep-cleaning",        priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/mattress-deep-cleaning",     priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/facade-cleaning",            priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/garage-deep-cleaning",       priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/balcony-deep-cleaning",      priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/grease-trap-cleaning",       priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/restaurant-cleaning",        priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/kitchen-hood-cleaning",      priority: 0.7,  changeFrequency: "monthly" },
  { url: "/services/ac-coil-cleaning",           priority: 0.7,  changeFrequency: "monthly" },
  { url: "/about",                               priority: 0.8,  changeFrequency: "monthly" },
  { url: "/contact",                             priority: 0.8,  changeFrequency: "monthly" },
  { url: "/pricing",                             priority: 0.75, changeFrequency: "weekly" },
  { url: "/faqs",                                priority: 0.7,  changeFrequency: "monthly" },
  { url: "/testimonials",                        priority: 0.65, changeFrequency: "monthly" },
  { url: "/blog",                                priority: 0.7,  changeFrequency: "weekly" },
  { url: "/book-service",                        priority: 0.75, changeFrequency: "monthly" },
  { url: "/quote",                               priority: 0.75, changeFrequency: "monthly" },
  { url: "/careers",                             priority: 0.5,  changeFrequency: "monthly" },
  { url: "/privacy-policy",                      priority: 0.3,  changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const blogEntries = INITIAL_BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
