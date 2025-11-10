import React from 'react';
import styled from 'styled-components';
import { 
  Heart, 
  Calendar, 
  BookOpen, 
  MessageCircle, 
  Home, 
  Shield,
  Users,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-4);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-8);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--gray-600);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const Section = styled.section`
  margin-bottom: var(--spacing-12);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--spacing-6);
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--primary);
    border-radius: 2px;
  }
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-6);
`;

const TipCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
  
  .icon {
    width: 64px;
    height: 64px;
    margin-bottom: var(--spacing-4);
    background: var(--primary-light);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
  }
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
  }
  
  p {
    color: var(--gray-600);
    line-height: 1.6;
    margin-bottom: var(--spacing-4);
  }
  
  .details {
    background: var(--gray-50);
    padding: var(--spacing-4);
    border-radius: var(--radius-lg);
    border-left: 4px solid var(--primary);
    
    h4 {
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: var(--spacing-2);
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    li {
      padding: var(--spacing-1) 0;
      color: var(--gray-700);
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-2);
      
      &::before {
        content: '•';
        color: var(--primary);
        font-weight: bold;
        margin-top: 2px;
      }
    }
  }
`;

const InfoCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-6);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-4);
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
  
  .content {
    color: var(--gray-700);
    line-height: 1.7;
  }
  
  .highlight {
    background: var(--primary-light);
    padding: var(--spacing-4);
    border-radius: var(--radius-lg);
    margin: var(--spacing-4) 0;
    border-left: 4px solid var(--primary);
  }
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
`;

const TimelineCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'var(--primary)'};
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
  
  .period {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--gray-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: var(--spacing-2);
  }
  
  h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    padding: var(--spacing-1) 0;
    color: var(--gray-700);
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-2);
    
    &::before {
      content: '✓';
      color: var(--primary);
      font-weight: bold;
      margin-top: 2px;
    }
  }
