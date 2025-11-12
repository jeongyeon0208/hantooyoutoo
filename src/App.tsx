import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Youtube, Users, Bell, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { YoutubeDashboard } from './components/YoutubeDashboard';
import { BorrowerManagement } from './components/BorrowerManagement';
import { borrowersData } from './components/SharedData';

const logo = '/src/assets/7a508a5e500c6022b788c500413b1c3692675726.png';

// 전체 대출자 대상으로 알림 생성
const generateAllAlerts = () => {
  try {
    if (!borrowersData || borrowersData.length === 0) {
      return [];
    }

    return borrowersData
      .filter(borrower => {
        // 변화율이 10% 이상인 경우만 알림 생성
        return Math.abs(borrower.subscribersChange) >= 10 || 
               Math.abs(borrower.viewsChange) >= 10 || 
               Math.abs(borrower.videosChange) >= 10;
      })
      .map(borrower => {
        // 가장 큰 변화율을 가진 지표 선택
        const changes = [
          { type: 'subscribers', value: borrower.subscribersChange, label: '구독자' },
          { type: 'views', value: borrower.viewsChange, label: '조회수' },
          { type: 'videos', value: borrower.videosChange, label: '영상수' }
        ];
        
        const maxChange = changes.reduce((max, current) => 
          Math.abs(current.value) > Math.abs(max.value) ? current : max
        );
        
        return {
          borrowerId: borrower.id,
          borrowerName: borrower.name,
          channelId: borrower.channelId,
          type: maxChange.value > 0 ? 'surge' : 'drop',
          metric: maxChange.type,
          change: Math.round(maxChange.value * 10) / 10, // 소수점 1자리로 반올림
          subscribers: borrower.subscribers,
          views: borrower.views,
          videos: borrower.videos,
          riskLevel: borrower.riskLevel,
          message: `${maxChange.label} ${maxChange.value > 0 ? '급상승' : '급감'}`
        };
      })
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change)); // 변화율이 큰 순으로 정렬
  } catch (error) {
    console.error('알림 생성 중 오류:', error);
    return [];
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('youtube');
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(null);
  const [alertsData, setAlertsData] = useState<any[]>([]);
  const [isAlertPopoverOpen, setIsAlertPopoverOpen] = useState(false);

  // 컴포넌트 마운트 시 알림 데이터 생성
  useEffect(() => {
    const alerts = generateAllAlerts();
    setAlertsData(alerts);
  }, []);

  const handleAlertClick = (borrowerId: number) => {
    setSelectedBorrowerId(borrowerId);
    setActiveTab('borrower');
    setIsAlertPopoverOpen(false); // 알림 팝오버 닫기
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="한국투자저축은행" className="h-12" />
                </div>
                <div className="border-l border-gray-300 h-8"></div>
                <div>
                  <h1 className="text-gray-800">한투 유투(Youtoo) 신용대출</h1>
                  <div className="text-sm text-gray-500">사후관리 시스템</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* 알림 버튼 - 모든 탭에서 표시 */}
                <Popover open={isAlertPopoverOpen} onOpenChange={setIsAlertPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="relative"
                    >
                      <Bell className="w-5 h-5" />
                      {alertsData && alertsData.length > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 min-w-[20px] bg-red-500 text-white text-xs"
                        >
                          {alertsData.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0 border shadow-lg" align="end">
                    <div className="bg-white rounded-md border">
                      {/* 고정 헤더 */}
                      <div className="p-4 border-b bg-gray-50 rounded-t-md">
                        <h4 className="font-semibold text-lg text-gray-900">알림 목록</h4>
                        {alertsData && alertsData.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">총 {alertsData.length}개의 알림</p>
                        )}
                      </div>
                      
                      {/* 스크롤 가능한 내용 영역 */}
                      <div 
                        className="overflow-y-scroll overflow-x-hidden alert-scroll-container"
                        style={{ 
                          height: '300px',
                          maxHeight: '300px'
                        }}
                      >
                        {!alertsData || alertsData.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-sm text-gray-500 text-center py-8 px-4">
                              현재 알림이 없습니다.
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 space-y-3">
                            {alertsData.map((alert, index) => (
                              <div 
                                key={`${alert.borrowerId}-${index}`}
                                className="p-4 rounded-lg border bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm" 
                                onClick={() => handleAlertClick(alert.borrowerId)}
                              >
                                <div className="flex items-start justify-between mb-3 gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 mb-1">
                                      {alert.borrowerName}
                                    </div>
                                    <div className="text-sm text-gray-600 mb-1">
                                      채널: {alert.channelName}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <span>채널 ID: {alert.channelId}</span>
                                      <a
                                        href={`https://www.youtube.com/channel/${alert.channelId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 ml-1"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={alert.type === 'surge' ? 'default' : 'destructive'}
                                    className={alert.type === 'surge' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                  >
                                    {alert.type === 'surge' ? '급상승' : '급감'}
                                  </Badge>
                                </div>
                                
                                <div className="bg-white rounded p-3 space-y-2">
                                  <div className="text-sm font-medium text-gray-900">
                                    {alert.message}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      {alert.change > 0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-600" />
                                      )}
                                      <span className={`text-sm font-medium ${alert.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {alert.change > 0 ? '+' : ''}{alert.change}%
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      위험도: <span className={`font-medium ${
                                        alert.riskLevel === 'high' ? 'text-red-600' : 
                                        alert.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                      }`}>
                                        {alert.riskLevel === 'high' ? '높음' : 
                                         alert.riskLevel === 'medium' ? '중간' : '정상'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div>구독자: {alert.subscribers?.toLocaleString() || 0}명</div>
                                    <div>조회수: {alert.views?.toLocaleString() || 0}회</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <TabsList>
                  <TabsTrigger value="youtube" className="gap-2">
                    <Youtube className="w-4 h-4" />
                    유튜브 대시보드
                  </TabsTrigger>
                  <TabsTrigger value="borrower" className="gap-2">
                    <Users className="w-4 h-4" />
                    대출자 관리
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>
        </div>
        
        <TabsContent value="youtube" className="mt-0">
          <YoutubeDashboard 
            onAlertClick={handleAlertClick}
          />
        </TabsContent>
        
        <TabsContent value="borrower" className="mt-0">
          <BorrowerManagement 
            selectedBorrowerId={selectedBorrowerId} 
            onAlertClick={handleAlertClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}