"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useCurrentCourse } from "@/lib/use-course";
import { slugify } from "@/lib/courses-registry";
import {
  addRating,
  getRatings,
  getAverageRating,
  subscribeToRatings,
  type Rating,
} from "@/lib/ratings-store";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send, ThumbsUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CourseRatings({ courseId }: { courseId?: string }) {
  const { progress, studentName, selectedCourseId } = useAppStore();
  const courseData = useCurrentCourse();
  const cid = courseId || slugify(courseData.title) || selectedCourseId;

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [avg, setAvg] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [starInput, setStarInput] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = () => {
    setRatings(getRatings(cid));
    setAvg(getAverageRating(cid));
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToRatings(refresh);
    return unsub;
  }, [cid]);

  // User can rate if they completed the course (certificate earned OR 100% lessons)
  const totalLessons = courseData.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const courseLessons = courseData.modules.flatMap((m) => m.lessons);
  const completedInCourse = courseLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
  const canRate = progress.certificateEarned || completedInCourse === totalLessons;

  const handleSubmit = () => {
    if (starInput === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    addRating(cid, starInput, review, studentName || "Student");
    toast.success("Thank you for your review!");
    setStarInput(0);
    setReview("");
    setSubmitting(false);
  };

  const roundAvg = Math.round(avg.average);

  return (
    <div className="space-y-6">
      {/* Header summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold">{avg.average.toFixed(1)}</div>
              <div className="flex items-center gap-0.5 justify-center md:justify-start mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < roundAvg ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"
                    )}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{avg.count} review{avg.count === 1 ? "" : "s"}</div>
            </div>
            <div className="flex-1">
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = ratings.filter((r) => r.rating === s).length;
                  const pct = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                  return (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-8 text-right flex items-center gap-0.5">
                        {s}
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-yellow-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-muted-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating form */}
      {canRate ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Write a Review
            </CardTitle>
            <CardDescription>Share your experience to help other learners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoverStar(i + 1)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setStarInput(i + 1)}
                    className="p-1 hover:scale-110 transition-transform"
                    aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition-colors",
                        i < (hoverStar || starInput)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {starInput > 0 && `${starInput} / 5`}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Your Review (optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                placeholder="What did you like about this course? Any suggestions for improvement?"
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">{review.length}/1000</div>
            </div>
            <Button onClick={handleSubmit} disabled={submitting || starInput === 0} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Star className="h-5 w-5 text-yellow-500 shrink-0" />
              <span>
                Complete this course to leave a review. You have {completedInCourse} of {totalLessons} lessons done.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Student Reviews ({ratings.length})
        </h3>
        {ratings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No reviews yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {ratings.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs">
                          {r.studentName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{r.studentName}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={cn(
                                  "h-3 w-3",
                                  idx < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {r.review && (
                          <p className="text-sm mt-2 text-muted-foreground leading-relaxed">{r.review}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
