import React from 'react';
import styled from 'styled-components';
import { FileText, Shield, HelpCircle, Mail } from 'lucide-react';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-6);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--primary-light);
    border-radius: 50%;
    margin-bottom: var(--spacing-4);
    color: var(--primary);
  }
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-2);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--gray-600);
  }
`;

const Content = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  
  h2 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: var(--spacing-4);
  }
  
  ul {
    list-style: disc;
    padding-left: var(--spacing-6);
    margin-bottom: var(--spacing-4);
    
    li {
      color: var(--gray-700);
      margin-bottom: var(--spacing-2);
    }
  }
`;

const InfoPage = ({ type = 'terms' }) => {
  const getIcon = () => {
    switch (type) {
      case 'terms':
        return <FileText size={40} />;
      case 'privacy':
        return <Shield size={40} />;
      case 'faq':
        return <HelpCircle size={40} />;
      case 'support':
        return <Mail size={40} />;
      default:
        return <FileText size={40} />;
    }
  };

  const getContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'Terms & Conditions',
          subtitle: `Last Update: 10 Oct 2025 ` ,
          sections: [
            {
              heading: '1. Acceptance of Terms',
              content: 'By accessing and using Maternal Health Hub ("the Service"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service. These terms apply to all users, including pregnant women, partners, and healthcare providers.'
            },
            {
              heading: '2. Medical Disclaimer',
              content: 'The Service provides general health information and educational content only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with questions regarding pregnancy, medical conditions, or health concerns. Never disregard professional medical advice or delay seeking it because of information obtained through this Service. In case of medical emergency, call 912 immediately.'
            },
            {
              heading: '3. Use of Service',
              content: 'You agree to use the Service only for lawful purposes and in accordance with these Terms. You must be at least 13 years old to use this Service. You agree not to: (a) use the Service in any way that violates applicable laws or regulations; (b) impersonate any person or entity; (c) interfere with or disrupt the Service; (d) attempt to gain unauthorized access to any part of the Service; (e) use automated systems to access the Service without permission.'
            },
            {
              heading: '4. User Account',
              content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.'
            },
            {
              heading: '5. Privacy and Data Protection',
              content: 'Your use of the Service is also governed by our Privacy Policy. We are committed to protecting your personal health information in accordance with Rwanda\'s data protection laws. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.'
            },
            {
              heading: '6. Intellectual Property',
              content: 'All content, features, and functionality of the Service, including text, graphics, logos, and software, are owned by Maternal Health Hub or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.'
            },
            {
              heading: '7. User-Generated Content',
              content: 'You retain ownership of any content you submit through the Service. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content for the purpose of operating and improving the Service. You represent that you have all necessary rights to submit such content.'
            },
            {
              heading: '8. Limitation of Liability',
              content: 'To the fullest extent permitted by law, Maternal Health Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from your use or inability to use the Service. Our total liability shall not exceed the amount you paid to use the Service (if any).'
            },
            {
              heading: '9. Changes to Terms',
              content: 'We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.'
            },
            {
              heading: '10. Termination',
              content: 'We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately. All provisions that should survive termination shall survive, including ownership provisions and liability limitations.'
            },
            {
              heading: '11. Governing Law',
              content: 'These Terms shall be governed by and construed in accordance with the laws of the Republic of Rwanda, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of Rwanda.'
            },
            {
              heading: '12. Contact Information',
              content: 'If you have any questions about these Terms, please contact us through the Support page or email us at support@maternalhub.rw'
            }
          ]
        };

      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Last updated: October 10, 2025',
          sections: [
            {
              heading: '1. Introduction',
              content: 'Maternal Health Hub ("we," "our," or "us") is committed to protecting your privacy and personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. We comply with the Republic of Rwanda\'s data protection laws and international best practices for health data privacy.'
            },
            {
              heading: '2. Information We Collect',
              content: 'We collect several types of information: (a) Personal Information: name, email address, phone number, age, gender, and location (district/sector); (b) Health Information: pregnancy status, pregnancy start date, due date, current pregnancy week, health concerns, and chat history with our AI assistant; (c) Technical Information: IP address, browser type, device information, and usage data; (d) Location Data: your selected district and sector for finding nearby health centers.'
            },
            {
              heading: '3. How We Collect Information',
              content: 'We collect information through: (a) Direct input when you register, update your profile, or use our chatbot; (b) Automatic collection through cookies and similar technologies; (c) Third-party services like our AI chatbot provider (Chatbase) for processing your questions.'
            },
            {
              heading: '4. How We Use Your Information',
              content: 'We use your information to: (a) Provide personalized maternal health guidance and support; (b) Track your pregnancy progress and send relevant notifications; (c) Connect you with nearby health centers and emergency services; (d) Improve our Service through analytics and user feedback; (e) Communicate important updates, health tips, and service announcements; (f) Ensure the security and proper functioning of our Service; (g) Comply with legal obligations and protect against fraud.'
            },
            {
              heading: '5. Information Sharing and Disclosure',
              content: 'We do NOT sell your personal information. We may share your information only in these limited circumstances: (a) With your explicit consent; (b) With service providers who assist in operating our Service (e.g., cloud hosting, AI chatbot); (c) To comply with legal obligations, court orders, or government requests; (d) To protect the rights, safety, and security of our users and the public; (e) In connection with a business transfer, merger, or acquisition (with notice to you).'
            },
            {
              heading: '6. Data Security',
              content: 'We implement industry-standard security measures to protect your information: (a) Encryption of data in transit (HTTPS/SSL) and at rest; (b) Secure password hashing using bcrypt; (c) JWT token-based authentication; (d) Regular security audits and updates; (e) Access controls and monitoring. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.'
            },
            {
              heading: '7. Data Retention',
              content: 'We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account at any time. After deletion, we may retain certain information for legal compliance, fraud prevention, and legitimate business purposes. Chat history may be retained for service improvement but will be anonymized.'
            },
            {
              heading: '8. Your Rights and Choices',
              content: 'You have the right to: (a) Access and review your personal information; (b) Update or correct inaccurate information; (c) Delete your account and associated data; (d) Opt-out of non-essential communications; (e) Withdraw consent for data processing; (f) Request a copy of your data; (g) Lodge a complaint with data protection authorities. To exercise these rights, contact us through the Support page.'
            },
            {
              heading: '9. Cookies and Tracking',
              content: 'We use cookies and similar technologies to enhance your experience, remember your preferences (like language and location), analyze usage patterns, and maintain security. You can control cookies through your browser settings, but disabling them may affect Service functionality.'
            },
            {
              heading: '10. Third-Party Services',
              content: 'Our Service integrates with third-party services (Chatbase for AI chat, MongoDB Atlas for database). These providers have their own privacy policies. We carefully select partners who maintain high privacy and security standards. We are not responsible for the privacy practices of external websites linked from our Service.'
            },
            {
              heading: '11. Children\'s Privacy',
              content: 'Our Service is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected such information, please contact us immediately, and we will delete it.'
            },
            {
              heading: '12. International Data Transfers',
              content: 'Your information may be transferred to and processed in countries other than Rwanda where our service providers operate. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.'
            },
            {
              heading: '13. Changes to This Policy',
              content: 'We may update this Privacy Policy periodically. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy regularly. Continued use after changes constitutes acceptance.'
            },
            {
              heading: '14. Contact Us',
              content: 'If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at: Email: privacy@maternalhub.rw | Support Page: maternalhub.rw/support | Emergency: Call 912 for medical emergencies'
            }
          ]
        };

      case 'faq':
        return {
          title: 'Frequently Asked Questions',
          subtitle: 'Find answers to common questions',
          sections: [
            {
              heading: 'What is Maternal Health Hub?',
              content: 'Maternal Health Hub is a comprehensive digital platform designed to provide health guidance, support, and resources for pregnant women and new mothers in Rwanda. We offer an AI-powered chatbot, pregnancy tracking, health center locator, mental health resources, and a dedicated Dad\'s Corner for partners. Our mission is to make maternal health information accessible to everyone in their preferred language (Kinyarwanda, English, or French).'
            },
            {
              heading: 'Is this service free?',
              content: 'Yes! All our core services are completely free to use. We believe that access to maternal health information is a fundamental right and should not be limited by financial barriers. Our service is supported to ensure that every woman in Rwanda can access quality health guidance regardless of their economic situation.'
            },
            {
              heading: 'How do I create an account?',
              content: 'Creating an account is simple: Click "Login/Register" in the navigation menu, select "Register," fill in your basic information (name, email, phone, age), provide pregnancy details if applicable, choose your preferred language, and click "Register." You\'ll receive a confirmation and can immediately start using all features. Your information is kept secure and private.'
            },
            {
              heading: 'Can I use this in my language?',
              content: 'Absolutely! We support three languages: Kinyarwanda (Ikinyarwanda), English, and French (Français). You can select your preferred language during registration or change it anytime in your profile settings. Our AI chatbot can understand and respond in all three languages, making health information accessible to all Rwandans.'
            },
            {
              heading: 'Is the chatbot a replacement for a doctor?',
              content: 'No, definitely not. Our AI chatbot provides general health information, educational content, and guidance based on medical best practices. However, it is NOT a substitute for professional medical advice, diagnosis, or treatment. You should always consult with qualified healthcare professionals for medical concerns. For emergencies, call 912 or visit your nearest health center immediately.'
            },
            {
              heading: 'How does the pregnancy tracker work?',
              content: 'The pregnancy tracker helps you monitor your pregnancy journey week by week. After entering your pregnancy start date or due date, the system automatically calculates your current week and provides relevant information, tips, and milestones for that stage. You\'ll receive personalized guidance on what to expect, important checkups, nutrition advice, and warning signs to watch for.'
            },
            {
              heading: 'How do I find health centers near me?',
              content: 'Navigate to the "Health Centers" page, select your district and sector from the modal that appears, and the system will display health centers in your area with their contact information, operating hours, distance from your location, and services offered. You can also see emergency contact numbers and get directions to the nearest facility.'
            },
            {
              heading: 'What is the Dad\'s Corner?',
              content: 'Dad\'s Corner is a dedicated section for partners, fathers, and support persons. It provides guidance on how to support pregnant partners, what to expect during pregnancy and childbirth, tips for being an involved parent, mental health resources for fathers, and answers to common questions partners have. We believe that maternal health is a family journey.'
            },
            {
              heading: 'Is my personal information safe?',
              content: 'Yes, we take data security very seriously. We use industry-standard encryption (HTTPS/SSL), secure password hashing, JWT authentication, and comply with Rwanda\'s data protection laws. Your health information is never sold to third parties. We only share data with service providers necessary to operate the platform, and you have full control over your data. See our Privacy Policy for complete details.'
            },
            {
              heading: 'Can I delete my account?',
              content: 'Yes, you have the right to delete your account at any time. Go to your Profile page, scroll to the bottom, and click "Delete Account." This will permanently remove your personal information from our system. Some anonymized data may be retained for legal compliance and service improvement, but it will not be linked to you.'
            },
            {
              heading: 'What should I do in a medical emergency?',
              content: 'In case of a medical emergency, do NOT rely on the chatbot. Call 912 immediately or go to the nearest health center. Emergency signs during pregnancy include: severe bleeding, severe abdominal pain, sudden swelling of face/hands, severe headache with vision changes, baby not moving, water breaking before 37 weeks, or fever above 38°C. Your safety is the top priority.'
            },
            {
              heading: 'How accurate is the information provided?',
              content: 'Our content is based on evidence-based medical guidelines from WHO, Rwanda Ministry of Health, and international maternal health organizations. However, every pregnancy is unique, and information provided is general in nature. Always consult your healthcare provider for personalized medical advice. We regularly update our content to reflect the latest medical research and guidelines.'
            },
            {
              heading: 'Can I use this service if I\'m not pregnant?',
              content: 'Yes! While our primary focus is maternal health, we also provide valuable information for women planning pregnancy, postpartum mothers, partners, and anyone interested in maternal health topics. You can access educational content, health center information, and general wellness resources even if you\'re not currently pregnant.'
            },
            {
              heading: 'Does the service work offline?',
              content: 'Some features require an internet connection, particularly the AI chatbot and real-time health center information. However, we\'re working on offline capabilities for essential content. When offline, you\'ll see a notification, and some cached content may still be accessible. We recommend using the service with an internet connection for the best experience.'
            },
            {
              heading: 'How do I report a problem or give feedback?',
              content: 'We value your feedback! You can contact us through the Support page, email us at support@maternalhub.rw, or use the feedback option in your profile. For technical issues, please include details about the problem, your device/browser, and steps to reproduce the issue. We aim to respond to all inquiries within 24-48 hours.'
            },
            {
              heading: 'Will I receive notifications?',
              content: 'Yes, if you enable notifications, you\'ll receive helpful reminders about prenatal checkups, pregnancy milestones, health tips, and important updates. You can customize notification preferences in your profile settings. We respect your privacy and won\'t spam you – only essential and helpful information will be sent.'
            }
          ]
        };

      case 'support':
        return {
          title: 'Support & Contact',
          subtitle: 'We\'re here to help you',
          sections: [
            {
              heading: '🚨 Medical Emergencies',
              content: 'For medical emergencies, DO NOT use this platform. Call 912 immediately or go to your nearest health center. Emergency signs include: severe bleeding, severe abdominal pain, sudden swelling, severe headache with vision changes, baby not moving, water breaking before 37 weeks, fever above 38°C, or any other urgent medical concern.'
            },
            {
              heading: '📧 General Support',
              content: 'For questions, feedback, or assistance with using Maternal Health Hub, contact us at: Email: support@maternalhub.rw | Response time: Within 24-48 hours | Available: Monday - Friday, 8:00 AM - 5:00 PM (Rwanda Time)'
            },
            {
              heading: '🔒 Privacy & Data Concerns',
              content: 'For privacy-related questions, data access requests, or account deletion: Email: privacy@maternalhub.rw | We take your privacy seriously and will respond promptly to all data-related inquiries.'
            },
            {
              heading: '🐛 Technical Issues',
              content: 'Experiencing technical problems? Please email us with: (1) Description of the issue, (2) Your device and browser information, (3) Steps to reproduce the problem, (4) Screenshots if applicable. Email: tech@maternalhub.rw'
            },
            {
              heading: '💡 Feature Requests & Feedback',
              content: 'We value your input! Share your ideas for new features, improvements, or general feedback. Your suggestions help us serve you better. Email: feedback@maternalhub.rw'
            },
            {
              heading: '🏥 Health Center Information',
              content: 'To update health center information, report incorrect data, or add a new facility: Email: healthcenters@maternalhub.rw | Include: facility name, location, contact details, and services offered.'
            },
            {
              heading: '🤝 Partnerships & Collaborations',
              content: 'Interested in partnering with us or collaborating on maternal health initiatives? We welcome healthcare providers, NGOs, and organizations. Email: partnerships@maternalhub.rw'
            },
            {
              heading: '📱 Social Media',
              content: 'Follow us for health tips, updates, and community support: Twitter: @MaternalHubRW | Facebook: Maternal Health Hub Rwanda | Instagram: @maternalhub_rw'
            },
            {
              heading: '❓ Frequently Asked Questions',
              content: 'Before reaching out, check our FAQ page for answers to common questions about account management, features, privacy, and more. Many questions can be resolved quickly through our comprehensive FAQ section.'
            },
            {
              heading: '🌍 Language Support',
              content: 'We provide support in Kinyarwanda, English, and French. Please specify your preferred language when contacting us, and we\'ll respond accordingly.'
            },
            {
              heading: '📍 Office Location',
              content: 'Maternal Health Hub | Kigali, Rwanda | For in-person inquiries, please email us first to schedule an appointment.'
            },
            {
              heading: '⏰ Response Times',
              content: 'General inquiries: 24-48 hours | Technical issues: 48-72 hours | Privacy requests: 5-7 business days | Emergency medical concerns: Call 912 immediately, do not email'
            }
          ]
        };

      default:
        return {
          title: 'Information',
          subtitle: 'Welcome',
          sections: []
        };
    }
  };

  const content = getContent();

  return (
    <Container>
      <Header>
        <div className="icon">{getIcon()}</div>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </Header>

      <Content>
        {content.sections.map((section, index) => (
          <div key={index}>
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </Content>
    </Container>
  );
};

export default InfoPage;
