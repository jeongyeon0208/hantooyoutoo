import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Youtube, Users } from 'lucide-react';
import { YoutubeDashboard } from './components/YoutubeDashboard';
import { BorrowerManagement } from './components/BorrowerManagement';
import { borrowersData } from './components/SharedData';
import logo from 'figma:asset/7a508a5e500c6022b788c500413b1c3692675726.png';

export default function App() {
  const [activeTab, setActiveTab] = useState('youtube');
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(null);

  const handleAlertClick = (channelId: string) => {
    console.log('Alert clicked with channelId:', channelId);
    // Find borrower by channelId
    const borrower = borrowersData.find(
      (b) => b.channelId === channelId
    );
    console.log('Found borrower:', borrower);
    if (borrower) {
      setSelectedBorrowerId(borrower.id);
      setActiveTab('borrower');
      console.log('Set selected borrower ID to:', borrower.id);
    } else {
      console.log('No borrower found with channelId:', channelId);
    }
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
        
        <TabsContent value="youtube" className="mt-0">
          <YoutubeDashboard onAlertClick={handleAlertClick} />
        </TabsContent>
        
        <TabsContent value="borrower" className="mt-0">
          <BorrowerManagement selectedBorrowerId={selectedBorrowerId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}