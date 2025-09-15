const jordanTowers = [
  {
    id: 1,
    name: 'برج عمان - وسط البلد',
    position: [31.9565, 35.9239],
    city: 'عمان',
    operator: 'زين الأردن',
    capacity: 200,
    currentLoad: 180,
    status: 'congested',
    coverage: 6000,
    users: [
      { type: 'call', count: 60 },
      { type: 'data', count: 90 },
      { type: 'video', count: 30 }
    ]
  },
  {
    id: 2,
    name: 'برج الزرقاء - الجديدة',
    position: [32.0833, 36.0933],
    city: 'الزرقاء',
    operator: 'أورانج الأردن',
    capacity: 150,
    currentLoad: 110,
    status: 'normal',
    coverage: 5000,
    users: [
      { type: 'call', count: 40 },
      { type: 'data', count: 50 },
      { type: 'video', count: 20 }
    ]
  },
  {
    id: 3,
    name: 'برج إربد - جامعة اليرموك',
    position: [32.5486, 35.8519],
    city: 'إربد',
    operator: 'أمنية',
    capacity: 180,
    currentLoad: 170,
    status: 'congested',
    coverage: 5500,
    users: [
      { type: 'call', count: 55 },
      { type: 'data', count: 80 },
      { type: 'video', count: 35 }
    ]
  },
  {
    id: 4,
    name: 'برج العقبة - المنطقة الاقتصادية',
    position: [29.5320, 35.0063],
    city: 'العقبة',
    operator: 'زين الأردن',
    capacity: 100,
    currentLoad: 95,
    status: 'congested',
    coverage: 4000,
    users: [
      { type: 'call', count: 30 },
      { type: 'data', count: 45 },
      { type: 'video', count: 20 }
    ]
  },
  {
    id: 5,
    name: 'برج السلط - وسط المدينة',
    position: [32.0388, 35.7331],
    city: 'السلط',
    operator: 'أورانج الأردن',
    capacity: 120,
    currentLoad: 70,
    status: 'normal',
    coverage: 4500,
    users: [
      { type: 'call', count: 25 },
      { type: 'data', count: 35 },
      { type: 'video', count: 10 }
    ]
  },
  {
    id: 6,
    name: 'برج مادبا - جبل نيبو',
    position: [31.7667, 35.7289],
    city: 'مادبا',
    operator: 'أمنية',
    capacity: 90,
    currentLoad: 85,
    status: 'congested',
    coverage: 3800,
    users: [
      { type: 'call', count: 30 },
      { type: 'data', count: 40 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 7,
    name: 'برج جرش - الآثار',
    position: [32.2729, 35.8926],
    city: 'جرش',
    operator: 'زين الأردن',
    capacity: 110,
    currentLoad: 60,
    status: 'normal',
    coverage: 4200,
    users: [
      { type: 'call', count: 20 },
      { type: 'data', count: 30 },
      { type: 'video', count: 10 }
    ]
  },
  {
    id: 8,
    name: 'برج عجلون - القلعة',
    position: [32.3333, 35.7500],
    city: 'عجلون',
    operator: 'أورانج الأردن',
    capacity: 80,
    currentLoad: 75,
    status: 'congested',
    coverage: 3500,
    users: [
      { type: 'call', count: 25 },
      { type: 'data', count: 35 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 9,
    name: 'برج الكرك - القلعة',
    position: [31.1801, 35.7048],
    city: 'الكرك',
    operator: 'أمنية',
    capacity: 100,
    currentLoad: 50,
    status: 'normal',
    coverage: 4000,
    users: [
      { type: 'call', count: 15 },
      { type: 'data', count: 25 },
      { type: 'video', count: 10 }
    ]
  },
  {
    id: 10,
    name: 'برج معان - وسط المدينة',
    position: [30.1918, 35.7383],
    city: 'معان',
    operator: 'زين الأردن',
    capacity: 70,
    currentLoad: 65,
    status: 'congested',
    coverage: 3000,
    users: [
      { type: 'call', count: 20 },
      { type: 'data', count: 30 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 11,
    name: 'برج الطفيلة - الجامعة',
    position: [30.8579, 35.6063],
    city: 'الطفيلة',
    operator: 'أورانج الأردن',
    capacity: 85,
    currentLoad: 40,
    status: 'normal',
    coverage: 3500,
    users: [
      { type: 'call', count: 10 },
      { type: 'data', count: 20 },
      { type: 'video', count: 10 }
    ]
  },
  {
    id: 12,
    name: 'برج الرمثا - الحدود',
    position: [32.5600, 35.9900],
    city: 'الرمثا',
    operator: 'أمنية',
    capacity: 130,
    currentLoad: 125,
    status: 'congested',
    coverage: 4800,
    users: [
      { type: 'call', count: 40 },
      { type: 'data', count: 60 },
      { type: 'video', count: 25 }
    ]
  },
  {
    id: 13,
    name: 'برج البتراء - المدخل',
    position: [30.3285, 35.4444],
    city: 'البتراء',
    operator: 'زين الأردن',
    capacity: 95,
    currentLoad: 90,
    status: 'congested',
    coverage: 3700,
    users: [
      { type: 'call', count: 30 },
      { type: 'data', count: 40 },
      { type: 'video', count: 20 }
    ]
  },
  {
    id: 14,
    name: 'برج وادي رم - المخيمات',
    position: [29.5700, 35.4100],
    city: 'وادي رم',
    operator: 'أورانج الأردن',
    capacity: 60,
    currentLoad: 55,
    status: 'congested',
    coverage: 2500,
    users: [
      { type: 'call', count: 15 },
      { type: 'data', count: 25 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 15,
    name: 'برج الأزرق - المحمية',
    position: [31.8750, 36.8250],
    city: 'الأزرق',
    operator: 'أمنية',
    capacity: 50,
    currentLoad: 30,
    status: 'normal',
    coverage: 2000,
    users: [
      { type: 'call', count: 10 },
      { type: 'data', count: 15 },
      { type: 'video', count: 5 }
    ]
  }
];

export default jordanTowers;


