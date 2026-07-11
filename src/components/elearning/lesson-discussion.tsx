"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  addPost,
  getPosts,
  addReply,
  subscribeToForum,
  formatRelativeTime,
  type ForumPost,
} from "@/lib/forum-store";
import { getSession } from "@/lib/client-auth";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Reply, Trash2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function LessonDiscussion({ lessonId }: { lessonId: string }) {
  const { studentName } = useAppStore();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = () => setPosts(getPosts(lessonId));

  useEffect(() => {
    refresh();
    const unsub = subscribeToForum(refresh);
    return unsub;
  }, [lessonId]);

  const getAuthor = () => {
    const session = getSession();
    if (session?.name) return session.name;
    return studentName || "Anonymous";
  };

  const handleAddPost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something before posting");
      return;
    }
    setSubmitting(true);
    try {
      addPost(lessonId, getAuthor(), newPost);
      setNewPost("");
      toast.success("Posted to discussion");
    } catch (e) {
      toast.error("Failed to post", { description: e instanceof Error ? e.message : "" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    try {
      addReply(postId, getAuthor(), replyText);
      setReplyText("");
      setReplyTo(null);
      toast.success("Reply added");
    } catch (e) {
      toast.error("Failed to reply");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Discussion ({posts.length})
        </CardTitle>
        <CardDescription>
          Ask questions and share insights with other learners about this lesson
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New post input */}
        <div className="space-y-2">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            placeholder="Share a question or insight about this lesson..."
            maxLength={1000}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Posting as <span className="font-medium">{getAuthor()}</span>
            </span>
            <Button onClick={handleAddPost} disabled={submitting || !newPost.trim()} size="sm" className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Post
            </Button>
          </div>
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No discussions yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border bg-card p-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                        {post.author.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{post.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-1 whitespace-pre-wrap break-words">{post.content}</p>

                      {/* Reply button */}
                      <button
                        onClick={() => {
                          setReplyTo(replyTo === post.id ? null : post.id);
                          setReplyText("");
                        }}
                        className="text-xs text-primary hover:underline mt-2 flex items-center gap-1"
                      >
                        <Reply className="h-3 w-3" />
                        Reply {post.replies.length > 0 && `(${post.replies.length})`}
                      </button>

                      {/* Reply input */}
                      {replyTo === post.id && (
                        <div className="mt-2 space-y-2">
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={2}
                            placeholder={`Reply to ${post.author}...`}
                            maxLength={500}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAddReply(post.id)} className="gap-1">
                              <Send className="h-3 w-3" />
                              Reply
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {post.replies.length > 0 && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-border">
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-2">
                              <Avatar className="w-6 h-6 shrink-0">
                                <AvatarFallback className="text-[10px] bg-muted">
                                  {reply.author.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-xs">{reply.author}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {formatRelativeTime(reply.timestamp)}
                                  </span>
                                </div>
                                <p className="text-xs mt-0.5 whitespace-pre-wrap break-words">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
