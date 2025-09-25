// Export utilities for CSV and PDF reports

export const exportToCSV = (data, filename = 'smartsignal-report') => {
  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToPDF = async (data, filename = 'smartsignal-report') => {
  try {
    const response = await fetch('/api/reports/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        filename: `${filename}-${new Date().toISOString().split('T')[0]}`,
        template: 'network-analysis'
      })
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } else {
      throw new Error('Failed to generate PDF')
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Fallback to client-side PDF generation
    generateClientSidePDF(data, filename)
  }
}

const convertToCSV = (data) => {
  if (!data || data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add headers
  csvRows.push(headers.join(','))

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    })
    csvRows.push(values.join(','))
  })

  return csvRows.join('\n')
}

const generateClientSidePDF = (data, filename) => {
  // Simple HTML to PDF conversion using browser's print functionality
  const htmlContent = generateHTMLReport(data)
  const printWindow = window.open('', '_blank')
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
        th { background-color: #f2f2f2; }
        .chart-placeholder { 
          width: 100%; 
          height: 200px; 
          border: 2px dashed #ccc; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 10px 0;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 1000)
}

const generateHTMLReport = (data) => {
  const currentDate = new Date().toLocaleDateString('ar-SA')
  
  return `
    <div class="header">
      <h1>تقرير SmartSignal AI</h1>
      <p>تاريخ التقرير: ${currentDate}</p>
    </div>
    
    <div class="section">
      <h2>ملخص الأداء</h2>
      <table>
        <tr>
          <th>المؤشر</th>
          <th>القيمة</th>
          <th>التغيير</th>
        </tr>
        <tr>
          <td>كفاءة الشبكة</td>
          <td>91%</td>
          <td>+12%</td>
        </tr>
        <tr>
          <td>رضا المستخدمين</td>
          <td>4.6/5</td>
          <td>+0.8</td>
        </tr>
        <tr>
          <td>استخدام الأبراج</td>
          <td>78%</td>
          <td>+5%</td>
        </tr>
        <tr>
          <td>معدل النجاح</td>
          <td>97%</td>
          <td>+3%</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h2>تفاصيل الأبراج</h2>
      <table>
        <tr>
          <th>الاسم</th>
          <th>المدينة</th>
          <th>المشغل</th>
          <th>الحمل</th>
          <th>السعة</th>
          <th>النسبة</th>
          <th>الحالة</th>
        </tr>
        ${data.map(tower => `
          <tr>
            <td>${tower.name || 'غير محدد'}</td>
            <td>${tower.city || 'غير محدد'}</td>
            <td>${tower.operator || 'غير محدد'}</td>
            <td>${tower.currentLoad || 0}</td>
            <td>${tower.capacity || 200}</td>
            <td>${Math.round((tower.currentLoad || 0) / (tower.capacity || 200) * 100)}%</td>
            <td>${getStatusText(tower.status)}</td>
          </tr>
        `).join('')}
      </table>
    </div>

    <div class="section">
      <h2>الرسوم البيانية</h2>
      <div class="chart-placeholder">
        <p>رسم بياني لأداء الشبكة على مدار 24 ساعة</p>
      </div>
      <div class="chart-placeholder">
        <p>خريطة حرارية لتوزيع الحمل</p>
      </div>
    </div>

    <div class="section">
      <h2>التوصيات</h2>
      <ul>
        <li>تطبيق خوارزمية إعادة التوزيع الذكي على أبراج منطقة وسط البلد</li>
        <li>زيادة السعة في ساعات الذروة (8-10 صباحاً و 5-7 مساءً)</li>
        <li>مراقبة مستمرة للأبراج المحملة زائد</li>
        <li>تطبيق تحسينات إضافية لزيادة الكفاءة بنسبة 15%</li>
      </ul>
    </div>

    <div class="section">
      <h2>ملاحظات</h2>
      <p>تم إنشاء هذا التقرير تلقائياً بواسطة نظام SmartSignal AI. للحصول على مزيد من التفاصيل، يرجى التواصل مع فريق الدعم الفني.</p>
    </div>
  `
}

const getStatusText = (status) => {
  const statusMap = {
    'normal': 'عادي',
    'congested': 'مزدحم',
    'overloaded': 'محمل زائد'
  }
  return statusMap[status] || 'غير محدد'
}

// Export data for different report types
export const prepareTowerData = (towers) => {
  return towers.map(tower => ({
    'الاسم': tower.name,
    'المدينة': tower.city,
    'المشغل': tower.operator,
    'الحمل_الحالي': tower.currentLoad || 0,
    'السعة': tower.capacity || 200,
    'النسبة_المئوية': Math.round((tower.currentLoad || 0) / (tower.capacity || 200) * 100),
    'الحالة': getStatusText(tower.status),
    'خط_العرض': tower.position[0],
    'خط_الطول': tower.position[1]
  }))
}

export const prepareAnalyticsData = (kpis, performanceData) => {
  return {
    kpis: {
      'كفاءة_الشبكة': kpis.network_efficiency?.current || 91,
      'رضا_المستخدمين': kpis.user_satisfaction?.current || 4.6,
      'استخدام_الأبراج': kpis.tower_utilization?.current || 78,
      'معدل_النجاح': kpis.handover_success_rate?.current || 97
    },
    performance: performanceData.map(item => ({
      'الساعة': item.hour,
      'الكفاءة': item.efficiency,
      'زمن_الاستجابة': item.latency,
      'الإنتاجية': item.throughput
    }))
  }
}
