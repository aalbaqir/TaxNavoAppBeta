"use client";
import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles, HiDocumentText, HiCalculator, HiLightBulb } from "react-icons/hi";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
  type?: "suggestion" | "calculation" | "form_help" | "general";
}

interface ChatContextType {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSendChat: () => void;
  handleSuggestionClick: (suggestion: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// AI Tax Assistant Knowledge Base
const TAX_KNOWLEDGE = {
  deductions: {
    standard: {
      2024: { single: 14600, marriedJoint: 29200, marriedSeparate: 14600, headOfHousehold: 21900 },
      2023: { single: 13850, marriedJoint: 27700, marriedSeparate: 13850, headOfHousehold: 20800 },
    },
    itemized: ['mortgage interest', 'state and local taxes', 'charitable donations', 'medical expenses', 'business expenses']
  },
  taxBrackets: {
    2024: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182050, rate: 0.24 },
      { min: 182051, max: 231250, rate: 0.32 },
      { min: 231251, max: 578125, rate: 0.35 },
      { min: 578126, max: Infinity, rate: 0.37 }
    ]
  },
  forms: {
    '1040': 'Standard individual income tax return',
    '1040EZ': 'Simplified tax return (discontinued after 2017)',
    'Schedule A': 'Itemized deductions',
    'Schedule B': 'Interest and dividend income',
    'Schedule C': 'Business profit or loss',
    'Schedule D': 'Capital gains and losses',
    'W-2': 'Wage and tax statement from employer',
    '1099': 'Various income reporting forms'
  },
  quickTips: [
    "Consider itemizing deductions if they exceed your standard deduction",
    "Keep receipts for all tax-deductible expenses",
    "Contribute to retirement accounts to reduce taxable income",
    "File by April 15th to avoid penalties",
    "Use tax software or consult a professional for complex situations"
  ]
};

