import React, { useState } from 'react';
import { Phone, Mail, ChevronDown, ChevronUp, Send, MapPin, CheckCircle2, ShieldCheck, Smartphone, Building } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FAQ_ITEMS = [
  {
    q: "Do you deliver all over Pakistan?",
    a: "Yes! We deliver nationwide to all major cities and towns across Pakistan (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad, Sukkur, Abbottabad, and more) via TCS Express and Leopards Courier."
  },
  {
    q: "How do I place an order on WhatsApp?",
    a: "Simply browse our collection, add items to your shopping bag or click 'Inquire & Order via WhatsApp'. Our app will generate a structured message sent directly to WhatsApp +92 333 5244191 with product images and details!"
  },
  {
    q: "Are all products 100% genuinely handmade?",
    a: "Every single item in the Bint-e-Waheed Collection is individually crafted by master Pakistani jewelers and leather artisans. No machine-produced items are ever sold. Each piece includes our Certificate of Authentic Handcrafting."
  },
  {
    q: "How long does delivery take within Pakistan?",
    a: "Standard delivery takes 2 to 4 business days. Lahore, Karachi, and Islamabad orders frequently arrive within 48 hours via express air courier."
  },
  {
    q: "Can I place a custom or bridal order?",
    a: "Yes! We specialize in bespoke wedding Kundan jewelry sets and hand-embroidered Zardozi velvet bags tailored to your bridal dress colors. Contact us on WhatsApp (+92 333 5244191) or Instagram DM (@b.w_collection0000)."
  },
  {
    q: "What if my item arrives damaged?",
    a: "We offer a 7-day money-back guarantee. If your parcel arrives damaged or incomplete, contact our concierge immediately on WhatsApp for a free replacement or instant refund."
  }
];

export const ContactFAQ = () => {
  const { showToast } = useShop();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '+92 333 5244191', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Message received! Our concierge team will reply on WhatsApp +92 333 5244191 within 24 hours.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#7A3B4E]">Pakistan Client Concierge</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1C1E]">How Can We Assist You?</h1>
        <p className="text-xs text-gray-500">Our concierge team is available 7 days a week for nationwide Pakistan support, custom bridal orders, and inquiries.</p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            icon: <InstagramIcon className="w-5 h-5" />,
            title: "Instagram DM",
            subtitle: "@b.w_collection0000",
            detail: "Fast response for product inquiry & custom orders",
            link: "https://www.instagram.com/b.w_collection0000?igsh=MXIyamh0cWdqcnlpNg=="
          },
          {
            icon: <Phone className="w-5 h-5" />,
            title: "WhatsApp Direct",
            subtitle: "+92 333 5244191",
            detail: "Mon–Sat: 10 AM – 8 PM (PKT)",
            link: "https://wa.me/923335244191"
          },
          {
            icon: <Mail className="w-5 h-5" />,
            title: "Email Support",
            subtitle: "concierge@bintewaheed.com",
            detail: "Replies within 24 business hours",
            link: "mailto:concierge@bintewaheed.com"
          }
        ].map((card, i) => (
          <a
            key={i}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft hover:shadow-bwc-card hover:border-[#F4A7B9] transition-all duration-300 flex flex-col items-center text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F4A7B9]/20 text-[#7A3B4E] group-hover:bg-[#7A3B4E] group-hover:text-white flex items-center justify-center transition-all duration-300">
              {card.icon}
            </div>
            <h3 className="font-serif font-bold text-base text-[#1C1C1E]">{card.title}</h3>
            <p className="text-xs font-semibold text-[#7A3B4E] font-mono">{card.subtitle}</p>
            <p className="text-xs text-gray-500">{card.detail}</p>
          </a>
        ))}
      </div>

      {/* Two-Column: FAQ + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#7A3B4E] mb-4 sm:mb-6">Frequently Asked Questions</h2>
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#7A3B4E]/10 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-start justify-between gap-4 px-4 sm:px-5 py-4 text-left"
              >
                <span className="text-xs font-bold text-[#1C1C1E] flex-1">{item.q}</span>
                <span className="text-[#7A3B4E] flex-shrink-0">
                  {openFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#7A3B4E]/10 shadow-bwc-soft space-y-5 sm:space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#7A3B4E]">Send a Bespoke Inquiry</h2>

          {submitted ? (
            <div className="py-8 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-[#96C99A]/20 text-[#96C99A] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1C1C1E]">Inquiry Submitted!</h3>
              <p className="text-xs text-gray-500">Our concierge team will personally respond to your WhatsApp or email.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 bg-[#7A3B4E] text-white text-xs font-bold rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                    placeholder="e.g. Ayesha"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none font-mono"
                    placeholder="+92 333 5244191"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none"
                >
                  <option>Bespoke Bridal Custom Order</option>
                  <option>WhatsApp Order Inquiry</option>
                  <option>Delivery Status Across Pakistan</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:border-[#7A3B4E] outline-none resize-none"
                  placeholder="Tell us about your custom requirements or inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#7A3B4E] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:bg-[#5E2C3B] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#F4A7B9]" />
                <span>Submit to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactFAQ;
