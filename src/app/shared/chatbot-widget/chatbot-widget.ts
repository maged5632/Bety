import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.html',
  styleUrls: ['./chatbot-widget.css'],
})
export class ChatbotWidgetComponent {
  isOpen = false;
  inputText = '';

  messages: ChatMessage[] = [
    {
      from: 'bot',
      text: 'أهلاً بيك 👋 أنا مساعد Bety. اسألني عن استخدام الموقع أو الجولات الافتراضية أو التواصل معنا.',
    },
  ];

  // FAQ بسيطة نجاوب منها
  private faqs: { keywords: string[]; answer: string }[] = [
    {
      keywords: ['جولة', '360', 'افتراضية'],
      answer:
        'تقدر تفتح الجولة الافتراضية من صفحة العقار عن طريق زر "ابدأ الجولة الافتراضية". بعد ما تفتحها: اسحب علشان تلف، واضغط علشان تتحرك بين الغرف.',
    },
    {
      keywords: ['تسجيل', 'حساب', 'اسجل'],
      answer:
        'لتسجيل حساب جديد، استخدم زر "سجّل الآن" في الصفحة الرئيسية أو من أعلى الموقع إن كان متوفر.',
    },
    {
      keywords: ['تواصل', 'واتساب', 'رقم', 'موبايل'],
      answer:
        'للتواصل معنا، تقدر تستخدم أرقام التواصل أو الواتساب الظاهرة في صفحة "اتصل بنا" أو أسفل الموقع.',
    },
    {
      keywords: ['عقار', 'شقة', 'شقق', 'عقارات'],
      answer:
        'تقدر تستعرض العقارات من صفحة "العقارات" وتدخل على تفاصيل كل عقار عشان تشوف الصور والجولة الافتراضية لو متاحة.',
    },
  ];

  toggle() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const text = this.inputText.trim();
    if (!text) return;

    // ضيف رسالة المستخدم
    this.messages.push({ from: 'user', text });
    this.inputText = '';

    // رد بسيط مبني على الكلمات المفتاحية
    const reply = this.getBotReply(text);
    setTimeout(() => {
      this.messages.push({ from: 'bot', text: reply });
      // Scroll تلقائي لأسفل
      const box = document.querySelector('.chatbot-messages');
      if (box) {
        box.scrollTop = box.scrollHeight;
      }
    }, 200);
  }

  private getBotReply(userText: string): string {
    const text = userText.toLowerCase();

    for (const faq of this.faqs) {
      if (faq.keywords.some((k) => text.includes(k))) {
        return faq.answer;
      }
    }

    // رد افتراضي
    return 'ممكن توضح سؤالك أكتر؟ تقدر تسأل عن: الجولات الافتراضية، التسجيل، التواصل، أو طريقة عرض العقارات.';
  }

  // رسائل سريعة (أزرار جاهزة)
  quickAsk(text: string) {
    this.inputText = text;
    this.sendMessage();
  }
}
