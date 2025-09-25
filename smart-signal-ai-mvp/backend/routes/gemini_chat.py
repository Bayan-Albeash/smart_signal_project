from flask import Blueprint, request, jsonify
try:
    import google.generativeai as genai
except ImportError:
    genai = None
import os
import json
from datetime import datetime

gemini_chat_bp = Blueprint('gemini_chat', __name__)

# Configure Gemini AI
if genai:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY', 'your-gemini-api-key'))
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None

@gemini_chat_bp.route('/api/gemini/chat', methods=['POST'])
def chat_with_gemini():
    try:
        data = request.get_json()
        message = data.get('message', '')
        context = data.get('context', 'network_analysis')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Prepare context for Gemini
        system_prompt = f"""
        أنت مساعد ذكي متخصص في تحليل الشبكات الخلوية ونظام SmartSignal AI.
        مهمتك هي مساعدة المهندسين في فهم وتحليل أداء الشبكة.
        
        السياق: {context}
        
        قواعد الرد:
        1. اجب باللغة العربية دائماً
        2. كن مفيداً ومفصلاً في الإجابات
        3. قدم توصيات عملية قابلة للتطبيق
        4. استخدم المصطلحات التقنية المناسبة
        5. قدم رؤى مبنية على البيانات
        """
        
        # Generate response
        if model:
            response = model.generate_content(f"{system_prompt}\n\nسؤال المستخدم: {message}")
        else:
            # Mock response when Gemini is not available
            response = type('MockResponse', (), {
                'text': f"عذراً، خدمة Gemini AI غير متاحة حالياً. سؤالكم: {message}\n\nهذه استجابة تجريبية من النظام."
            })()
        
        # Extract insights and recommendations
        insights = extract_insights(response.text)
        recommendations = extract_recommendations(response.text)
        
        return jsonify({
            'success': True,
            'response': response.text,
            'insights': insights,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'response': 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
        }), 500

@gemini_chat_bp.route('/api/gemini/report', methods=['POST'])
def generate_gemini_report():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        format_type = data.get('format', 'pdf')
        
        # Extract conversation context
        conversation_text = '\n'.join([msg.get('content', '') for msg in messages])
        
        # Generate comprehensive report
        report_prompt = f"""
        بناءً على المحادثة التالية، قم بإنشاء تقرير شامل لتحليل الشبكة:
        
        المحادثة:
        {conversation_text}
        
        يرجى إنشاء تقرير يتضمن:
        1. ملخص تنفيذي
        2. تحليل الأداء الحالي
        3. التحديات المحددة
        4. التوصيات المقترحة
        5. خطة العمل
        6. المؤشرات الرئيسية
        
        اجعل التقرير مهنياً ومفصلاً.
        """
        
        if model:
            response = model.generate_content(report_prompt)
        else:
            # Mock response when Gemini is not available
            response = type('MockResponse', (), {
                'text': f"تقرير تجريبي بناءً على المحادثة:\n\n{conversation_text}\n\nهذا تقرير تجريبي من النظام."
            })()
        
        if format_type == 'pdf':
            # In a real implementation, you would generate PDF here
            return jsonify({
                'success': True,
                'report': response.text,
                'format': 'pdf',
                'filename': f'smartsignal-report-{datetime.now().strftime("%Y-%m-%d")}.pdf'
            })
        else:
            return jsonify({
                'success': True,
                'report': response.text,
                'format': 'text'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@gemini_chat_bp.route('/api/gemini/analyze', methods=['POST'])
def analyze_network_data():
    try:
        data = request.get_json()
        towers_data = data.get('towers', [])
        performance_data = data.get('performance', [])
        
        # Prepare data for analysis
        analysis_prompt = f"""
        قم بتحليل البيانات التالية للشبكة الخلوية:
        
        بيانات الأبراج:
        {json.dumps(towers_data, ensure_ascii=False, indent=2)}
        
        بيانات الأداء:
        {json.dumps(performance_data, ensure_ascii=False, indent=2)}
        
        يرجى تقديم:
        1. تحليل شامل للأداء
        2. تحديد المشاكل الرئيسية
        3. التوصيات للتحسين
        4. التوقعات المستقبلية
        5. مؤشرات الأداء الرئيسية
        """
        
        response = model.generate_content(analysis_prompt)
        
        return jsonify({
            'success': True,
            'analysis': response.text,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def extract_insights(text):
    """Extract insights from Gemini response"""
    insights = []
    lines = text.split('\n')
    
    for line in lines:
        if '💡' in line or 'رؤية' in line or 'تحليل' in line:
            insights.append(line.strip())
    
    return insights[:3]  # Return top 3 insights

def extract_recommendations(text):
    """Extract recommendations from Gemini response"""
    recommendations = []
    lines = text.split('\n')
    
    for line in lines:
        if '✅' in line or 'توصية' in line or 'نوصي' in line or 'يجب' in line:
            recommendations.append(line.strip())
    
    return recommendations[:3]  # Return top 3 recommendations
