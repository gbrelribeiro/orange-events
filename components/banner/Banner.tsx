/* components/banner/Banner.tsx */

import Image from "next/image";
import Link from "next/link";
import "./Banner.css";

type BannerProps = {
  image: string;
  alt?: string;
  priority?: boolean;
  href?: string;
};

export default function Banner({ image, alt = "Banner", priority = false, href }: BannerProps) {
  const content = (
    <>
      <Image
        src={image}
        alt={alt}
        priority={priority}
        fill={true}
        sizes="100vw"
        className="banner-image"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className="banner-styles banner-link">
        {content}
      </Link>
    );
  };

  return (
    <section className="banner-styles">
      {content}
    </section>
  );
};