`;

const DadsCorner = () => {
  const { language } = useChat();

  const content = {
    
    rw: {
      Info: "Amakuru yingenzi ku bagabo",
      heading: "Ibyingenzi Ku bitegura kuba ababyeyi b'abagabo",
      title: "Uruhare rw'Umugabo",
      subtitle: "Urakaza neza ahangaha ushobora kumenya uko wakita k'umugore wawe igihe atwite na nyuma yo kubyara! Hano uzasanga inama zuzuye zo kugufasha kuba wakita k'umuryango wawe kandi utegure uruhare rwawe rushya nka se w'umwana.",
      tips: [
        {
          icon: Heart,
          title: "Uko wafasha umugore wawe kubijyanye n'imitekerereze",
          content: "Uko umufasha wawe agenda agira imihindagurikire y'umubiri n'imitekerereze. Uko utekereza kandi ugira ubwihangane ni ngombwa mu gihe nkicyo.",
          details: {
            title: "Uko Wafasha mu Bijyane n'Imitekerereze",
            items: [
              "Tega amatwi umufasha wawe kandi ntugerageza gukosora ibintu byose",
              "Shimangira ibyiyumvo bye n'ibyabaye",
              "Gira ubwihangane ku mihindagurikire y'imitekerereze ye",
              "Erekana urukundo n'umutekano k'umuryango",
              "Umwibutsire ko akora umwuga mwiza",
              "Ube umuvugizi we mugihe cy'ubuvuzi"
            ]
          }
        },
        {
          icon: Calendar,
          title: "Kwita ku Buvuzi",
          content: "Kujyana kwa muganga hamwe bigaragaza ko umuhate mw'ishyirwa mu bikorwa kandi bigufasha kumenya ibyerekeye ubw'ubwishingizi.",
          details: {
            title: "Ibyo wakora kwa Muganga",
            items: [
              "Baza ibibazo kerekeye ubw'ubwishingizi n'iterambere rw'umwana",
              "Andika amakuru y'ingenzi n'itariki",
              "Menya ibimenyetso byo kwitondera ",
              "Vuganira ibyerekeye gahunda y'ukubyara",
              "Umenye uruhare rwawe mu gihe cyo kubyara",
              "Fata amakuru yerekeranye na nyuma yo kubyara",
              "Icyo wakora kugirango bishyirwe mu bikorwa"
            ]
          }
        },
        {
          icon: BookOpen,
          title: "Kwiga no kwitegura",
          content: "Ubumenyi ni imbaraga. Iyo uzi ibyerekeye ubw'ubwishingizi, ukubyara, no kurera, ufasha neza umuryango wawe.",
          details: {
            title: "Ibyo Ukeneye Kumenya",
            items: [
              "Ibyiciro by'igihe cyo gutwita n'ibyo utegura buri trimester",
              "Ibimenyetso by'umugore utwite n'ubufasha watanga",
              "Igihe cyo kubyara",
              "Ibyo ugomba kwitaho by'ingenzi k'umwana wavutse",
              "Kwisuganya n'ubufasha k'umubyeyi nyuma yo kubyara ",
              "Gufasha mugihe cyo konsa n'ubundi bufasha ushobora guha uwo mwashakanye"
            ]
          }
        },
        {
          icon: MessageCircle,
          title: "Kugirana umubano no Gukorera Hamwe",
          content: "Kugira ibiganiro bifasha gutuma umubano wanyu ukomera ndetse no gukorera hamwe muri ibi bihe bya mbere na nyuma yo kubyara.",
          details: {
            title: "Uburyo bwo Kuvuganira",
            items: [
              "Gira ibiganiro by'ingenzi kerekeye ibyiyumvo n'ibibazo",
              "Vuganira ibyerekeye uko mubyeyi",
              "Tegura impinduka z'amafaranga n'inshingano",
              "Vuganira ibyerekeye gahunda y'umuryango",
              "Sangira ibibazo n'ibyishimo byawe",
              "Kora urusobe rw'ubufasha hamwe"
            ]
          }
        },
        {
          icon: Home,
          title: "Gufasha mu Nzu",
          content: "Gufasha mu mirimo y'umunsi n'inshingano z'umuryango bigabanya stress ya nyina wawe n'ubunaniye.",
          details: {
            title: "Uburyo Bwo Gufasha",
            items: [
              "Fata mirimo myinshi y'umuryango n'ubugenge",
              "Fasha mu gusura amasoko n'iteganyabirori",
              "Fasha mu kumwishimira no kuruhuka",
              "Tegura inzu kugira ngo umwana aze",
              "Menya iyo akeneye kuruhuka",
              "Ube uwo ari we wo gufasha"
            ]
          }
        },
        {
          icon: Shield,
          title: "Umutekano n'Utegura",
          content: "Kuba uteguye kugira ngo ufashwe n'ubumenyi bwo kurinda nyina wawe n'umwana byose biha umutekano.",
          details: {
            title: "Utegura Mutekano",
            items: [
              "Menya telefoni z'ubufasha n'uburyo",
              "Menya inzira yo kwa muganga",
              "Umenye ibimenyetso by'ubw'ubwishingizi",
              "Tegura igikapu cyo kwa muganga",
              "Shyira car seat neza mbere y'itari",
              "Rinda inzu yawe mbere"
            ]
          }
        }
      ],
      timeline: [
        {
          period: "Trimester ya 1 (Icyumweru 1-12)",
          title: "Gufasha mu Bw'ubwishingizi bwa Mbere",
          color: "#FF6B6B",
          items: [
            "Umenye ko ari kubyara n'ubunaniye",
            "Fasha mu mirimo y'umuryango",
            "Jya kwa muganga hamwe",
            "Tangira kumenya ibyerekeye amafunguro",
            "Gira ubwihangane ku mihindagurikire"
          ]
        },
        {
          period: "Trimester ya 2 (Icyumweru 13-26)",
          title: "Gukura Hamwe",
          color: "#4ECDC4",
          items: [
            "Umunsi wa mbere wo kugenda hamwe",
            "Jya kwa muganga wa ultrasound",
            "Tegura icyumba cy'umwana",
            "Vuganira gahunda yo kubyara",
            "Tangira amasomo yo kubyara"
          ]
        },
        {
          period: "Trimester ya 3 (Icyumweru 27-40)",
          title: "Utegura Nyuma",
          color: "#45B7D1",
          items: [
            "Fasha mu gutegura nyuma",
            "Egeranya uko uhagaze",
            "Tegura igikapu n'car seat",
            "Menya ibimenyetso byo kubyara",
            "Tegura kurwanya nyuma yo kubyara"
          ]
        },
        {
          period: "Nyuma yo Kubyara (Icyumweru 6 za Mbere)",
          title: "Umuryango Mushya",
          color: "#96CEB4",
          items: [
            "Fasha mu kurwanya nyuma yo kubyara",
            "Fasha mu kurwanya umwana",
            "Fata inshingano z'umuryango",
            "Fasha kw'ubw'ubwishingizi",
            "Reba ibimenyetso by'ubw'ubwishingizi"
          ]
        }
      ],
      warningTitle: "Ibimenyetso byo Kwitondera",
      warningContent: "Nubwo ubw'ubwishingizi buri butekanye, ni ngombwa kumenya iyo segerwa ubuvuzi. Iyo nyina wawe ahabwa ibi bimenyetso, vuganira na muganga we vuba:",
      emergencySigns: "Ibimenyetso by'Umutekano:",
      emergencyList: [
        "Uburwayi bw'ibyenda cyangwa gukubita",
        "Kw'ubw'ubwishingizi buhagaze",
        "Umutwe uhagaze, cyane cyane iyo ubona",
        "Kubyibuha mu maso, amaboko, cyangwa ibirenge",
        "Guhangayika cyangwa uburwayi bw'ikirere",
        "Umuriro urenga 100.4°F (38°C)",
        "Kugenda kwa mwana kunyegeje icyumweru 28"
      ],
      supportTitle: "Gukora Urusobe rw'Ubufasha",
      supportContent: "Ntibikenewe ko ukora uko! Gukora urusobe rw'ubufasha rw'ingenzi ni ngombwa kuri wewe n'umugore wawe. Dore uko ukora kandi ukomeza urusobe rwawe:",
      supportList: [
        "Umuryango n'Insangi: Menya abantu bafasha mu mirimo, ubufasha bw'umutima, n'ubw'ubwishingizi",
        "Itsinda rya Muganga: Kora ubufatanye na muganga, umubyeyi, n'abandi bavuzi",
        "Abandi Base: Huzwa n'abandi base bategenya cyangwa bashya",
        "Ibikorwa by'Umuryango: Shakisha amatsinda y'umuryango n'amasomo",
        "Ubufasha bw'Umwuga: Ntuhangayike gusaba ubufasha iyo uhagaye"
      ],
      selfCareTitle: "Kwita ku Buzima bwawe",
      selfCareContent: "Kwita ku buzima bwawe si ubw'ubwishingizi—ni ngombwa kugira ngo ushobore gufasha umugore wawe n'umuryango wawe neza. Uribuke ko ubuzima bwawe bukenewe.",
      selfCareStrategies: "Uburyo bwo Kwita ku Buzima:",
      selfCareList: [
        "Komeza gukora sport n'amafunguro meza",
        "Fata uruhuko rwuzuye iyo bishoboka",
        "Huzwa n'insangi kandi ukomeze ibikorwa byawe",
        "Egeranya uburyo bwo kurwanya stress",
        "Saba ubufasha bw'umwuga iyo uhagaye",
        "Uribuke ko byemewe gusaba ubufasha"
      ]
    },
    en: {
      Info: "Important information for Dads",
      heading: "Essential Tips for New Dads",
      title: "Dad's Corner",
      subtitle: "Welcome to your dedicated space for fatherhood support! Pregnancy and early parenthood are incredible journeys that transform both partners. Here you'll find comprehensive guidance to help you be the best support system for your partner and prepare for your new role as a father.",
      tips: [
        {
          icon: Heart,
          title: "Emotional Support & Understanding",
          content: "Your partner is going through significant physical and emotional changes. Your understanding and patience are crucial during this time.",
          details: {
            title: "How to Provide Emotional Support",
            items: [
              "Listen actively without trying to fix everything",
              "Validate her feelings and experiences",
              "Be patient with mood swings and emotional changes",
              "Show affection and physical comfort",
              "Remind her she's doing an amazing job",
              "Be her advocate in medical situations"
            ]
          }
        },
        {
          icon: Calendar,
          title: "Active Participation in Healthcare",
          content: "Attending appointments together shows your commitment and helps you stay informed about the pregnancy progress.",
          details: {
            title: "What to Do at Appointments",
            items: [
              "Ask questions about the pregnancy and baby's development",
              "Take notes on important information and dates",
              "Learn about warning signs to watch for",
              "Discuss birth plans and preferences",
              "Understand your role during labor and delivery",
              "Get information about postpartum care"
            ]
          }
        },
        {
          icon: BookOpen,
          title: "Education & Preparation",
          content: "Knowledge is power. The more you understand about pregnancy, childbirth, and parenting, the better you can support your family.",
          details: {
            title: "What to Learn About",
            items: [
              "Pregnancy stages and what to expect each trimester",
              "Common pregnancy symptoms and how to help",
              "Labor and delivery process",
              "Newborn care basics",
              "Postpartum recovery and support",
              "Breastfeeding support and alternatives"
            ]
          }
        },
        {
          icon: MessageCircle,
          title: "Open Communication & Teamwork",
          content: "Strong communication strengthens your relationship and helps you work together as a team during this important time.",
          details: {
            title: "Communication Strategies",
            items: [
              "Have regular check-ins about feelings and concerns",
              "Discuss parenting philosophies and goals",
              "Plan for financial changes and responsibilities",
              "Talk about division of household and childcare tasks",
              "Share your own fears and excitement",
              "Create a support network together"
            ]
          }
        },
        {
          icon: Home,
          title: "Practical Support at Home",
          content: "Help with daily tasks and household responsibilities can significantly reduce your partner's stress and physical strain.",
          details: {
            title: "Practical Ways to Help",
            items: [
              "Take on more household chores and cooking",
              "Help with grocery shopping and meal planning",
              "Assist with getting comfortable and resting",
              "Prepare the home for the baby's arrival",
              "Learn to recognize when she needs rest",
              "Be available for errands and appointments"
            ]
          }
        },
        {
          icon: Shield,
          title: "Safety & Emergency Preparedness",
          content: "Being prepared for emergencies and knowing how to keep your partner and baby safe gives everyone peace of mind.",
          details: {
            title: "Safety Preparations",
            items: [
              "Learn emergency contact numbers and procedures",
              "Know the route to the hospital and backup options",
              "Understand pregnancy warning signs",
              "Prepare a hospital bag with essentials",
              "Install car seat properly before due date",
              "Baby-proof your home in advance"
            ]
          }
        }
      ],
      timeline: [
        {
          period: "First Trimester (Weeks 1-12)",
          title: "Early Pregnancy Support",
          color: "#FF6B6B",
          items: [
            "Be understanding of morning sickness and fatigue",
            "Help with household tasks as energy levels drop",
            "Attend first prenatal appointment together",
            "Start learning about pregnancy nutrition",
            "Be patient with mood changes and emotional swings"
          ]
        },
        {
          period: "Second Trimester (Weeks 13-26)",
          title: "Growing Together",
          color: "#4ECDC4",
          items: [
            "Feel the baby's first movements together",
            "Attend ultrasound appointments",
            "Start planning the nursery and baby essentials",
            "Discuss birth plans and preferences",
            "Begin prenatal classes together"
          ]
        },
        {
          period: "Third Trimester (Weeks 27-40)",
          title: "Final Preparations",
          color: "#45B7D1",
          items: [
            "Help with nesting and final preparations",
            "Practice relaxation and breathing techniques",
            "Pack hospital bags and install car seat",
            "Learn about labor signs and when to go to hospital",
            "Prepare for postpartum support and recovery"
          ]
        },
        {
          period: "Postpartum (First 6 Weeks)",
          title: "New Family Dynamics",
          color: "#96CEB4",
          items: [
            "Provide physical and emotional support during recovery",
            "Help with newborn care and feeding",
            "Take on household responsibilities",
            "Support breastfeeding or formula feeding",
            "Watch for signs of postpartum depression"
          ]
        }
      ],
      warningTitle: "Warning Signs to Watch For",
      warningContent: "While pregnancy is generally safe, it's important to know when to seek medical attention. If your partner experiences any of these symptoms, contact her healthcare provider immediately:",
      emergencySigns: "Emergency Signs:",
      emergencyList: [
        "Severe abdominal pain or cramping",
        "Heavy vaginal bleeding",
        "Severe headaches, especially with vision changes",
        "Swelling in face, hands, or feet",
        "Difficulty breathing or chest pain",
        "Fever over 100.4°F (38°C)",
        "Decreased fetal movement after 28 weeks"
      ],
      supportTitle: "Building Your Support Network",
      supportContent: "You don't have to do this alone! Building a strong support network is crucial for both you and your partner. Here's how to create and maintain your support system:",
      supportList: [
        "Family and Friends: Identify who can help with practical tasks, emotional support, and childcare",
        "Healthcare Team: Build relationships with doctors, midwives, and other healthcare providers",
        "Other Fathers: Connect with other expectant or new fathers for shared experiences",
        "Community Resources: Explore local parenting groups, classes, and support services",
        "Professional Help: Don't hesitate to seek counseling if you're struggling with stress or anxiety"
      ],
      selfCareTitle: "Self-Care for Fathers",
      selfCareContent: "Taking care of yourself is not selfish—it's essential for being able to support your partner and family effectively. Remember that your well-being matters too.",
      selfCareStrategies: "Self-Care Strategies:",
      selfCareList: [
        "Maintain regular exercise and healthy eating habits",
        "Get adequate sleep and rest when possible",
        "Stay connected with friends and maintain hobbies",
        "Practice stress management techniques (meditation, deep breathing)",
        "Seek professional help if you're feeling overwhelmed or depressed",
        "Remember that it's okay to ask for help and take breaks"
      ]
    }
  };

  const currentContent = content[language] || content.en;
  const comprehensiveTips = currentContent.tips;
  const pregnancyTimeline = currentContent.timeline;

  return (
    <Container>
      <Header>
        <h1>{currentContent.title}</h1>
        <p>{currentContent.subtitle}</p>
      </Header>

      <Section>
        <SectionTitle>{currentContent.heading}</SectionTitle>
        <TipsGrid>
          {comprehensiveTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <TipCard key={index}>
                <div className="icon">
                  <Icon size={32} />
                </div>
                <h3>{tip.title}</h3>
                <p>{tip.content}</p>
                <div className="details">
                  <h4>
                    <Info size={16} />
                    {tip.details.title}
                  </h4>
                  <ul>
                    {tip.details.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              </TipCard>
            );
          })}
        </TipsGrid>
      </Section>

      <Section>
        <SectionTitle>Pregnancy Timeline: Your Role</SectionTitle>
        <TimelineGrid>
          {pregnancyTimeline.map((timeline, index) => (
            <TimelineCard key={index} color={timeline.color}>
              <div className="period">{timeline.period}</div>
              <h4>{timeline.title}</h4>
              <ul>
                {timeline.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </TimelineCard>
          ))}
        </TimelineGrid>
      </Section>

      <Section>
        <SectionTitle>{currentContent.Info}</SectionTitle>
        
        <InfoCard>
          <h3>
            <AlertTriangle size={24} />
            {currentContent.warningTitle}
          </h3>
          <div className="content">
            <p>{currentContent.warningContent}</p>
            <div className="highlight">
              <strong>{currentContent.emergencySigns}</strong>
              <ul>
                {currentContent.emergencyList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>

        <InfoCard>
          <h3>
            <Users size={24} />
            {currentContent.supportTitle}
          </h3>
          <div className="content">
            <p>{currentContent.supportContent}</p>
            <ul>
              {currentContent.supportList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </InfoCard>

        <InfoCard>
          <h3>
            <Clock size={24} />
            {currentContent.selfCareTitle}
          </h3>
          <div className="content">
            <p>{currentContent.selfCareContent}</p>
            <div className="highlight">
              <strong>{currentContent.selfCareStrategies}</strong>
              <ul>
                {currentContent.selfCareList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </InfoCard>
      </Section>
    </Container>
  );
};

export default DadsCorner;
