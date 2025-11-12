import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Eye, Video, TrendingUp, TrendingDown } from 'lucide-react';
import { borrowersData } from './SharedData';

// Mock data by subscriber range
const dataBySubscriberRange: Record<string, any> = {
  '0-10000': {
    kpi: {
      subscribers: { current: 6500, change: 15.2 },
      views: { current: 185000, change: 22.5 },
      videos: { current: 42, change: 8.5 }
    },
    monthly: [
      { month: '1월', subscribers: 10.5, views: 15.2, videos: 5.5 },
      { month: '2월', subscribers: 12.2, views: 17.8, videos: 6.8 },
      { month: '3월', subscribers: 13.8, views: 19.5, videos: 7.5 },
      { month: '4월', subscribers: 14.5, views: 20.8, videos: 8.0 },
      { month: '5월', subscribers: 14.8, views: 21.8, videos: 8.2 },
      { month: '6월', subscribers: 15.2, views: 22.5, videos: 8.5 }
    ],
    alerts: borrowersData
      .filter(b => b.subscribers < 10000)
      .filter(b => Math.abs(b.subscribersChange) > 10 || Math.abs(b.viewsChange) > 10 || Math.abs(b.videosChange) > 10)
      .map(b => ({
        channelId: b.channelId,
        name: b.name,
        type: b.subscribersChange > 0 || b.viewsChange > 0 ? 'surge' : 'drop',
        metric: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) ? 'subscribers' : 'views',
        change: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) ? b.subscribersChange : b.viewsChange,
        message: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) 
          ? (b.subscribersChange > 0 ? '구독자 급상승' : '구독자 감소')
          : (b.viewsChange > 0 ? '조회수 급상승' : '조회수 급감')
      }))
  },
  '10000-100000': {
    kpi: {
      subscribers: { current: 52000, change: 11.8 },
      views: { current: 1580000, change: 17.5 },
      videos: { current: 78, change: 5.2 }
    },
    monthly: [
      { month: '1월', subscribers: 8.2, views: 12.8, videos: 3.8 },
      { month: '2월', subscribers: 9.5, views: 14.5, videos: 4.5 },
      { month: '3월', subscribers: 10.5, views: 15.8, videos: 4.8 },
      { month: '4월', subscribers: 11.2, views: 16.5, videos: 5.0 },
      { month: '5월', subscribers: 11.5, views: 17.0, videos: 5.1 },
      { month: '6월', subscribers: 11.8, views: 17.5, videos: 5.2 }
    ],
    alerts: borrowersData
      .filter(b => b.subscribers >= 10000 && b.subscribers < 100000)
      .filter(b => Math.abs(b.subscribersChange) > 10 || Math.abs(b.viewsChange) > 10 || Math.abs(b.videosChange) > 10)
      .map(b => ({
        channelId: b.channelId,
        name: b.name,
        type: b.subscribersChange > 0 || b.viewsChange > 0 ? 'surge' : 'drop',
        metric: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) ? 'subscribers' : 'views',
        change: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) ? b.subscribersChange : b.viewsChange,
        message: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) 
          ? (b.subscribersChange > 0 ? '구독자 급상승' : '구독자 감소')
          : (b.viewsChange > 0 ? '조회수 급상승' : '조회수 급감')
      }))
  },
  '100000+': {
    kpi: {
      subscribers: { current: 1850000, change: 8.2 },
      views: { current: 52500000, change: 12.8 },
      videos: { current: 285, change: 1.5 }
    },
    monthly: [
      { month: '1월', subscribers: 5.0, views: 8.2, videos: 0.5 },
      { month: '2월', subscribers: 6.0, views: 9.5, videos: 0.8 },
      { month: '3월', subscribers: 6.8, views: 10.8, videos: 1.0 },
      { month: '4월', subscribers: 7.5, views: 11.5, videos: 1.2 },
      { month: '5월', subscribers: 7.8, views: 12.0, videos: 1.4 },
      { month: '6월', subscribers: 8.2, views: 12.8, videos: 1.5 }
    ],
    alerts: borrowersData
      .filter(b => b.subscribers >= 100000)
      .filter(b => Math.abs(b.subscribersChange) > 10 || Math.abs(b.viewsChange) > 10 || Math.abs(b.videosChange) > 10)
      .map(b => ({
        channelId: b.channelId,
        name: b.name,
        type: b.subscribersChange > 0 || b.viewsChange > 0 ? 'surge' : 'drop',
        metric: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) ? 'subscribers' : 'views',
        change: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) ? b.subscribersChange : b.viewsChange,
        message: Math.abs(b.subscribersChange) > Math.abs(b.viewsChange) 
          ? (b.subscribersChange > 0 ? '구독자 급상승' : '구독자 감소')
          : (b.viewsChange > 0 ? '조회수 급상승' : '조회수 급감')
      }))
  }
};

