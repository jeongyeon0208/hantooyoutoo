import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, UserPlus, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { borrowersData, Borrower } from './SharedData';

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
}

export function BorrowerManagement({ selectedBorrowerId }: BorrowerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBorrower, setSelectedBorrower] = useState<number | null>(selectedBorrowerId);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    channelId: '',
    loanId: ''
  });

  // Ref for the chart section to scroll to
  const chartRef = useRef<HTMLDivElement>(null);
  // Refs for borrower cards
  const borrowerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Update selected borrower when prop changes
  useEffect(() => {
    if (selectedBorrowerId !== null) {
      setSelectedBorrower(selectedBorrowerId);
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

  const filteredBorrowers = borrowersData.filter(borrower => 
    borrower.name.includes(searchQuery) ||
    borrower.phone.includes(searchQuery) ||
    borrower.channelId.includes(searchQuery)
  );

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({ name: '', phone: '', birthDate: '', channelId: '', loanId: '' });
  };

  const handleSubmit = () => {
    console.log('새 대출자 등록:', formData);
    handleReset();
  };

  const currentBorrowerData = borrowersData.find(b => b.id === selectedBorrower);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="이름, 전화번호, 채널 ID 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Borrowers Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              대출자 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredBorrowers.map((borrower) => (
                <div
                  key={borrower.id}
                  ref={(el) => (borrowerRefs.current[borrower.id] = el)}
                  onClick={() => setSelectedBorrower(borrower.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">채널 ID:</span>{' '}
                      <a
                        href={`https://www.youtube.com/channel/${borrower.channelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {borrower.channelId}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-600">대출 ID:</span> {borrower.loanId}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">최근 KPI 변화</div>
                    <div className="flex gap-4 text-sm">
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Borrower Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              신규 대출자 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="이름 입력"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="birthDate">생년월일</Label>
                <Input
                  id="birthDate"
                  placeholder="YYYY-MM-DD"
                  value={formData.birthDate}
                  onChange={(e) => handleFormChange('birthDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="channelId">채널 ID</Label>
                <Input
                  id="channelId"
                  placeholder="CH-2024-XXX"
                  value={formData.channelId}
                  onChange={(e) => handleFormChange('channelId', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="loanId">대출 ID</Label>
                <Input
                  id="loanId"
                  placeholder="LOAN-2024-XXX"
                  value={formData.loanId}
                  onChange={(e) => handleFormChange('loanId', e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmit} className="flex-1">
                  등록
                </Button>
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  초기화
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Borrower Chart */}
      {selectedBorrower && currentBorrowerData && (
        <Card ref={chartRef}>
          <CardHeader>
            <CardTitle>
              {currentBorrowerData.name}님의 월별 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={currentBorrowerData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="subscribers" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="views" orientation="right" stroke="#10b981" />
                <YAxis yAxisId="videos" orientation="right" stroke="#8b5cf6" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="subscribers"
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="구독자 수"
                  dot={{ fill: '#3b82f6' }}
                />
                <Line 
                  yAxisId="views"
                  type="monotone" 
                  dataKey="views" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="조회수"
                  dot={{ fill: '#10b981' }}
                />
                <Line 
                  yAxisId="videos"
                  type="monotone" 
                  dataKey="videos" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="영상 수"
                  dot={{ fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}