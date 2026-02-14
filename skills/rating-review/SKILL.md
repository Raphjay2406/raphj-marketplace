# Rating & Review Systems

Star ratings, review forms, aggregate rating displays, review cards, and helpful vote patterns.

## Star Rating Component

```tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  value,
  onChange,
  max = 5,
  size = "md",
  readOnly = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex items-center gap-0.5"
      role="radiogroup"
      aria-label={`Rating: ${value} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = readOnly ? starValue <= value : starValue <= (hovered || value);

        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            className={cn(
              "transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer"
            )}
            onClick={() => onChange?.(starValue)}
            onMouseEnter={() => !readOnly && setHovered(starValue)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizes[size],
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
```

## Aggregate Rating Display

```tsx
import { StarRating } from "./star-rating";
import { Progress } from "@/components/ui/progress";

interface RatingBreakdown {
  stars: number;
  count: number;
}

interface AggregateRatingProps {
  average: number;
  total: number;
  breakdown: RatingBreakdown[];
}

export function AggregateRating({ average, total, breakdown }: AggregateRatingProps) {
  return (
    <div className="flex gap-8">
      {/* Average */}
      <div className="text-center">
        <p className="text-5xl font-bold">{average.toFixed(1)}</p>
        <StarRating value={Math.round(average)} readOnly size="sm" />
        <p className="mt-1 text-sm text-muted-foreground">
          {total.toLocaleString()} reviews
        </p>
      </div>

      {/* Breakdown */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const item = breakdown.find((b) => b.stars === stars);
          const count = item?.count ?? 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="w-3 text-sm text-muted-foreground">{stars}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <Progress value={percentage} className="h-2 flex-1" />
              <span className="w-8 text-right text-xs text-muted-foreground">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Review Card

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { StarRating } from "./star-rating";

interface Review {
  id: string;
  author: { name: string; avatar?: string };
  rating: number;
  title: string;
  body: string;
  date: string;
  helpfulCount: number;
  verified?: boolean;
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="space-y-3 border-b pb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.author.avatar} />
            <AvatarFallback>{review.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{review.author.name}</span>
              {review.verified && (
                <Badge variant="secondary" className="text-[10px]">Verified</Badge>
              )}
            </div>
            <time className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString()}
            </time>
          </div>
        </div>
        <StarRating value={review.rating} readOnly size="sm" />
      </div>

      <div>
        <h4 className="font-medium">{review.title}</h4>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {review.body}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
          <ThumbsUp className="mr-1 h-3 w-3" />
          Helpful ({review.helpfulCount})
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
          Report
        </Button>
      </div>
    </div>
  );
}
```

## Review Form

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";

export function ReviewForm({
  onSubmit,
}: {
  onSubmit: (data: { rating: number; title: string; body: string }) => Promise<void>;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    await onSubmit({ rating, title, body });
    setSubmitting(false);
    setRating(0);
    setTitle("");
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Your Rating</Label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {rating === 0 && (
          <p className="text-xs text-muted-foreground">Click a star to rate</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-title">Review Title</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-body">Your Review</Label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell others about your experience..."
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={submitting || rating === 0}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
```

## Key Rules

- Star rating: support hover preview, keyboard navigation with radiogroup role
- Aggregate display: big average number + progress bar breakdown by star level
- Review cards: author avatar, verified badge, star rating, helpful vote button
- Review form: require rating selection before submission
- Use `fill-yellow-400 text-yellow-400` for filled stars, `fill-transparent` for empty
- Always include `aria-label` with star count for screen readers
- Sort reviews by: most helpful, most recent, highest/lowest rating
- Show "Verified" badge for confirmed purchases
