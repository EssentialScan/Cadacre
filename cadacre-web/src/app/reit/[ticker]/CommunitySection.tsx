"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, StickyNote, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";

export default function CommunitySection({ reitId, ticker }: { reitId: string, ticker: string }) {
  const { isSignedIn } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"discussion" | "notes">("discussion");
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setWatchlistLoading(false);
      setLoadingComments(false);
      return;
    }

    // Load watchlist status
    fetch("/api/community/watchlist")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInWatchlist(data.some((w: any) => w.reitId === reitId));
        }
        setWatchlistLoading(false);
      });

    // Load comments
    fetch(`/api/community/comments?reitId=${reitId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
        setLoadingComments(false);
      });

    // Load notes
    fetch(`/api/community/notes?reitId=${reitId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.content) setNotes(data.content);
      });
  }, [reitId, isSignedIn]);

  const toggleWatchlist = async () => {
    if (!isSignedIn) return;
    setWatchlistLoading(true);
    await fetch("/api/community/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reitId })
    });
    setInWatchlist(!inWatchlist);
    setWatchlistLoading(false);
  };

  const saveNotes = async () => {
    if (!isSignedIn) return;
    setSavingNotes(true);
    await fetch("/api/community/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reitId, content: notes })
    });
    setTimeout(() => setSavingNotes(false), 500); // UI feedback
  };

  const postComment = async () => {
    if (!isSignedIn || !newComment.trim()) return;
    setPostingComment(true);
    
    // Check if user has a profile first (to get a username)
    const profileRes = await fetch("/api/community/profile");
    const profileData = await profileRes.json();
    
    if (!profileData || profileData.error) {
      // Auto-generate a username if they don't have one for the MVP
      await fetch("/api/community/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: `User_${Math.floor(Math.random() * 10000)}`, isPortfolioPublic: false })
      });
    }

    await fetch("/api/community/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reitId, content: newComment })
    });

    setNewComment("");
    // Reload comments
    const commentsRes = await fetch(`/api/community/comments?reitId=${reitId}`);
    const commentsData = await commentsRes.json();
    if (Array.isArray(commentsData)) setComments(commentsData);
    
    setPostingComment(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display text-foreground">Community & Intelligence</h2>
        <button 
          onClick={toggleWatchlist}
          disabled={watchlistLoading || !isSignedIn}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            inWatchlist 
              ? 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200' 
              : 'bg-white border-border text-foreground hover:bg-muted/30'
          } ${!isSignedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {watchlistLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className={`w-4 h-4 ${inWatchlist ? 'fill-amber-500 text-amber-500' : ''}`} />}
          {inWatchlist ? "On Watchlist" : "Add to Watchlist"}
        </button>
      </div>

      <Card className="bg-white shadow-premium border border-border">
        <div className="flex border-b border-border/50">
          <button 
            onClick={() => setActiveTab("discussion")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === "discussion" ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-muted-foreground hover:bg-muted/10'}`}
          >
            <MessageSquare className="w-4 h-4" />
            Public Discussion
          </button>
          <button 
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === "notes" ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-muted-foreground hover:bg-muted/10'}`}
          >
            <StickyNote className="w-4 h-4" />
            Private Notes
          </button>
        </div>

        <CardContent className="p-0">
          {!isSignedIn ? (
            <div className="p-8 text-center text-muted-foreground">
              Please sign in to view discussions and save private notes.
            </div>
          ) : activeTab === "discussion" ? (
            <div className="flex flex-col h-[400px]">
              <div className="p-4 bg-muted/20 border-b border-border/50 text-[11px] text-muted-foreground">
                <strong>Moderation Notice:</strong> Comments are user-generated. The platform does not endorse these views and they do not constitute financial advice.
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loadingComments ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                ) : comments.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">Be the first to discuss {ticker}.</div>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="bg-muted/10 border border-border/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-foreground">@{c.username || "Unknown"}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-border/50 bg-background">
                <div className="flex gap-2">
                  <textarea 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Share your thesis..."
                    className="flex-1 border border-border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none h-[42px]"
                  />
                  <button 
                    onClick={postComment}
                    disabled={postingComment || !newComment.trim()}
                    className="bg-brand-blue text-white px-4 rounded-lg text-sm font-medium hover:bg-brand-blue/90 disabled:opacity-50 shrink-0 h-[42px]"
                  >
                    {postingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col h-[400px]">
              <div className="mb-2 text-[11px] text-muted-foreground">These notes are strictly private and tied to your account.</div>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Write down your investment thesis, risks, and price targets here..."
                className="flex-1 w-full border border-border rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none bg-background mb-4"
              />
              <button 
                onClick={saveNotes}
                disabled={savingNotes}
                className="bg-foreground text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <StickyNote className="w-4 h-4" />}
                {savingNotes ? "Saving..." : "Save Private Notes"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
