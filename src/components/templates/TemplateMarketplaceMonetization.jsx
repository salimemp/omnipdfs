import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  DollarSign, TrendingUp, ShoppingCart, CreditCard, Award,
  BarChart3, Users, Download, Eye, Plus
} from 'lucide-react';
import { toast } from 'sonner';

export default function TemplateMarketplaceMonetization({ templateId, isDark = true }) {
  const [pricing, setPricing] = useState({
    isFree: true,
    price: 0,
    currency: 'USD',
    licenseType: 'personal',
    allowCommercial: false,
    allowModification: true,
    allowRedistribution: false
  });

  const queryClient = useQueryClient();

  const { data: template } = useQuery({
    queryKey: ['template-monetization', templateId],
    queryFn: () => base44.entities.Template.filter({ id: templateId }),
    enabled: !!templateId,
    select: (data) => data[0]
  });

  const updatePricingMutation = useMutation({
    mutationFn: async (pricingData) => {
      await base44.entities.Template.update(templateId, {
        template_data: {
          ...template.template_data,
          pricing: pricingData
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['template-monetization']);
      toast.success('Pricing updated');
    }
  });

  const publishToMarketplace = async () => {
    await base44.entities.Template.update(templateId, {
      is_public: true,
      template_data: {
        ...template.template_data,
        pricing
      }
    });
    queryClient.invalidateQueries(['template-monetization']);
    toast.success('Published to marketplace');
  };

  // Mock earnings data
  const earnings = {
    total: 2450,
    thisMonth: 650,
    sales: 78,
    views: 1234
  };

  const salesData = [
    { month: 'Jan', sales: 12, revenue: 240 },
    { month: 'Feb', sales: 18, revenue: 360 },
    { month: 'Mar', sales: 15, revenue: 300 },
    { month: 'Apr', sales: 22, revenue: 440 },
    { month: 'May', sales: 11, revenue: 220 },
  ];

  if (!templateId) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <DollarSign className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to manage monetization
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Marketplace Monetization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {template?.name}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Free Template</Label>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Make this template free for everyone
                  </p>
                </div>
                <Switch
                  checked={pricing.isFree}
                  onCheckedChange={(v) => setPricing(prev => ({ ...prev, isFree: v }))}
                />
              </div>

              {!pricing.isFree && (
                <>
                  <div>
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Price</Label>
                    <div className="flex gap-2 mt-2">
                      <Select
                        value={pricing.currency}
                        onValueChange={(v) => setPricing(prev => ({ ...prev, currency: v }))}
                      >
                        <SelectTrigger className={`w-24 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pricing.price}
                        onChange={(e) => setPricing(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>License Type</Label>
                    <Select
                      value={pricing.licenseType}
                      onValueChange={(v) => setPricing(prev => ({ ...prev, licenseType: v }))}
                    >
                      <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                        <SelectItem value="personal">Personal Use</SelectItem>
                        <SelectItem value="commercial">Commercial Use</SelectItem>
                        <SelectItem value="extended">Extended License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                onClick={publishToMarketplace}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Publish to Marketplace
              </Button>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Suggested Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setPricing(prev => ({ ...prev, isFree: false, price: 9.99, licenseType: 'personal' }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isDark ? 'border-slate-700 hover:border-violet-500' : 'border-slate-200 hover:border-violet-300'
                }`}
              >
                <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Basic</p>
                <p className={`text-2xl font-bold text-violet-400 mb-2`}>$9.99</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Personal use</p>
              </button>
              <button
                onClick={() => setPricing(prev => ({ ...prev, isFree: false, price: 19.99, licenseType: 'commercial' }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isDark ? 'border-slate-700 hover:border-violet-500' : 'border-slate-200 hover:border-violet-300'
                }`}
              >
                <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro</p>
                <p className={`text-2xl font-bold text-cyan-400 mb-2`}>$19.99</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Commercial use</p>
              </button>
              <button
                onClick={() => setPricing(prev => ({ ...prev, isFree: false, price: 49.99, licenseType: 'extended' }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isDark ? 'border-slate-700 hover:border-violet-500' : 'border-slate-200 hover:border-violet-300'
                }`}
              >
                <p className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Premium</p>
                <p className={`text-2xl font-bold text-emerald-400 mb-2`}>$49.99</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Extended license</p>
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-10 h-10 text-emerald-400" />
                  <Badge className="bg-emerald-500">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ${earnings.total}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Total Earnings
                </p>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <CreditCard className="w-10 h-10 text-cyan-400" />
                  <Badge variant="outline">This Month</Badge>
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ${earnings.thisMonth}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Monthly Revenue
                </p>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <ShoppingCart className="w-10 h-10 text-violet-400" />
                  <Download className="w-5 h-5 text-slate-400" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {earnings.sales}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Total Sales
                </p>
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="w-10 h-10 text-amber-400" />
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {earnings.views}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Template Views
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sales History */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <BarChart3 className="w-5 h-5 text-violet-400" />
                Sales History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salesData.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {item.month}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.sales} sales
                      </p>
                    </div>
                    <p className={`text-lg font-bold text-emerald-400`}>
                      ${item.revenue}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licensing" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Allow Commercial Use</Label>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Buyers can use this template for commercial projects
                  </p>
                </div>
                <Switch
                  checked={pricing.allowCommercial}
                  onCheckedChange={(v) => setPricing(prev => ({ ...prev, allowCommercial: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Allow Modification</Label>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Buyers can modify and customize the template
                  </p>
                </div>
                <Switch
                  checked={pricing.allowModification}
                  onCheckedChange={(v) => setPricing(prev => ({ ...prev, allowModification: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Allow Redistribution</Label>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Buyers can resell or redistribute the template
                  </p>
                </div>
                <Switch
                  checked={pricing.allowRedistribution}
                  onCheckedChange={(v) => setPricing(prev => ({ ...prev, allowRedistribution: v }))}
                />
              </div>

              <Button
                onClick={() => updatePricingMutation.mutate(pricing)}
                className="w-full bg-violet-500"
              >
                <Award className="w-4 h-4 mr-2" />
                Save License Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}