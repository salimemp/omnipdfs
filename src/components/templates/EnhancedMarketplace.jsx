import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Star, Download, Eye, ShoppingCart, Search, Filter,
  MessageSquare, ThumbsUp, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function EnhancedMarketplace({ isDark = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviewDialog, setReviewDialog] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ['marketplace-enhanced'],
    queryFn: () => base44.entities.Template.filter({ is_public: true })
  });

  const addReviewMutation = useMutation({
    mutationFn: async ({ templateId, rating, comment }) => {
      const template = templates.find(t => t.id === templateId);
      const reviews = template.template_data?.reviews || [];
      const user = await base44.auth.me();
      
      reviews.push({
        author: user.email,
        rating,
        comment,
        date: new Date().toISOString(),
        helpful: 0
      });

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await base44.entities.Template.update(templateId, {
        template_data: {
          ...template.template_data,
          reviews,
          average_rating: avgRating
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['marketplace-enhanced']);
      setReviewDialog(null);
      setReviewText('');
      setReviewRating(5);
      toast.success('Review submitted');
    }
  });

  let filtered = templates.filter(t => {
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const avgRating = t.template_data?.average_rating || 0;
    const matchesRating = ratingFilter === 'all' || 
      (ratingFilter === '4+' && avgRating >= 4) ||
      (ratingFilter === '3+' && avgRating >= 3);
    return matchesSearch && matchesCategory && matchesRating;
  });

  if (sortBy === 'popular') {
    filtered = [...filtered].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => 
      (b.template_data?.average_rating || 0) - (a.template_data?.average_rating || 0)
    );
  } else if (sortBy === 'newest') {
    filtered = [...filtered].sort((a, b) => 
      new Date(b.created_date) - new Date(a.created_date)
    );
  }

  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`w-40 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3+">3+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map((template) => {
          const avgRating = template.template_data?.average_rating || 0;
          const reviews = template.template_data?.reviews || [];
          
          return (
            <Card key={template.id} className={`hover:shadow-xl transition-all ${
              isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/50' : 'bg-white border-slate-200'
            }`}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.name}
                  </h3>
                  <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {template.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= avgRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {avgRating.toFixed(1)} ({reviews.length})
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline">{template.category}</Badge>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.usage_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {reviews.length}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setReviewDialog(template)} className="flex-1">
                    <Star className="w-3 h-3 mr-1" />
                    Review
                  </Button>
                  <Button size="sm" className="flex-1 bg-violet-500">
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Write a Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Rating
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Share your thoughts about this template..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className={`min-h-[120px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />

            <Button
              onClick={() => addReviewMutation.mutate({
                templateId: reviewDialog?.id,
                rating: reviewRating,
                comment: reviewText
              })}
              disabled={!reviewText || addReviewMutation.isPending}
              className="w-full bg-violet-500"
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}