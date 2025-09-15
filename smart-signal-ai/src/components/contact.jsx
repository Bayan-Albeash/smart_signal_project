import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    message: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('تم إرسال البيانات:', formData);
    alert('شكرًا لتواصلك! سنراجع طلبك قريبًا.');
    // يمكنك إضافة منطق الإرسال هنا (مثل طلب API)
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
      style={{ 
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)'
      }}
    >
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
            <span>SmartSignal AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            تواصل معنا
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن هنا لدعمك في تحسين شبكات الاتصالات الذكية وإدارة أحمال الأبراج بكفاءة عالية
          </p>
        </div>

        {/* Main Contact Card */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center pb-6">
            <CardTitle className="text-2xl font-semibold">ارسل لنا رسالتك</CardTitle>
            <p className="text-blue-100 mt-2">سنرد عليك في أقرب وقت ممكن</p>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                      1
                    </span>
                    الاسم الكامل
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="w-full pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-blue-600" /> 
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    required
                    className="w-full pl-10 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-green-600" /> 
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="أدخل رقم هاتفك (مثال: +962 79 999 9999)"
                  required
                  className="w-full pl-10 focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center">
                  <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
                    📝
                  </span>
                  الرسالة
                </Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="اكتب رسالتك هنا... نحن مهتمون بسماع اقتراحاتك واستفساراتك حول حلول إدارة الشبكات الذكية"
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-vertical min-h-[120px]"
                  rows="4"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  إرسال الرسالة
                </span>
              </Button>
            </form>

            {/* Contact Info Section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">أو تواصل معنا مباشرة</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Email Contact */}
                <div className="text-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">البريد الإلكتروني</h4>
                  <a 
                    href="mailto:support@smartsignal.ai" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium break-all"
                  >
                    support@smartsignal.ai
                  </a>
                </div>

                {/* Phone Contact */}
                <div className="text-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">الهاتف</h4>
                  <a 
                    href="tel:+962799999999" 
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    +962 79 999 9999
                  </a>
                </div>

                {/* Location Contact */}
                <div className="text-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">الموقع</h4>
                  <p className="text-purple-600 text-sm font-medium">عمان، الأردن</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
                <p>ساعات العمل: من الأحد إلى الخميس، 9:00 ص - 6:00 م</p>
                <p>جميع الحقوق محفوظة © 2025 SmartSignal AI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Features Highlight */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ذكاء اصطناعي متقدم</h3>
            <p className="text-sm text-gray-600">حلول ذكية لإدارة أحمال الشبكات</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">كفاءة عالية</h3>
            <p className="text-sm text-gray-600">توازن مثالي لأداء الشبكات</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">دعم 24/7</h3>
            <p className="text-sm text-gray-600">فريق متخصص جاهز لمساعدتك</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;