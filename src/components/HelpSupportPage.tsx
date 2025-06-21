import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, Book, MessageCircle, Mail, Phone, X, ChevronDown, ChevronRight, ExternalLink, Send, FileText, Video, Download } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

interface HelpSupportPageProps {
  onClose: () => void;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface Guide {
  title: string;
  description: string;
  duration: string;
  category: string;
  downloadUrl?: string;
  videoUrl?: string;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: string;
  description: string;
  attachments: File[];
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ onClose }) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [supportForm, setSupportForm] = useState<SupportTicket>({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
    attachments: []
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'guides', label: 'User Guides', icon: Book },
    { id: 'contact', label: 'Contact Support', icon: MessageCircle }
  ];

  const categories = ['all', 'getting-started', 'inventory', 'shipments', 'alerts', 'scenarios', 'technical'];

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I track shipments in real-time?',
      answer: 'Navigate to the Supply Chain Map on the main dashboard. All active shipments are displayed with real-time location updates. Click on any shipment marker to view detailed information including estimated arrival times, cargo details, and current status. You can also filter shipments by status, origin, or destination using the map controls.',
      category: 'shipments',
      helpful: 45
    },
    {
      id: 2,
      question: 'What do the different alert types mean?',
      answer: 'Critical alerts (red) require immediate attention and may impact operations significantly. These include supply shortages, delayed shipments, or system failures. Warning alerts (yellow) indicate potential issues that should be monitored, such as low inventory levels or minor delays. Info alerts (blue) provide general updates and notifications about system status, successful operations, or scheduled maintenance.',
      category: 'alerts',
      helpful: 38
    },
    {
      id: 3,
      question: 'How can I create and run what-if scenarios?',
      answer: 'Use the Scenario Workspace panel to create new scenarios. Click "New Scenario", define your parameters such as weather conditions, supplier changes, or demand fluctuations. Invite team members to collaborate on the scenario. The system will simulate the impact on costs, timing, and risk levels using our advanced analytics engine. You can compare multiple scenarios side-by-side to make informed decisions.',
      category: 'scenarios',
      helpful: 52
    },
    {
      id: 4,
      question: 'How do I manage inventory thresholds?',
      answer: 'In the Inventory Dashboard, click on any item to view details. You can adjust minimum and maximum thresholds, set up automated reorder points, and configure alerts for low stock situations. The system supports dynamic thresholds based on seasonal patterns and demand forecasting. You can also set up supplier-specific reorder rules and lead times.',
      category: 'inventory',
      helpful: 41
    },
    {
      id: 5,
      question: 'Can I export data and reports?',
      answer: 'Yes, most dashboards include export functionality. Look for the export icon in the top-right corner of each panel. You can export data in CSV, Excel, or PDF formats depending on the content type. Custom reports can be generated with specific date ranges, filters, and metrics. Scheduled reports can be set up to automatically email stakeholders.',
      category: 'technical',
      helpful: 29
    },
    {
      id: 6,
      question: 'How do I set up automated workflows?',
      answer: 'Navigate to Settings > Automation to create custom workflows. You can set triggers based on inventory levels, shipment status, or alert conditions. Define actions such as sending notifications, creating purchase orders, or updating stakeholders. The workflow builder supports conditional logic and multi-step processes.',
      category: 'technical',
      helpful: 33
    },
    {
      id: 7,
      question: 'What should I do if I receive a critical alert?',
      answer: 'Critical alerts require immediate attention. First, click on the alert to view detailed information. Assess the impact on your operations and determine if immediate action is needed. Use the collaboration features to notify relevant team members. Document any actions taken in the alert resolution notes. Consider creating a scenario to model potential solutions.',
      category: 'alerts',
      helpful: 47
    },
    {
      id: 8,
      question: 'How do I invite team members to collaborate?',
      answer: 'Go to Settings > Team Management to invite new users. Enter their email addresses and assign appropriate roles and permissions. Team members will receive an invitation email with setup instructions. You can also create temporary guest access for external partners or consultants with limited permissions.',
      category: 'getting-started',
      helpful: 36
    }
  ];

  const guides: Guide[] = [
    {
      title: 'Getting Started Guide',
      description: 'Complete walkthrough of the supply chain dashboard features and setup',
      duration: '15 min read',
      category: 'getting-started',
      downloadUrl: '/guides/getting-started.pdf',
      videoUrl: '/videos/getting-started.mp4'
    },
    {
      title: 'Real-time Monitoring Best Practices',
      description: 'How to effectively monitor your supply chain operations and set up alerts',
      duration: '10 min read',
      category: 'monitoring',
      downloadUrl: '/guides/monitoring.pdf'
    },
    {
      title: 'Alert Management and Response',
      description: 'Understanding alert types, priorities, and creating effective response procedures',
      duration: '8 min read',
      category: 'alerts',
      downloadUrl: '/guides/alerts.pdf',
      videoUrl: '/videos/alert-management.mp4'
    },
    {
      title: 'Advanced Scenario Planning',
      description: 'Master scenario planning and collaboration features for strategic decision making',
      duration: '12 min read',
      category: 'scenarios',
      downloadUrl: '/guides/scenarios.pdf'
    },
    {
      title: 'Data Integration and APIs',
      description: 'Connecting external systems, ERP integration, and using our REST APIs',
      duration: '20 min read',
      category: 'technical',
      downloadUrl: '/guides/integration.pdf'
    },
    {
      title: 'Inventory Optimization Strategies',
      description: 'Advanced techniques for inventory management and demand forecasting',
      duration: '18 min read',
      category: 'inventory',
      downloadUrl: '/guides/inventory.pdf'
    }
  ];

  const validateSupportForm = () => {
    const errors: Record<string, string> = {};
    
    if (!supportForm.subject.trim()) errors.subject = 'Subject is required';
    if (!supportForm.description.trim()) errors.description = 'Description is required';
    else if (supportForm.description.length < 20) errors.description = 'Please provide more details (minimum 20 characters)';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSupportSubmit = () => {
    if (validateSupportForm()) {
      // Simulate ticket submission
      const ticketId = `TK-${Date.now().toString().slice(-6)}`;
      
      addNotification({
        type: 'success',
        title: 'Support Ticket Created',
        message: `Your support ticket ${ticketId} has been submitted. We'll respond within 24 hours.`
      });

      setSupportForm({ 
        subject: '', 
        category: 'general', 
        priority: 'medium', 
        description: '',
        attachments: []
      });
      setFormErrors({});
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSupportForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setSupportForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const markHelpful = (faqId: number) => {
    addNotification({
      type: 'success',
      title: 'Thank you!',
      message: 'Your feedback helps us improve our documentation.'
    });
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredGuides = guides.filter(guide => 
    selectedCategory === 'all' || guide.category === selectedCategory
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'faq':
        return (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-sky-400 focus:outline-none"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-sky-400 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* FAQ Results */}
            <div className="text-sm text-gray-400 mb-4">
              Showing {filteredFaqs.length} of {faqs.length} questions
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-700/30 rounded-lg border border-gray-600/50"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="text-white font-medium">{faq.question}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400 bg-gray-600/50 px-2 py-1 rounded">
                          {faq.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {faq.helpful} found helpful
                        </span>
                      </div>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => markHelpful(faq.id)}
                          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                        >
                          Was this helpful?
                        </button>
                        <div className="text-xs text-gray-500">
                          Last updated: {new Date().toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'guides':
        return (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'All' : category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </motion.button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-2">{guide.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{guide.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-sky-400">{guide.duration}</span>
                        <span className="text-xs text-gray-400 bg-gray-600/50 px-2 py-1 rounded">
                          {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {guide.videoUrl && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 bg-sky-900/20 px-3 py-2 rounded-lg"
                        >
                          <Video className="w-4 h-4" />
                          <span className="text-sm">Watch</span>
                        </motion.button>
                      )}
                      {guide.downloadUrl && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-green-400 hover:text-green-300 flex items-center space-x-1 bg-green-900/20 px-3 py-2 rounded-lg"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Download</span>
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-400 hover:text-white flex items-center space-x-1 bg-gray-600/20 px-3 py-2 rounded-lg"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Read</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-sky-400" />
                  <h4 className="text-white font-medium">Email Support</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">Get help via email</p>
                <p className="text-sky-400 text-lg font-medium">support@supplychain.com</p>
                <p className="text-xs text-gray-500 mt-2">Response within 24 hours</p>
                <div className="mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Send Email
                  </motion.button>
                </div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-6 h-6 text-green-400" />
                  <h4 className="text-white font-medium">Phone Support</h4>
                </div>
                <p className="text-gray-400 text-sm mb-3">Speak with our team</p>
                <p className="text-green-400 text-lg font-medium">+1 (555) 123-HELP</p>
                <p className="text-xs text-gray-500 mt-2">Mon-Fri, 9AM-6PM EST</p>
                <div className="mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Call Now
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Support Form */}
            <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
              <h4 className="text-white font-medium mb-6 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-sky-400" />
                Submit a Support Request
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                    className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 border ${
                      formErrors.subject ? 'border-red-500' : 'border-gray-500'
                    } focus:border-sky-400 focus:outline-none`}
                    placeholder="Brief description of your issue"
                  />
                  {formErrors.subject && <p className="text-red-400 text-xs mt-1">{formErrors.subject}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select
                      value={supportForm.category}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 border border-gray-500 focus:border-sky-400 focus:outline-none"
                    >
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing</option>
                      <option value="feature">Feature Request</option>
                      <option value="integration">Integration Support</option>
                      <option value="training">Training Request</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-gray-600 text-white rounded-lg px-3 py-2 border border-gray-500 focus:border-sky-400 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={supportForm.description}
                    onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full bg-gray-600 text-white rounded-lg px-3 py-2 border ${
                      formErrors.description ? 'border-red-500' : 'border-gray-500'
                    } focus:border-sky-400 focus:outline-none h-32 resize-none`}
                    placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  />
                  {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">{supportForm.description.length}/500 characters</p>
                </div>
                
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <FileText className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-400">Click to upload files or drag and drop</span>
                      <span className="text-xs text-gray-500">PNG, JPG, PDF, DOC up to 10MB each</span>
                    </label>
                  </div>
                  
                  {/* Attachment List */}
                  {supportForm.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {supportForm.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-600/30 rounded-lg p-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeAttachment(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSupportSubmit}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </motion.button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-white">Help & Support</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-400 text-sky-400 bg-sky-400/10'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};