interface YoutubeDashboardProps {
  onAlertClick: (borrowerId: number) => void;
}

export function YoutubeDashboard({ onAlertClick }: YoutubeDashboardProps) {
  const [subscriberRange, setSubscriberRange] = useState('10000-100000');
  
  const currentData = dataBySubscriberRange[subscriberRange];
  const kpiData = currentData.kpi;
  const monthlyData = currentData.monthly;

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 lg:py-8 max-w-7xl h-[calc(100vh-100px)] sm:h-[calc(100vh-120px)] flex flex-col overflow-y-auto">
      {/* Subscriber Range Filter */}
      <div className="mb-8 sm:mb-10 md:mb-12">
        <Label className="mb-2 block text-base sm:text-lg md:text-xl">구독자 수 구간</Label>
        <Select value={subscriberRange} onValueChange={setSubscriberRange}>
          <SelectTrigger className="w-full sm:w-64 text-base sm:text-lg h-10 sm:h-auto">
            <SelectValue placeholder="구독자 수 구간 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-10000" className="text-base sm:text-lg">0 ~ 1만</SelectItem>
            <SelectItem value="10000-100000" className="text-base sm:text-lg">1만 ~ 10만</SelectItem>
            <SelectItem value="100000+" className="text-base sm:text-lg">10만 이상</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">구독자 수</CardTitle>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">
              {kpiData.subscribers.current.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              {kpiData.subscribers.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${kpiData.subscribers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpiData.subscribers.change > 0 ? '+' : ''}{kpiData.subscribers.change}%
              </span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">조회수</CardTitle>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">
              {kpiData.views.current.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              {kpiData.views.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${kpiData.views.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpiData.views.change > 0 ? '+' : ''}{kpiData.views.change}%
              </span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">영상 수</CardTitle>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">
              {kpiData.videos.current.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              {kpiData.videos.change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${kpiData.videos.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {kpiData.videos.change > 0 ? '+' : ''}{kpiData.videos.change}%
              </span>
              <span className="text-sm text-gray-500">전월 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 flex-1">
        {/* Monthly Trend Chart */}
        <Card className="min-h-0">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">월별 평균 증감률 추이 (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  fontSize={14}
                  className="text-sm sm:text-base"
                />
                <YAxis 
                  yAxisId="subscribers" 
                  orientation="left" 
                  stroke="#3b82f6" 
                  fontSize={12}
                  className="text-xs sm:text-sm"
                  label={{ value: '구독자 (%)', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6', fontSize: '14px' } }} 
                />
                <YAxis 
                  yAxisId="views" 
                  orientation="right" 
                  stroke="#10b981" 
                  fontSize={12}
                  className="text-xs sm:text-sm"
                  label={{ value: '조회수 (%)', angle: 90, position: 'insideRight', style: { fill: '#10b981', fontSize: '14px' } }} 
                />
                <YAxis yAxisId="videos" orientation="right" stroke="#8b5cf6" />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Line 
                  yAxisId="subscribers"
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="구독자 수 증감률"
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
                <Line 
                  yAxisId="views"
                  type="monotone" 
                  dataKey="views" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="조회수 증감률"
                  dot={{ fill: '#10b981' }}
                />
                <Line 
                  yAxisId="videos"
                  type="monotone" 
                  dataKey="videos" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="영상 수 증감률"
                  dot={{ fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}