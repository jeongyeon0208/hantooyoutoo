// Shared data structure for borrowers
export interface Borrower {
  id: number;
  name: string;
  phone: string;
  birthDate: string;
  channelId: string;
  loanId: string;
  riskLevel: 'low' | 'medium' | 'high';
  subscribers: number;
  views: number;
  videos: number;
  subscribersChange: number;
  viewsChange: number;
  videosChange: number;
  monthlyData: Array<{
    month: string;
    subscribers: number;
    views: number;
    videos: number;
  }>;
}

export const borrowersData: Borrower[] = [
  {
    id: 1,
    name: '김소희',
    phone: '010-1234-5001',
    birthDate: '1995-03-12',
    channelId: 'UC-75---6clEI74Ra6DZNYbw',
    loanId: 'LOAN-2024-101',
    riskLevel: 'low',
    subscribers: 8500,
    views: 225000,
    videos: 48,
    subscribersChange: 28.5,
    viewsChange: 32.5,
    videosChange: 12.5,
    monthlyData: [
      { month: '1월', subscribers: 6200, views: 145000, videos: 38 },
      { month: '2월', subscribers: 6800, views: 162000, videos: 40 },
      { month: '3월', subscribers: 7200, views: 178000, videos: 42 },
      { month: '4월', subscribers: 7600, views: 192000, videos: 44 },
      { month: '5월', subscribers: 8000, views: 208000, videos: 46 },
      { month: '6월', subscribers: 8500, views: 225000, videos: 48 }
    ]
  },
  {
    id: 2,
    name: '박준영',
    phone: '010-1234-5002',
    birthDate: '1992-07-18',
    channelId: 'UCXdrJApeAsfWQG2ZvZ8aNlA', 
    loanId: 'LOAN-2024-105',
    riskLevel: 'high',
    subscribers: 5200,
    views: 128000,
    videos: 35,
    subscribersChange: -8.5,
    viewsChange: -15.2,
    videosChange: -5.4,
    monthlyData: [
      { month: '1월', subscribers: 6500, views: 168000, videos: 42 },
      { month: '2월', subscribers: 6200, views: 158000, videos: 40 },
      { month: '3월', subscribers: 5900, views: 148000, videos: 38 },
      { month: '4월', subscribers: 5600, views: 138000, videos: 37 },
      { month: '5월', subscribers: 5400, views: 132000, videos: 36 },
      { month: '6월', subscribers: 5200, views: 128000, videos: 35 }
    ]
  },
  {
    id: 3,
    name: '강지우',
    phone: '010-2345-6003',
    birthDate: '1988-11-25',
    channelId: 'UCTdMHmzV9J5gihbNrnuqEvA',
    loanId: 'LOAN-2024-301',
    riskLevel: 'high',
    subscribers: 38000,
    views: 920000,
    videos: 68,
    subscribersChange: -12.5,
    viewsChange: -8.2,
    videosChange: -3.0,
    monthlyData: [
      { month: '1월', subscribers: 45000, views: 1080000, videos: 74 },
      { month: '2월', subscribers: 43500, views: 1040000, videos: 72 },
      { month: '3월', subscribers: 42000, views: 1000000, videos: 71 },
      { month: '4월', subscribers: 40500, views: 970000, videos: 70 },
      { month: '5월', subscribers: 39000, views: 945000, videos: 69 },
      { month: '6월', subscribers: 38000, views: 920000, videos: 68 }
    ]
  },
  {
    id: 4,
    name: '윤하은',
    phone: '010-2345-6004',
    birthDate: '1993-05-08',
    channelId: 'UCyvPtbIraoE2GVDdoG1h6pA',
    loanId: 'LOAN-2024-305',
    riskLevel: 'low',
    subscribers: 48000,
    views: 1250000,
    videos: 82,
    subscribersChange: 15.2,
    viewsChange: 18.5,
    videosChange: 21.5,
    monthlyData: [
      { month: '1월', subscribers: 38000, views: 950000, videos: 62 },
      { month: '2월', subscribers: 40500, views: 1020000, videos: 66 },
      { month: '3월', subscribers: 42500, views: 1100000, videos: 70 },
      { month: '4월', subscribers: 44500, views: 1160000, videos: 74 },
      { month: '5월', subscribers: 46000, views: 1200000, videos: 78 },
      { month: '6월', subscribers: 48000, views: 1250000, videos: 82 }
    ]
  },
  {
    id: 5,
    name: '정수민',
    phone: '010-3456-7005',
    birthDate: '1990-09-14',
    channelId: 'UCM1hs5vKsc2egU10vzX8b4w', 
    loanId: 'LOAN-2024-401',
    riskLevel: 'low',
    subscribers: 68000,
    views: 1850000,
    videos: 95,
    subscribersChange: 25.3,
    viewsChange: 28.8,
    videosChange: 15.8,
    monthlyData: [
      { month: '1월', subscribers: 52000, views: 1320000, videos: 78 },
      { month: '2월', subscribers: 56000, views: 1450000, videos: 82 },
      { month: '3월', subscribers: 59500, views: 1580000, videos: 86 },
      { month: '4월', subscribers: 62500, views: 1680000, videos: 89 },
      { month: '5월', subscribers: 65000, views: 1760000, videos: 92 },
      { month: '6월', subscribers: 68000, views: 1850000, videos: 95 }
    ]
  },
  {
    id: 6,
    name: '강동원',
    phone: '010-4567-8006',
    birthDate: '1987-02-21',
    channelId: 'UCoPbeiB6nmzEvowG3PcwDwQ',
    loanId: 'LOAN-2024-001',
    riskLevel: 'low',
    subscribers: 125000,
    views: 3850000,
    videos: 245,
    subscribersChange: 25.5,
    viewsChange: 30.2,
    videosChange: 8.5,
    monthlyData: [
      { month: '1월', subscribers: 95000, views: 2800000, videos: 220 },
      { month: '2월', subscribers: 102000, views: 3050000, videos: 225 },
      { month: '3월', subscribers: 109000, views: 3280000, videos: 230 },
      { month: '4월', subscribers: 115000, views: 3450000, videos: 235 },
      { month: '5월', subscribers: 120000, views: 3620000, videos: 240 },
      { month: '6월', subscribers: 125000, views: 3850000, videos: 245 }
    ]
  },
  {
    id: 7,
    name: '송혜교',
    phone: '010-4567-8007',
    birthDate: '1989-06-30',
    channelId: 'UCxc1zCIwPEOMeEUC7tfu0-w',
    loanId: 'LOAN-2024-012',
    riskLevel: 'low',
    subscribers: 152000,
    views: 5280000,
    videos: 285,
    subscribersChange: 18.2,
    viewsChange: 42.1,
    videosChange: 12.0,
    monthlyData: [
      { month: '1월', subscribers: 125000, views: 3500000, videos: 248 },
      { month: '2월', subscribers: 131000, views: 3850000, videos: 255 },
      { month: '3월', subscribers: 137000, views: 4200000, videos: 262 },
      { month: '4월', subscribers: 143000, views: 4600000, videos: 269 },
      { month: '5월', subscribers: 148000, views: 4950000, videos: 277 },
      { month: '6월', subscribers: 152000, views: 5280000, videos: 285 }
    ]
  },
  {
    id: 8,
    name: '박서준',
    phone: '010-4567-8008',
    birthDate: '1991-12-05',
    channelId: 'UCUgp8Lli-2w9AQ0cXEqgxpg',
    loanId: 'LOAN-2024-008',
    riskLevel: 'high',
    subscribers: 118000,
    views: 4250000,
    videos: 268,
    subscribersChange: -5.5,
    viewsChange: -18.3,
    videosChange: -8.2,
    monthlyData: [
      { month: '1월', subscribers: 132000, views: 5800000, videos: 298 },
      { month: '2월', subscribers: 129000, views: 5450000, videos: 292 },
      { month: '3월', subscribers: 126000, views: 5100000, videos: 285 },
      { month: '4월', subscribers: 123000, views: 4750000, videos: 278 },
      { month: '5월', subscribers: 120000, views: 4500000, videos: 273 },
      { month: '6월', subscribers: 118000, views: 4250000, videos: 268 }
    ]
  },
  {
    id: 9,
    name: '김태희',
    phone: '010-4567-8009',
    birthDate: '1986-04-17',
    channelId: 'UCSxhYq6K0mxF24SmMGeNNQA',
    loanId: 'LOAN-2024-015',
    riskLevel: 'medium',
    subscribers: 142000,
    views: 4850000,
    videos: 295,
    subscribersChange: -12.7,
    viewsChange: -6.8,
    videosChange: 2.5,
    monthlyData: [
      { month: '1월', subscribers: 168000, views: 5400000, videos: 285 },
      { month: '2월', subscribers: 163000, views: 5250000, videos: 287 },
      { month: '3월', subscribers: 158000, views: 5120000, videos: 289 },
      { month: '4월', subscribers: 153000, views: 5000000, videos: 291 },
      { month: '5월', subscribers: 147000, views: 4920000, videos: 293 },
      { month: '6월', subscribers: 142000, views: 4850000, videos: 295 }
    ]
  }
];