// AI Response Generator
class TaxAssistant {
  static async generateResponse(userMessage: string, context?: any): Promise<ChatMessage> {
    const message = userMessage.toLowerCase();
    let response = "";
    let type: ChatMessage['type'] = "general";

    // Tax calculation queries
    if (message.includes('calculate') || message.includes('tax owed') || message.includes('refund')) {
      type = "calculation";
      response = this.handleCalculationQuery(message);
    }
    // Deduction queries
    else if (message.includes('deduction') || message.includes('standard deduction') || message.includes('itemize')) {
      response = this.handleDeductionQuery(message);
    }
    // Form help
    else if (message.includes('form') || message.includes('1040') || message.includes('w-2') || message.includes('1099')) {
      type = "form_help";
      response = this.handleFormQuery(message);
    }
    // Filing status
    else if (message.includes('filing status') || message.includes('married') || message.includes('single') || message.includes('head of household')) {
      response = this.handleFilingStatusQuery(message);
    }
    // Deadline queries
    else if (message.includes('deadline') || message.includes('when') || message.includes('due date')) {
      response = this.handleDeadlineQuery(message);
    }
    // Business expenses
    else if (message.includes('business') || message.includes('self employed') || message.includes('1099') || message.includes('contractor')) {
      response = this.handleBusinessQuery(message);
    }
    // Investment/capital gains
    else if (message.includes('stock') || message.includes('capital gains') || message.includes('investment') || message.includes('crypto')) {
      response = this.handleInvestmentQuery(message);
    }
    // General tax help
    else {
      response = this.handleGeneralQuery(message);
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return {
      sender: "assistant",
      text: response,
      timestamp: new Date(),
      type
    };
  }

  private static handleCalculationQuery(message: string): string {
    return `I can help you estimate your taxes! To provide an accurate calculation, I'll need some information:

📊 **Tax Calculation Help:**
• Your filing status (single, married filing jointly, etc.)
• Your total income for the year
• Any deductions you plan to claim

For 2024, the standard deductions are:
• Single: $14,600
• Married Filing Jointly: $29,200
• Head of Household: $21,900

Would you like me to walk you through a basic tax calculation, or do you have specific numbers you'd like help with?`;
  }

  private static handleDeductionQuery(message: string): string {
    return `Great question about deductions! Here's what you need to know:

💰 **2024 Standard Deductions:**
• Single: $14,600
• Married Filing Jointly: $29,200
• Married Filing Separately: $14,600
• Head of Household: $21,900

🧾 **Common Itemized Deductions:**
• Mortgage interest
• State and local taxes (up to $10,000)
• Charitable contributions
• Medical expenses (over 7.5% of AGI)
• Business expenses

**Pro Tip:** Only itemize if your total itemized deductions exceed your standard deduction amount. Most taxpayers benefit from taking the standard deduction.

Need help deciding which is better for your situation?`;
  }

  private static handleFormQuery(message: string): string {
    if (message.includes('1040')) {
      return `📄 **Form 1040 - U.S. Individual Income Tax Return**

This is the main tax form for individuals. Here's what you need to know:

**Required Information:**
• Personal information (SSN, filing status)
• Income from all sources (W-2s, 1099s, etc.)
• Deductions (standard or itemized)
• Tax credits
• Tax payments made during the year

**Common Attachments:**
• Schedule 1: Additional income and adjustments
• Schedule A: Itemized deductions
• Schedule B: Interest and dividend income
• Schedule C: Business income/loss

Need help with a specific section of Form 1040?`;
    }
    
    return `📋 **Tax Forms Help**

Here are the most common tax forms:

• **Form 1040:** Main individual tax return
• **W-2:** Wage statement from employers
• **1099-MISC:** Miscellaneous income
• **1099-NEC:** Non-employee compensation
• **Schedule A:** Itemized deductions
• **Schedule C:** Business profit/loss

Which specific form do you need help with? I can provide detailed guidance for any tax form.`;
  }

  private static handleFilingStatusQuery(message: string): string {
    return `👥 **Filing Status Guide**

Your filing status affects your tax rates and standard deduction:

**Single:** Unmarried or legally separated
• Standard Deduction: $14,600 (2024)

**Married Filing Jointly:** Most beneficial for married couples
• Standard Deduction: $29,200 (2024)
• Lower tax rates, better credits

**Married Filing Separately:** Sometimes beneficial if one spouse has high deductions
• Standard Deduction: $14,600 (2024)

**Head of Household:** Unmarried with qualifying dependents
• Standard Deduction: $21,900 (2024)
• Better rates than single filing

**Qualifying Widow(er):** Can use joint rates for 2 years after spouse's death

Need help determining your best filing status?`;
  }

  private static handleDeadlineQuery(message: string): string {
    return `📅 **2024 Tax Filing Deadlines**

**Key Dates:**
• **April 15, 2025:** Filing deadline for 2024 taxes
• **October 15, 2025:** Extended filing deadline (if you file for extension)
• **January 31, 2025:** Deadline for employers to send W-2s
• **Various dates:** 1099 forms due to recipients

**Important Notes:**
• File extension by April 15 if you need more time
• Extensions give you time to file, NOT to pay
• Pay estimated taxes quarterly if self-employed
• Penalties apply for late filing and late payment

**Pro Tip:** File early to get your refund faster and reduce identity theft risk!

Need help with extension procedures or payment options?`;
  }

  private static handleBusinessQuery(message: string): string {
    return `💼 **Self-Employment & Business Tax Help**

**Schedule C (Business Profit/Loss):**
• Report business income and expenses
• Deduct legitimate business expenses
• Pay self-employment tax (15.3% on net earnings)

**Common Business Deductions:**
• Office supplies and equipment
• Business meals (50% deductible)
• Travel expenses
• Home office (if qualifying)
• Professional development
• Marketing and advertising

**Quarterly Estimated Taxes:**
• Due: Jan 15, Apr 15, Jun 15, Sep 15
• Pay if you expect to owe $1,000+ in taxes

**Record Keeping:**
• Keep all receipts and documentation
• Separate business and personal expenses
• Track mileage for business travel

Need help with specific business deductions or Schedule C questions?`;
  }

  private static handleInvestmentQuery(message: string): string {
    return `📈 **Investment & Capital Gains Tax Help**

**Capital Gains Tax Rates (2024):**
• **Short-term** (held ≤1 year): Taxed as ordinary income
• **Long-term** (held >1 year): 0%, 15%, or 20% depending on income

**Tax-Advantaged Accounts:**
• 401(k): Pre-tax contributions, taxed on withdrawal
• Roth IRA: After-tax contributions, tax-free growth
• Traditional IRA: May be tax-deductible

**Cryptocurrency:**
• Treated as property for tax purposes
• Report all sales, trades, and exchanges
• Keep detailed records of transactions

**Tax-Loss Harvesting:**
• Offset gains with losses
• Up to $3,000 in excess losses can offset ordinary income

**Dividend Income:**
• Qualified dividends: Taxed at capital gains rates
• Non-qualified dividends: Taxed as ordinary income

Need help calculating capital gains or understanding specific investment tax rules?`;
  }

  private static handleGeneralQuery(message: string): string {
    const tips = TAX_KNOWLEDGE.quickTips;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return `👋 I'm your AI Tax Assistant! I'm here to help with all your tax questions.

**I can help you with:**
• Tax calculations and estimates
• Deduction strategies
• Form instructions and requirements
• Filing status guidance
• Business and self-employment taxes
• Investment and capital gains
• Tax deadlines and procedures

**Quick Tip:** ${randomTip}

What specific tax topic would you like help with today? Feel free to ask about anything from basic tax concepts to complex tax situations!`;
  }
}

// Suggested questions for quick help
const SUGGESTED_QUESTIONS = [
  "What's my standard deduction for 2024?",
  "Should I itemize or take the standard deduction?",
  "How do I calculate my estimated taxes?",
  "What business expenses can I deduct?",
  "When is the tax filing deadline?",
  "How are capital gains taxed?",
];

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "👋 Hi! I'm your AI Tax Assistant. I can help you with tax calculations, deductions, forms, and filing guidance. What would you like to know?",
      timestamp: new Date(),
      type: "general"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Enhanced AI chat response handler
  async function handleSendChat() {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      sender: "user",
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages((msgs) => [...msgs, userMessage]);
    setChatInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const aiResponse = await TaxAssistant.generateResponse(chatInput);
      setChatMessages((msgs) => [...msgs, aiResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        sender: "assistant",
        text: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team for assistance.",
        timestamp: new Date()
      };
      setChatMessages((msgs) => [...msgs, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSuggestionClick(suggestion: string) {
    setChatInput(suggestion);
    setShowSuggestions(false);
  }

  // Message type icon helper
  function getMessageIcon(type?: ChatMessage['type']) {
    switch (type) {
      case 'calculation': return <HiCalculator className="text-blue-500" />;
      case 'form_help': return <HiDocumentText className="text-green-500" />;
      case 'suggestion': return <HiLightBulb className="text-yellow-500" />;
      default: return <HiSparkles className="text-purple-500" />;
    }
  }

  const contextValue: ChatContextType = {
    chatOpen,
    setChatOpen,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isTyping,
    setIsTyping,
    showSuggestions,
    setShowSuggestions,
    handleSendChat,
    handleSuggestionClick
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
      
      {/* Global Chat UI */}
      <>
        {/* Enhanced AI Chat Button */}
        <motion.button
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#8000FF] to-[#6a00cc] text-white rounded-full shadow-2xl px-6 py-4 font-bold hover:from-[#FFC107] hover:to-[#ffb300] hover:text-[#8000FF] transition-all duration-300 flex items-center gap-2"
          onClick={() => setChatOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open AI Tax Assistant"
        >
          <HiSparkles className="text-xl" />
          {chatOpen ? "Close Chat" : "AI Tax Help"}
        </motion.button>
        
        {/* Enhanced AI Chat Window */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="fixed bottom-28 right-8 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-[#8000FF] flex flex-col max-h-[600px]"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-[#8000FF] bg-gradient-to-r from-[#8000FF] to-[#6a00cc] text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiSparkles className="text-xl" />
                    <span className="font-bold">AI Tax Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs opacity-75">Online</span>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] ${msg.sender === "user" ? "ml-4" : "mr-4"}`}>
                      {msg.sender === "assistant" && (
                        <div className="flex items-center gap-1 mb-1">
                          {getMessageIcon(msg.type)}
                          <span className="text-xs text-gray-500">AI Assistant</span>
                        </div>
                      )}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-[#8000FF] text-white rounded-br-md" 
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-xs mt-2 opacity-70 ${msg.sender === "user" ? "text-purple-200" : "text-gray-400"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </motion.div>
                )}
                
                <div ref={chatEndRef} />
              </div>
              
              {/* Suggested Questions */}
              {showSuggestions && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_QUESTIONS.slice(0, 3).map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white text-[#8000FF] px-2 py-1 rounded-full border border-[#8000FF]/20 hover:bg-[#F3E8FF] transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:border-transparent text-sm"
                    placeholder="Ask me anything about taxes..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                    disabled={isTyping}
                  />
                  <motion.button
                    className="px-4 py-2 rounded-full bg-[#8000FF] text-white font-semibold hover:bg-[#FFC107] hover:text-[#8000FF] transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiSparkles className="text-sm" />
                    Send
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • For complex situations, consult a tax professional
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}