/* components/cards/EventCard.tsx */

"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import "./EventCard.css";

type EventCardProps = {
  image?: string;
  title?: string;
  children?: ReactNode;
  href?: string;
};

export function EventCard({ image, title, children, href }: EventCardProps) {
  const content = (
    <>
      {/* CARD IMAGE */}
      {image && (
        <div className="image-position">
          <Image
            src={image}
            alt={title || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* CARD TITLE */}
      {title && (
        <h2 className="event-card-title">
          {title}
        </h2>
      )}

      {/* ACTIONS AREA (BUTTONS OR ANOTHER THING) */}
      {children && (
        <div>
          {children}
        </div>
      )}
    </>
  );

  {/* CARD CONTENT (WITH REFERENCY) */}
  if (href) {
    return (
      <Link href={href} className="event-card-styles">
        {content}
      </Link>
    );
  };

  {/* SOMEONE CARD CONTENT */}
  return (
    <div className="event-card-styles">
      {content}
    </div>
  );
};