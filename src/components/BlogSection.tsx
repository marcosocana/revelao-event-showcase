import { useMemo, useState } from "react";
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

const INITIAL_COUNT = 3;
const MORE_COUNT = 3;
const MAX_BLOG_TITLE_CHARS = 76;
const MAX_BLOG_DESC_CHARS = 118;

const truncateText = (text: string, maxChars: number) => {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 3)).trimEnd()}...`;
};

export const BlogSection = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const allPosts = useMemo(() => getBlogPosts(), []);
  const posts = useMemo(() => allPosts.slice(0, visibleCount), [allPosts, visibleCount]);
  const canShowMore = visibleCount < allPosts.length;

  return (
    <section id="blog" className="py-16 bg-background">
      <div className="container px-4 mx-auto container-mobile-right-edge">
      <div className="mb-12 text-center animate-fade-in">
        <h2 className="font-bold mb-4 text-foreground md:text-5xl text-3xl">
          Blog
        </h2>
        <p className="text-base text-muted-foreground md:text-xl max-w-3xl mx-auto">
          Contenido útil e interesante sobre el mundo de los eventos, ideas y tendencias para inspirarte.
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="revelao-card">
            <div className="aspect-video overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-foreground">
                {truncateText(post.title, MAX_BLOG_TITLE_CHARS)}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {truncateText(post.excerpt, MAX_BLOG_DESC_CHARS)}
              </p>
              <div className="mt-6">
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Leer más
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel className="w-full" opts={{ align: "start" }}>
          <CarouselContent className="ml-0 gap-3">
            {posts.map((post) => (
              <CarouselItem key={post.slug} className="basis-[77%] pl-0">
                <article className="revelao-card">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {truncateText(post.title, MAX_BLOG_TITLE_CHARS)}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {truncateText(post.excerpt, MAX_BLOG_DESC_CHARS)}
                    </p>
                    <div className="mt-5">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Leer más
                      </Link>
                    </div>
                  </div>
                </article>
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
            Ver más
          </Button>
        </div>
      )}
      </div>
    </section>
  );
};
