import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getBlogPosts } from "@/lib/blogStore";
import type { BlogPost } from "@/data/blogPosts";
import { useI18n, translations } from "@/lib/i18n";

const INITIAL_COUNT = 3;
const MORE_COUNT = 3;
const MAX_BLOG_DESC_CHARS = 170;

const truncateText = (text: string, maxChars: number) => {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`;
};

export const BlogSection = () => {
  const { lang } = useI18n();
  const t = translations[lang];
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await getBlogPosts(lang);
      if (mounted) {
        setAllPosts(data);
        setVisibleCount(INITIAL_COUNT);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [lang]);
  const posts = useMemo(() => allPosts.slice(0, visibleCount), [allPosts, visibleCount]);
  const canShowMore = visibleCount < allPosts.length;

  return (
    <section id="blog" className="py-16 bg-transparent scroll-mt-12 md:scroll-mt-14">
      <div className="container px-4 mx-auto container-mobile-right-edge">
      <div className="mb-12 text-center animate-fade-in">
        <h2 className="font-bold mb-4 text-foreground md:text-5xl text-3xl">
          {t.blog.title}
        </h2>
        <p className="text-base text-muted-foreground md:text-xl max-w-3xl mx-auto">
          {t.blog.subtitle}
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group flex h-full min-h-[320px] flex-col gap-2 overflow-clip transition-opacity hover:opacity-90"
          >
            <div className="overflow-hidden rounded-[4px]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                style={{ aspectRatio: "4 / 3" }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 rounded-[8px] bg-neutral-100 p-4">
              <div>
                <h3 className="text-[18px] font-normal leading-6 text-neutral-900">
                  {post.title}
                </h3>
                {/* fecha eliminada */}
              </div>
              <p className="text-sm leading-5 text-neutral-500 line-clamp-3 min-h-[60px]">
                {truncateText(post.excerpt, MAX_BLOG_DESC_CHARS)}
              </p>
              <div className="mt-auto">
                <Button className="w-full" variant="outline" size="sm">
                  {t.blog.readMore}
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel className="w-full" opts={{ align: "start" }}>
          <CarouselContent className="ml-0 gap-3">
            {posts.map((post) => (
              <CarouselItem key={post.slug} className="basis-[77%] pl-0">
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full min-h-[280px] flex-col gap-2 overflow-clip transition-opacity hover:opacity-90"
                >
                  <div className="overflow-hidden rounded-[4px]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ aspectRatio: "4 / 3" }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 rounded-[8px] bg-neutral-100 p-4">
                    <div>
                      <h3 className="text-[18px] font-normal leading-6 text-neutral-900">
                        {post.title}
                      </h3>
                      {/* fecha eliminada */}
                    </div>
                    <p className="text-sm leading-5 text-neutral-500 line-clamp-3 min-h-[60px]">
                      {truncateText(post.excerpt, MAX_BLOG_DESC_CHARS)}
                    </p>
                    <div className="mt-auto">
                      <Button className="w-full" variant="outline" size="sm">
                        {t.blog.readMore}
                      </Button>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {canShowMore && (
        <div className="flex justify-center mt-10">
          <Button
            variant="secondary"
            onClick={() => setVisibleCount((count) => Math.min(count + MORE_COUNT, allPosts.length))}
          >
            {t.blog.seeMore}
          </Button>
        </div>
      )}
      </div>
    </section>
  );
};
