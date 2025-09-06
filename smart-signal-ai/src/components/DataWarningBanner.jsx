import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { Info } from 'lucide-react'

const DataWarningBanner = () => {
  return (
    <Alert className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800" dir="rtl">
      <Info className="h-4 w-4" />
      <AlertTitle>تنبيه: بيانات محاكاة</AlertTitle>
      <AlertDescription>
        المعلومات المعروضة في هذا النظام هي لأغراض العرض التوضيحي والمحاكاة فقط، ولا تمثل بيانات شبكة حقيقية.
      </AlertDescription>
    </Alert>
  )
}

export default DataWarningBanner


