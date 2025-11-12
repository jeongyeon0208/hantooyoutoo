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
  const [selectedBorrowerId, setSelectedBorrowerId] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [isAlertPopoverOpen, setIsAlertPopoverOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 컴포넌트 마운트 시 알림 데이터 생성
  useEffect(() => {
    const alerts = generateAllAlerts();
    setAlertsData(alerts);
  }, []);

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 알림 버튼이나 팝오버 내부를 클릭한 경우가 아니라면 팝오버 닫기
      const target = event.target;
      const popoverContent = target.closest('[data-radix-popper-content-wrapper]');
      const alertButton = target.closest('[data-alert-button]');
      
      if (!popoverContent && !alertButton && isAlertPopoverOpen) {
        setIsAlertPopoverOpen(false);
      }
    };

    if (isAlertPopoverOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAlertPopoverOpen]);

  const handleAlertClick = (identifier, event) => {
    // 이벤트 전파 중단 - 팝오버 내부 클릭만 처리
    if (event) {
      event.stopPropagation();
    }

    // identifier가 number이면 borrowerId, string이면 channelId로 처리
    if (typeof identifier === 'number') {
      setSelectedBorrowerId(identifier);
    } else {
      // channelId로부터 borrowerId 찾기
      const borrower = borrowersData.find(b => b.channelId === identifier);
      if (borrower) {
        setSelectedBorrowerId(borrower.id);
      }
    }
    
    setActiveTab('borrower');
    setIsAlertPopoverOpen(false); // 즉시 팝오버 닫기
  };

  // 다른 컴포넌트용 단순 핸들러
  const handleSimpleAlertClick = (identifier) => {
    handleAlertClick(identifier, null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-6 sm:px-8 lg:px-10">
            
            {/* 데스크톱 레이아웃 - 한 줄 (lg 이상) */}
            <div 
              className="hidden lg:flex desktop-only force-desktop-only items-center justify-between py-6 lg:py-8"
              style={{ display: !isMobile ? 'flex' : 'none' }}
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img src={logo} alt="한국투자저축은행" className="h-12 sm:h-14 md:h-16 lg:h-18 flex-shrink-0" />
                </div>
                <div className="border-l border-gray-300 h-8 sm:h-10 md:h-12 hidden xs:block"></div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 truncate">한투 유투(Youtoo) 신용대출</h1>
                  <div className="text-sm sm:text-base md:text-lg text-gray-600 hidden sm:block mt-1">사후관리 시스템</div>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                {/* 알림 버튼 - 모든 탭에서 표시 */}
                <Popover open={isAlertPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="relative"
                      data-alert-button="desktop"
                      onClick={() => setIsAlertPopoverOpen(!isAlertPopoverOpen)}
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
                  <PopoverContent 
                    className="w-80 sm:w-96 p-0 border shadow-lg" 
                    align="end" 
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="bg-white rounded-md border">
                      {/* 고정 헤더 */}
                      <div className="p-4 sm:p-6 border-b bg-gray-50 rounded-t-md">
                        <h4 className="font-semibold text-base sm:text-lg text-gray-900 px-2">알림 목록</h4>
                        {alertsData && alertsData.length > 0 && (
                          <p className="text-xs sm:text-sm text-gray-600 m3-2 px-2">총 {alertsData.length}개의 알림</p>
                        )}
                      </div>
                      
                      {/* 스크롤 가능한 내용 영역 */}
                      <div 
                        className="overflow-y-scroll overflow-x-hidden alert-scroll-container"
                        style={{ 
                          height: '280px',
                          maxHeight: '50vh'
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
                                onClick={(e) => handleAlertClick(alert.borrowerId, e)}
                              >
                                <div className="flex items-start justify-between mb-3 gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 mb-1">
                                      {alert.borrowerName}
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
                <TabsList 
                  className="hidden lg:flex desktop-only h-12 lg:h-14"
                  style={{ display: !isMobile ? 'flex' : 'none' }}
                >
                  <TabsTrigger value="youtube" className="gap-2 lg:gap-3 text-sm lg:text-base xl:text-lg px-4 lg:px-6 py-3 lg:py-4">
                    <Youtube className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                    <span className="font-medium">유튜브 대시보드</span>
                  </TabsTrigger>
                  <TabsTrigger value="borrower" className="gap-2 lg:gap-3 text-sm lg:text-base xl:text-lg px-4 lg:px-6 py-3 lg:py-4">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                    <span className="font-medium">대출자 관리</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* 모바일/태블릿 레이아웃 - 두 줄 (lg 미만) */}
            <div 
              className="lg:hidden mobile-only force-mobile-only"
              style={{ display: isMobile ? 'block' : 'none' }}
            >
              {/* 첫 번째 줄: 로고, 제목, 알림 */}
              <div className="flex items-center justify-between py-4 sm:py-5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <img src={logo} alt="한국투자저축은행" className="h-8 sm:h-10 md:h-12 flex-shrink-0" />
                  <div className="border-l border-gray-300 h-6 sm:h-8 md:h-10 hidden xs:block"></div>
                  <div className="min-w-0">
                    <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">한투 유투(Youtoo) 신용대출</h1>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 hidden sm:block">사후관리 시스템</div>
                  </div>
                </div>                
                {/* 알림 버튼 - 모바일용 */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="relative flex-shrink-0"
                  data-alert-button="mobile"
                  onClick={() => setIsAlertPopoverOpen(!isAlertPopoverOpen)}
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {alertsData && alertsData.length > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-4 min-w-[16px] bg-red-500 text-white text-xs"
                    >
                      {alertsData.length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              {/* 두 번째 줄: 탭 메뉴 */}
              <div className="border-t border-gray-100 py-2">
                <TabsList 
                  className="lg:hidden mobile-only grid grid-cols-2 w-full h-10 sm:h-12"
                  style={{ display: isMobile ? 'grid' : 'none' }}
                >
                  <TabsTrigger value="youtube" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                    <Youtube className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">유튜브</span>
                  </TabsTrigger>
                  <TabsTrigger value="borrower" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">관리</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

          </div>
        </div>
        
        <TabsContent value="youtube" className="mt-0">
          <YoutubeDashboard 
            onAlertClick={handleSimpleAlertClick}
          />
        </TabsContent>
        
        <TabsContent value="borrower" className="mt-0">
          <BorrowerManagement 
            selectedBorrowerId={selectedBorrowerId} 
            onAlertClick={handleSimpleAlertClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}