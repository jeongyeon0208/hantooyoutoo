import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, UserPlus, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { borrowersData, Borrower } from './SharedData';

// 숫자에 콤마 추가 함수
const formatNumber = (num: number | string): string => {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return num.toString();
  return number.toLocaleString('ko-KR');
};

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRiskLevelText = (level: string) => {
  switch (level) {
    case 'high':
      return '높음';
    case 'medium':
      return '중간';
    case 'low':
      return '정상';
    default:
      return '알 수 없음';
  }
};

interface BorrowerManagementProps {
  selectedBorrowerId: number | null;
  onAlertClick?: (borrowerId: number) => void;
}

export function BorrowerManagement({ selectedBorrowerId, onAlertClick }: BorrowerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBorrower, setSelectedBorrower] = useState(selectedBorrowerId);
  const [highlightBorrower, setHighlightBorrower] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [riskFilter, setRiskFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    channelId: '',
    loanId: ''
  });

  // Ref for the chart section to scroll to
  const chartRef = useRef(null);
  // Refs for borrower cards
  const borrowerRefs = useRef({});

  // Update selected borrower when prop changes
  useEffect(() => {
    if (selectedBorrowerId !== null) {
      setSelectedBorrower(selectedBorrowerId);
      setHighlightBorrower(selectedBorrowerId);
      setTimeout(() => setHighlightBorrower(null), 2000);
      console.log('BorrowerManagement: Updated selectedBorrower to', selectedBorrowerId);
      
      // Scroll to selected borrower card first, then to chart
      setTimeout(() => {
        const borrowerCard = borrowerRefs.current[selectedBorrowerId];
        if (borrowerCard) {
          borrowerCard.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
        
        // Then scroll to chart after another delay
        setTimeout(() => {
          if (chartRef.current) {
            chartRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
          }
        }, 800);
      }, 100);
    }
  }, [selectedBorrowerId]);

  const filteredBorrowers = borrowersData.filter(borrower => {
    const matchesSearch = borrower.name.includes(searchQuery) ||
      borrower.phone.includes(searchQuery) ||
      borrower.channelId.includes(searchQuery);
    
    const matchesRisk = riskFilter === 'all' || borrower.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', birthDate: '', channelId: '', loanId: '' });
  };

  const handleSubmit = () => {
    console.log('새 대출자 등록:', formData);
    handleReset();
    setShowRegistrationForm(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 overflow-x-hidden max-w-7xl h-[calc(100vh-120px)] flex flex-col">
      {/* New Borrower Registration Button */}
      <div className="mb-6 sm:mb-8">
        <Button 
          onClick={() => setShowRegistrationForm(!showRegistrationForm)}
          variant={showRegistrationForm ? "secondary" : "default"}
          className="flex items-center gap-2 text-sm sm:text-base"
        >
          <UserPlus className="w-4 h-4" />
          {showRegistrationForm ? "등록 취소" : "신규 대출자 등록"}
        </Button>
      </div>

      {/* Conditional New Borrower Registration Form */}
      {showRegistrationForm && (
        <Card className="mb-10 sm:mb-12 max-h-[300px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              신규 대출자 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">이름</Label>
                <Input
                  id="name"
                  placeholder="이름 입력"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base">전화번호</Label>
                <Input
                  id="phone"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="birthDate" className="text-sm sm:text-base">생년월일</Label>
                <Input
                  id="birthDate"
                  placeholder="YYYY-MM-DD"
                  value={formData.birthDate}
                  onChange={(e) => handleFormChange('birthDate', e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="channelId" className="text-sm sm:text-base">채널 ID</Label>
                <Input
                  id="channelId"
                  placeholder="UCxxxxxxxxxxxxxxxxxx"
                  value={formData.channelId}
                  onChange={(e) => handleFormChange('channelId', e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="loanId" className="text-sm sm:text-base">대출 ID</Label>
                <Input
                  id="loanId"
                  placeholder="LOAN-2024-XXX"
                  value={formData.loanId}
                  onChange={(e) => handleFormChange('loanId', e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={handleSubmit} className="flex-1 text-sm sm:text-base">
                  등록
                </Button>
                <Button onClick={handleReset} variant="outline" className="gap-2 text-sm sm:text-base">
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  초기화
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="mb-14 sm:mb-16 mt-8 sm:mt-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="이름, 전화번호, 채널 ID 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Risk Level Filter */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700">
            위험도 필터:
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={riskFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRiskFilter('all')}
              className={`text-xs sm:text-sm transition-all duration-300 relative ${
                riskFilter === 'all' 
                  ? 'bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800 shadow-xl ring-4 ring-gray-400 ring-opacity-75 transform scale-110 font-bold z-10' 
                  : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              {riskFilter === 'all' && (
                <div className="absolute inset-0 bg-gray-800 rounded-md opacity-20 animate-pulse"></div>
              )}
              <span className="relative z-10">전체</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRiskFilter('high')}
              className={`text-xs sm:text-sm transition-all duration-300 relative ${
                riskFilter === 'high' 
                  ? 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 shadow-xl ring-4 ring-red-200 ring-opacity-75 transform scale-110 font-bold z-10' 
                  : 'text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 hover:shadow-md'
              }`}
            >
              {riskFilter === 'high' && (
                <div className="absolute inset-0 bg-red-200 rounded-md opacity-20 animate-pulse"></div>
              )}
              <span className="relative z-10">높음</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRiskFilter('medium')}
              className={`text-xs sm:text-sm transition-all duration-300 relative ${
                riskFilter === 'medium' 
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300 shadow-xl ring-4 ring-yellow-200 ring-opacity-75 transform scale-110 font-bold z-10' 
                  : 'text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-800 hover:shadow-md'
              }`}
            >
              {riskFilter === 'medium' && (
                <div className="absolute inset-0 bg-yellow-200 rounded-md opacity-20 animate-pulse"></div>
              )}
              <span className="relative z-10">중간</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRiskFilter('low')}
              className={`text-xs sm:text-sm transition-all duration-300 relative ${
                riskFilter === 'low' 
                  ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300 shadow-xl ring-4 ring-green-200 ring-opacity-75 transform scale-110 font-bold z-10' 
                  : 'text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 hover:text-green-700 hover:shadow-md'
              }`}
            >
              {riskFilter === 'low' && (
                <div className="absolute inset-0 bg-green-200 rounded-md opacity-20 animate-pulse"></div>
              )}
              <span className="relative z-10">정상</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8 flex-1 min-h-0">
        {/* Risk Borrowers Panel */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              대출자 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
              {filteredBorrowers.map((borrower) => (
                <div
                  key={borrower.id}
                  ref={(el) => (borrowerRefs.current[borrower.id] = el)}
                  className="border border-gray-200 rounded-lg"
                >
                  <div
                    onClick={() => setSelectedBorrower(selectedBorrower === borrower.id ? null : borrower.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedBorrower === borrower.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="mb-1 font-medium">{borrower.name}</div>
                        <div className="text-sm text-gray-600">{borrower.phone}</div>
                        <div className="text-sm text-gray-600">생년월일: {borrower.birthDate}</div>
                      </div>
                      <Badge className={getRiskLevelColor(borrower.riskLevel)}>
                        위험도: {getRiskLevelText(borrower.riskLevel)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="min-w-0">
                        <span className="text-gray-600">채널 ID:</span>{' '}
                        <a
                          href={`https://www.youtube.com/channel/${borrower.channelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 break-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="break-all">{borrower.channelId}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                      <div className="min-w-0">
                        <span className="text-gray-600">대출 ID:</span> <span className="break-all">{borrower.loanId}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">최근 KPI 변화</div>
                      <div className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">구독자:</span>
                          <span className={borrower.subscribersChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {borrower.subscribersChange >= 0 ? '+' : ''}{borrower.subscribersChange}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">조회수:</span>
                          <span className={borrower.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {borrower.viewsChange >= 0 ? '+' : ''}{borrower.viewsChange}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">영상:</span>
                          <span className={borrower.videosChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {borrower.videosChange >= 0 ? '+' : ''}{borrower.videosChange}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart directly below the selected borrower card */}
                  {selectedBorrower === borrower.id && (
                    <div 
                      className={`transition-all duration-500 ${
                        highlightBorrower === selectedBorrower 
                          ? 'ring-4 ring-blue-400 ring-opacity-50 shadow-xl' 
                          : ''
                      }`}
                    >
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="mb-3">
                          <h3 className="text-base sm:text-lg font-medium text-gray-900">
                            {borrower.name}님의 월별 추이
                          </h3>
                        </div>
                        <div className="bg-white rounded-lg p-2 sm:p-4 shadow-sm overflow-hidden">
                          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                            <LineChart data={borrower.monthlyData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="month" 
                                fontSize={10}
                                className="text-xs sm:text-sm"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis 
                                yAxisId="subscribers" 
                                orientation="left" 
                                stroke="#3b82f6" 
                                fontSize={8}
                                className="text-xs sm:text-sm"
                                width={40}
                                tickFormatter={formatNumber}
                              />
                              <YAxis 
                                yAxisId="views" 
                                orientation="right" 
                                stroke="#10b981" 
                                fontSize={8}
                                className="text-xs sm:text-sm"
                                width={40}
                                tickFormatter={formatNumber}
                              />
                              <YAxis 
                                yAxisId="videos" 
                                orientation="right" 
                                stroke="#8b5cf6" 
                                fontSize={8}
                                width={40}
                                tickFormatter={formatNumber}
                              />
                              <Tooltip 
                                contentStyle={{
                                  fontSize: '12px',
                                  padding: '8px'
                                }}
                                formatter={(value: any, name: string) => [
                                  formatNumber(value),
                                  name
                                ]}
                                labelFormatter={(label) => `월: ${label}`}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  fontSize: '10px',
                                  paddingTop: '10px'
                                }}
                                iconSize={8}
                              />
                              <Line 
                                yAxisId="subscribers"
                                type="monotone" 
                                dataKey="subscribers" 
                                stroke="#3b82f6" 
                                strokeWidth={1.5}
                                name="구독자"
                                dot={{ fill: '#3b82f6', r: 2 }}
                              />
                              <Line 
                                yAxisId="views"
                                type="monotone" 
                                dataKey="views" 
                                stroke="#10b981" 
                                strokeWidth={1.5}
                                name="조회수"
                                dot={{ fill: '#10b981', r: 2 }}
                              />
                              <Line 
                                yAxisId="videos"
                                type="monotone" 
                                dataKey="videos" 
                                stroke="#8b5cf6" 
                                strokeWidth={1.5}
                                name="영상수"
                                dot={{ fill: '#8b5cf6', r: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}