import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, User, AlertCircle, CheckCircle, FileText, Mail, Upload, Bell } from 'lucide-react';

const ProcessTree = () => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ root: true, phase1: true });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  interface TreeNodeData {
    id: string;
    title: string;
    type: string;
    icon?: string;
    timeline?: string;
    owner?: string;
    description?: string;
    details?: string[];
    checklist?: string[];
    children?: TreeNodeData[];
  }

  const TreeNode = ({ node, level = 0 }: { node: TreeNodeData; level?: number }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id];

    const getIcon = () => {
      switch(node.icon) {
        case 'clock': return <Clock className="w-5 h-5" />;
        case 'user': return <User className="w-5 h-5" />;
        case 'alert': return <AlertCircle className="w-5 h-5" />;
        case 'check': return <CheckCircle className="w-5 h-5" />;
        case 'file': return <FileText className="w-5 h-5" />;
        case 'mail': return <Mail className="w-5 h-5" />;
        case 'upload': return <Upload className="w-5 h-5" />;
        case 'bell': return <Bell className="w-5 h-5" />;
        default: return null;
      }
    };

    const getColor = () => {
      switch(node.type) {
        case 'phase': return 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg';
        case 'step': return 'bg-white border-l-4 border-emerald-500 shadow';
        case 'substep': return 'bg-gray-50 border-l-4 border-gray-400';
        case 'decision': return 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-md';
        case 'critical': return 'bg-gradient-to-r from-red-500 to-pink-600 shadow-md';
        case 'info': return 'bg-blue-50 border-l-4 border-blue-400';
        default: return 'bg-white border border-gray-300';
      }
    };

    const getTextColor = () => {
      switch(node.type) {
        case 'phase': return 'text-white';
        case 'decision': return 'text-white';
        case 'critical': return 'text-white';
        default: return 'text-gray-800';
      }
    };

    return (
      <div className="mb-2" style={{ marginLeft: `${level * 24}px` }}>
        <div
          className={`rounded-lg transition-all duration-200 ${hasChildren ? 'cursor-pointer hover:shadow-xl' : ''} ${getColor()} ${getTextColor()}`}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              {hasChildren && (
                <div className="flex-shrink-0 mt-1">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              )}

              {node.icon && (
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-bold text-base mb-1">{node.title}</div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {node.owner && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      node.type === 'phase' ? 'bg-white bg-opacity-20' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <User className="w-3 h-3" />
                      {node.owner}
                    </span>
                  )}

                  {node.timeline && (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      node.type === 'phase' ? 'bg-white bg-opacity-20' : 'bg-green-100 text-green-700'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {node.timeline}
                    </span>
                  )}
                </div>

                {node.description && (
                  <div className="text-sm mb-2 leading-relaxed opacity-90">{node.description}</div>
                )}

                {node.details && (
                  <div className={`mt-2 rounded p-3 text-sm space-y-1 ${
                    node.type === 'phase' ? 'bg-white bg-opacity-20 text-white' :
                    node.type === 'decision' ? 'bg-white bg-opacity-20 text-white' :
                    node.type === 'critical' ? 'bg-white bg-opacity-20 text-white' :
                    node.type === 'info' ? 'bg-blue-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {node.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`font-bold mt-0.5 ${
                          node.type === 'phase' || node.type === 'decision' || node.type === 'critical'
                            ? 'text-white' : 'text-emerald-600'
                        }`}>→</span>
                        <span className="flex-1">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {node.checklist && (
                  <div className="mt-2 space-y-1">
                    {node.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          node.type === 'phase' || node.type === 'decision' || node.type === 'critical'
                            ? 'text-white' : 'text-emerald-500'
                        }`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children!.map(child => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const processData: TreeNodeData = {
    id: 'root',
    title: 'COMPLETE SOP: Experian Death Notification & Fraud Dispute Process',
    type: 'phase',
    icon: 'file',
    description: 'End-to-end workflow for handling deceased identity theft cases',
    children: [
      {
        id: 'phase1',
        title: 'STAGE 1: Intake & Document Collection',
        type: 'phase',
        icon: 'mail',
        timeline: 'Day 1 (within 24 hours)',
        owner: 'Elayne Support Specialist',
        children: [
          {
            id: 'step1.1',
            title: 'Step 1.1: Initial Client Response',
            type: 'step',
            icon: 'mail',
            timeline: 'Within 2 hours of receiving request',
            owner: 'Support Specialist',
            description: 'Send empathetic email to client (see templates section)',
            checklist: [
              'Acknowledge their distress with empathy',
              'Reassure them Elayne will handle the entire process',
              'Explain what documents are needed',
              'Set expectations for timeline (6-8 weeks total)'
            ]
          },
          {
            id: 'step1.2',
            title: 'Step 1.2: Create Case in CRM System',
            type: 'step',
            icon: 'file',
            timeline: '15 minutes',
            owner: 'Support Specialist',
            description: 'Log case with all relevant information',
            details: [
              'Assign unique Case ID (format: EXP-YYYY-####)',
              'Record client name, deceased name, and relationship',
              'Date of death from death certificate',
              'Creditor name and fraudulent amount',
              'Set case status: "Awaiting Documents"',
              'Set due date reminder: 3 days from now'
            ]
          },
          {
            id: 'step1.3',
            title: 'Step 1.3: Send Document Checklist to Client',
            type: 'step',
            icon: 'mail',
            timeline: '10 minutes',
            owner: 'Support Specialist',
            description: 'Provide clear list of required documents',
            details: [
              'REQUIRED: Certified copy of death certificate (must show raised seal)',
              'REQUIRED: Marriage certificate or proof of relationship',
              'REQUIRED: Government-issued photo ID of requestor',
              'REQUIRED: Collection letter from creditor',
              'OPTIONAL: Any other correspondence from creditor',
              'Format requirements: Clear scans/photos in PDF, JPG, or PNG',
              'File size: Under 10MB per file',
              'Instructions: Send via secure upload portal or encrypted email'
            ]
          }
        ]
      },
      {
        id: 'phase2',
        title: 'STAGE 2: Document Review & Preparation',
        type: 'phase',
        icon: 'check',
        timeline: 'Day 2-3',
        owner: 'Elayne Support Specialist',
        children: [
          {
            id: 'step2.1',
            title: 'Step 2.1: Quality Check All Documents',
            type: 'step',
            icon: 'check',
            timeline: '30 minutes',
            owner: 'Support Specialist',
            description: 'Verify completeness and quality of submitted documents',
            checklist: [
              'Death certificate shows visible raised seal',
              'Death certificate includes: full name, DOB, date of death, SSN',
              'Marriage certificate shows both spouses names clearly',
              'Photo ID is current and all text is legible',
              'Collection letter shows creditor name, amount, account reference',
              'All document images are clear, not blurry',
              'All documents are properly oriented (not upside down)'
            ]
          },
          {
            id: 'decision2.1',
            title: 'DECISION POINT: Are all documents complete and acceptable?',
            type: 'decision',
            icon: 'alert',
            children: [
              {
                id: 'path2.1a',
                title: 'YES → Proceed to Step 2.2',
                type: 'substep',
                icon: 'check'
              },
              {
                id: 'path2.1b',
                title: 'NO → Request Missing/Clearer Documents',
                type: 'critical',
                icon: 'alert',
                details: [
                  'Email client same day specifying exactly what is missing or unclear',
                  'Example: "The death certificate image is blurry - please rescan ensuring the raised seal is visible"',
                  'Offer to schedule a call if client is struggling with document preparation',
                  'Update case status to: "Awaiting Additional Documentation"',
                  'Set follow-up reminder for 3 business days',
                  'RETURN to Step 2.1 when documents received'
                ]
              }
            ]
          },
          {
            id: 'step2.2',
            title: 'Step 2.2: Organize and Rename Files',
            type: 'step',
            icon: 'file',
            timeline: '15 minutes',
            owner: 'Support Specialist',
            description: 'Prepare files for Experian submission',
            details: [
              'Rename: "DeathCertificate_[DeceasedName].pdf"',
              'Rename: "MarriageCertificate_[Names].pdf"',
              'Rename: "PhotoID_[ClientName].pdf"',
              'Rename: "CollectionLetter_[Creditor]_[Amount].pdf"',
              'Store all files in case folder: Cases/EXP-YYYY-####/Documents',
              'Create backup copy in secure cloud storage'
            ]
          },
          {
            id: 'step2.3',
            title: 'Step 2.3: Prepare Written Fraud Statement',
            type: 'step',
            icon: 'file',
            timeline: '30 minutes',
            owner: 'Support Specialist',
            description: 'Draft formal fraud affidavit for Experian',
            details: [
              'Use Elayne template: "Fraud Affidavit Template - Deceased Identity Theft"',
              'Include: Full legal name of deceased, DOB, SSN, date of death',
              'Include: Creditor name, fraudulent loan amount, date loan opened',
              'Statement: "This account was opened fraudulently after the date of death"',
              'Request: Immediate placement of deceased indicator and removal of fraudulent debt',
              'Sign on behalf of client with authorization'
            ]
          },
          {
            id: 'step2.4',
            title: 'Step 2.4: Gather Complete Information',
            type: 'step',
            icon: 'user',
            timeline: '15 minutes',
            owner: 'Support Specialist',
            description: 'Compile all information needed for Experian form',
            checklist: [
              'Deceased: Full legal name, DOB, SSN, date of death, last known address',
              'Requestor: Full name, relationship, current address, phone, email',
              'Fraud details: Creditor name, account type, amount, date opened',
              'All information verified against source documents'
            ]
          }
        ]
      },
      {
        id: 'phase3',
        title: 'STAGE 3: Experian Online Submission',
        type: 'phase',
        icon: 'upload',
        timeline: 'Day 4',
        owner: 'Elayne Support Specialist',
        children: [
          {
            id: 'step3.1',
            title: 'Step 3.1: Access Experian Portal',
            type: 'step',
            icon: 'user',
            timeline: '10 minutes',
            owner: 'Support Specialist',
            description: 'Navigate to deceased notification system',
            details: [
              'Go to Experian deceased notification online portal',
              'Log in with Elayne business account credentials',
              'Select: "Report Death and Fraudulent Activity"',
              'Begin new submission'
            ]
          },
          {
            id: 'step3.2',
            title: 'Step 3.2: Complete All Required Sections',
            type: 'step',
            icon: 'file',
            timeline: '30 minutes',
            owner: 'Support Specialist',
            description: 'Fill in deceased, requestor, and fraud information',
            checklist: [
              'Deceased person section: Name, DOB, SSN, date of death, last address',
              'Requestor section: Name, relationship, contact information',
              'Fraud details section: Creditor, account type, amount, dates',
              'Description: Clear explanation that account opened after death',
              'Double-check all entries for accuracy'
            ]
          },
          {
            id: 'step3.3',
            title: 'Step 3.3: Upload All Documents',
            type: 'step',
            icon: 'upload',
            timeline: '15 minutes',
            owner: 'Support Specialist',
            description: 'Attach all prepared documents to submission',
            checklist: [
              'Upload: Death certificate',
              'Upload: Marriage certificate or proof of relationship',
              'Upload: Photo ID',
              'Upload: Collection letter',
              'Upload: Fraud affidavit',
              'Upload: Any additional creditor correspondence',
              'Verify each file uploaded successfully (green checkmark)',
              'Confirm file names are visible and correct'
            ]
          },
          {
            id: 'step3.4',
            title: 'Step 3.4: Review and Submit',
            type: 'step',
            icon: 'check',
            timeline: '10 minutes',
            owner: 'Support Specialist',
            description: 'Final verification before submission',
            details: [
              'Review all entered information for accuracy',
              'Verify SSN is correct (critical field)',
              'Verify date of death matches certificate exactly',
              'Verify all documents are attached',
              'Check digital signature box',
              'Click "Submit"',
              'Wait for confirmation screen'
            ]
          },
          {
            id: 'step3.5',
            title: 'Step 3.5: Save Confirmation Number',
            type: 'critical',
            icon: 'bell',
            timeline: '5 minutes',
            owner: 'Support Specialist',
            description: 'CRITICAL: Document submission confirmation',
            details: [
              'WRITE DOWN confirmation number immediately',
              'Take screenshot of entire confirmation page',
              'Record submission date and time',
              'Save confirmation number in case file',
              'Add to CRM with expected resolution date (6 weeks)',
              'Mark deadline in calendar'
            ]
          },
          {
            id: 'step3.6',
            title: 'Step 3.6: Update Client',
            type: 'step',
            icon: 'mail',
            timeline: '20 minutes',
            owner: 'Support Specialist',
            description: 'Send detailed update email to client',
            details: [
              'Subject: "Update: Your Experian Fraud Dispute Has Been Submitted"',
              'Confirm submission completed today',
              'Provide Experian confirmation number for their records',
              'Explain: Experian will process within 4-6 weeks',
              'Set expectation: May still receive collection calls during investigation',
              'Provide script for handling collector calls',
              'Update case status: "Submitted to Experian - Pending Processing"'
            ]
          }
        ]
      },
      {
        id: 'phase4',
        title: 'STAGE 4: Direct Creditor Notification',
        type: 'phase',
        icon: 'mail',
        timeline: 'Day 5',
        owner: 'Elayne Support Specialist',
        children: [
          {
            id: 'step4.1',
            title: 'Step 4.1: Draft Creditor Dispute Letter',
            type: 'step',
            icon: 'file',
            timeline: '30 minutes',
            owner: 'Support Specialist',
            description: 'Prepare formal letter to creditor',
            details: [
              'Use Elayne template: "Creditor Fraud Dispute - Deceased Identity Theft"',
              'State facts: Account opened after date of death',
              'Demand: Immediate cessation of collection activity',
              'Demand: Close account and mark as fraudulent',
              'Demand: Written confirmation within 30 days',
              'Reference Experian confirmation number',
              'Enclose copy of death certificate'
            ]
          },
          {
            id: 'step4.2',
            title: 'Step 4.2: Send via Certified Mail',
            type: 'step',
            icon: 'mail',
            timeline: '20 minutes',
            owner: 'Support Specialist',
            description: 'Mail with tracking and delivery confirmation',
            details: [
              'Print dispute letter on Elayne letterhead',
              'Include copy of death certificate',
              'Send via USPS Certified Mail with Return Receipt',
              'SAVE tracking number from receipt',
              'Record in case file with mailing date',
              'Estimated delivery: 2-5 business days'
            ]
          },
          {
            id: 'step4.3',
            title: 'Step 4.3: Update Client About Creditor Contact',
            type: 'step',
            icon: 'mail',
            timeline: '15 minutes',
            owner: 'Support Specialist',
            description: 'Inform client about creditor notification',
            details: [
              'Email subject: "Update: We\'ve Contacted [Creditor] Directly"',
              'Explain: Formal dispute letter sent via certified mail',
              'Set expectation: Collection calls may continue for 2-4 weeks',
              'Provide script for handling collector calls',
              'Instruct: Document all calls received (date, time, caller name)',
              'Instruct: Do not provide any additional information to collectors'
            ]
          }
        ]
      },
      {
        id: 'phase5',
        title: 'STAGE 5: Monitoring & Follow-Up',
        type: 'phase',
        icon: 'bell',
        timeline: 'Week 2-6',
        owner: 'Elayne Support Specialist',
        children: [
          {
            id: 'step5.1',
            title: 'Step 5.1: Weekly Status Checks',
            type: 'step',
            icon: 'check',
            timeline: 'Every Monday, 15 min',
            owner: 'Support Specialist',
            description: 'Regular monitoring routine',
            checklist: [
              'Check: Has certified mail been delivered to creditor?',
              'Check: Any mail received from Experian?',
              'Check: Any mail received from creditor?',
              'Check: Client emails - any new collection activity?',
              'Update case notes with findings',
              'Calculate weeks elapsed since Experian submission'
            ]
          },
          {
            id: 'step5.2',
            title: 'Step 5.2: Bi-Weekly Client Updates',
            type: 'step',
            icon: 'mail',
            timeline: 'Every 2 weeks',
            owner: 'Support Specialist',
            description: 'Proactive communication even without updates',
            details: [
              'Send brief email: "Status Update on Your Experian Case"',
              'Confirm: We are actively monitoring your case',
              'Report: Current status and timeline',
              'Ask: Any new communication from creditor?',
              'Remind: Expected completion timeframe',
              'Maintain warm, supportive tone'
            ]
          },
          {
            id: 'decision5.1',
            title: 'DECISION POINT: Additional Information Requested?',
            type: 'decision',
            icon: 'alert',
            description: 'May occur Week 2-4',
            children: [
              {
                id: 'path5.1a',
                title: 'NO → Continue normal monitoring',
                type: 'substep',
                icon: 'check'
              },
              {
                id: 'path5.1b',
                title: 'YES → URGENT: Respond Immediately',
                type: 'critical',
                icon: 'alert',
                timeline: 'Within 24 hours',
                details: [
                  'Contact client SAME DAY by phone and email',
                  'Explain exactly what Experian needs',
                  'Set deadline: Within 2 business days to avoid delays',
                  'Submit additional documents via Experian portal immediately',
                  'SAVE new confirmation number',
                  'RESET timeline: Add 2-3 weeks to expected completion',
                  'Update client with new timeline'
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'phase6',
        title: 'STAGE 6: Resolution & Case Closure',
        type: 'phase',
        icon: 'check',
        timeline: 'Week 6-8',
        owner: 'Elayne Support Specialist',
        children: [
          {
            id: 'step6.1',
            title: 'Step 6.1: Receive Confirmations',
            type: 'step',
            icon: 'mail',
            timeline: 'Week 4-6',
            owner: 'Support Specialist',
            description: 'Process official responses',
            details: [
              'Experian: Letter confirming deceased indicator placed',
              'Creditor: Letter confirming debt cancelled',
              'SCAN all letters immediately',
              'Add to case file',
              'Verify completeness of responses'
            ]
          },
          {
            id: 'step6.2',
            title: 'Step 6.2: Prepare Final Documentation Package',
            type: 'step',
            icon: 'file',
            timeline: '30 minutes',
            owner: 'Support Specialist',
            description: 'Compile complete case resolution package',
            checklist: [
              'Include: Experian confirmation letter',
              'Include: Creditor debt cancellation letter',
              'Include: Copy of original Experian submission confirmation',
              'Include: Timeline summary of all actions taken',
              'Include: "Keep These Documents" cover letter',
              'Organize in PDF format'
            ]
          },
          {
            id: 'step6.3',
            title: 'Step 6.3: Send Final Completion Email',
            type: 'step',
            icon: 'mail',
            timeline: '30 minutes',
            owner: 'Support Specialist',
            description: 'Provide closure and guidance',
            details: [
              'Subject: "RESOLVED: Your Experian Fraud Dispute is Complete"',
              'Confirm: Deceased indicator placed, debt cancelled',
              'Attach: Final documentation package PDF',
              'Explain: Keep all documentation permanently',
              'Instruct: Contact us if any future collection occurs',
              'Recommend: Credit monitoring for next 12 months',
              'Thank them for their patience and trust'
            ]
          },
          {
            id: 'step6.4',
            title: 'Step 6.4: Mail Physical Documentation',
            type: 'step',
            icon: 'mail',
            timeline: '15 minutes',
            owner: 'Support Specialist',
            description: 'Send hard copies via secure mail',
            details: [
              'Print all documents in final package',
              'Include personalized cover letter',
              'Send via USPS Priority Mail with tracking',
              'Record tracking number in case file'
            ]
          },
          {
            id: 'step6.5',
            title: 'Step 6.5: Close Case in CRM',
            type: 'step',
            icon: 'check',
            timeline: '20 minutes',
            owner: 'Support Specialist',
            description: 'Complete case closure procedures',
            checklist: [
              'Update case status: "RESOLVED - Closed"',
              'Record closure date and total days to resolution',
              'Complete case summary',
              'Archive all documents in secure storage',
              'Set 30-day follow-up reminder',
              'Add case to monthly resolution report'
            ]
          },
          {
            id: 'step6.6',
            title: 'Step 6.6: 30-Day Post-Closure Follow-Up',
            type: 'step',
            icon: 'bell',
            timeline: '30 days after closure',
            owner: 'Support Specialist',
            description: 'Final client check-in',
            details: [
              'Send brief email: "Checking In: 30 Days After Resolution"',
              'Ask: Any further collection attempts?',
              'Ask: Any questions about documentation?',
              'If no issues: Thank them again, wish them well',
              'If issues reported: REOPEN case immediately',
              'Document final follow-up in case notes'
            ]
          }
        ]
      },
      {
        id: 'templates',
        title: 'EMAIL & LETTER TEMPLATES',
        type: 'info',
        icon: 'mail',
        children: [
          {
            id: 'template1',
            title: 'Template 1: Initial Empathetic Response Email',
            type: 'info',
            icon: 'mail',
            details: [
              'SUBJECT: Re: Identity Theft Assistance - We\'re Here to Help',
              'Thank you for reaching out. I am so sorry for your loss and for this additional stress during an already difficult time.',
              'I want you to know that you\'re in good hands now. Elayne will handle the entire Experian notification and fraud dispute process on your behalf.',
              'Here\'s what will happen next: 1) We\'ll collect a few documents from you 2) We\'ll submit to Experian within 24-48 hours 3) We\'ll contact the creditor directly 4) We\'ll keep you updated every step of the way',
              'The entire process typically takes 6-8 weeks.',
              'DOCUMENTS WE NEED: Certified death certificate, Marriage certificate, Your photo ID, Collection letter',
              'Please don\'t hesitate to reach out if you have any questions. We\'re here to support you.'
            ]
          },
          {
            id: 'template2',
            title: 'Template 2: Creditor Fraud Dispute Letter',
            type: 'info',
            icon: 'file',
            details: [
              'Date, Creditor Name and Address',
              'RE: Fraudulent Account - Deceased Individual',
              'I am writing on behalf of [Surviving Spouse] regarding a fraudulent loan opened in the name of their deceased [relationship], [Deceased Name].',
              '[Deceased Name] passed away on [Date]. This account for $[Amount] was opened on [Date Account Opened], which was after [his/her] death.',
              'Enclosed is a certified copy of the death certificate proving [Deceased Name] was deceased.',
              'We hereby demand that you: 1) IMMEDIATELY CEASE all collection activity 2) CLOSE this account and mark it as fraudulent 3) REPORT to all credit bureaus that this debt is fraudulent 4) PROVIDE written confirmation within 30 days',
              'Any continued collection attempts may constitute a violation of federal law.',
              'Sincerely, [Your Name], Senior Support Specialist, Elayne, Acting on behalf of [Client Name]'
            ]
          },
          {
            id: 'template3',
            title: 'Template 3: Fraud Affidavit for Experian',
            type: 'info',
            icon: 'file',
            details: [
              'FRAUD AFFIDAVIT - Identity Theft of Deceased Individual',
              'I, [Your Name], authorized representative of [Client Name], hereby affirm the following:',
              'DECEASED INFORMATION: Full Legal Name, Date of Birth, Social Security Number, Date of Death',
              'FRAUDULENT ACCOUNT: Creditor, Type of Account, Amount, Date Account Opened',
              'STATEMENT OF FRAUD: This account was opened fraudulently after the date of death. The deceased individual could not have applied for, authorized, or had any knowledge of this account.',
              'REQUESTED ACTION: 1) Place a deceased indicator on the credit file 2) Flag this account as fraudulent 3) Notify the creditor 4) Remove this fraudulent debt from credit reporting',
              'I certify under penalty of perjury that the information provided herein is true and correct.'
            ]
          },
          {
            id: 'template4',
            title: 'Template 4: Bi-Weekly Status Update Email',
            type: 'info',
            icon: 'mail',
            details: [
              'SUBJECT: Status Update: Your Experian Fraud Dispute',
              'Hi [Client Name], I wanted to give you a quick update on your case.',
              'WHERE WE ARE: Your dispute was submitted to Experian on [Date]. We are currently in week [X] of the expected 4-6 week processing time.',
              'WHAT\'S HAPPENING: Experian is reviewing your case and conducting a thorough investigation.',
              'WHAT YOU SHOULD KNOW: You may still receive collection calls during this period - this is normal. If collectors call, you can say: "This debt is fraudulent and is being handled by Elayne."',
              'We will notify you the moment we receive confirmation from Experian. You don\'t need to do anything right now - we\'re handling everything.',
              'Have you received any new communication from [Creditor Name] or collectors? If so, please let me know.'
            ]
          },
          {
            id: 'template5',
            title: 'Template 5: Final Resolution Email',
            type: 'info',
            icon: 'mail',
            details: [
              'SUBJECT: RESOLVED: Your Experian Fraud Dispute is Complete',
              'Dear [Client Name], I have wonderful news - your case is officially resolved!',
              'WHAT HAS BEEN ACCOMPLISHED: Experian has placed a deceased indicator on the credit file, the fraudulent debt has been flagged as fraud, [Creditor Name] has confirmed the debt is cancelled, you are NOT responsible for this debt, all collection activity should now cease',
              'I\'ve attached a complete documentation package.',
              'IMPORTANT - PLEASE KEEP THESE DOCUMENTS: Store these in a safe place permanently. If you ever receive any future communication about this debt, these documents prove it was fraudulent and cancelled.',
              'WHAT TO DO IF: If you receive any collection calls or letters after today, contact us immediately. Consider credit monitoring for the next 12 months.',
              'It has been an honor to help you through this difficult situation. If you need anything else, ever, please don\'t hesitate to reach out.'
            ]
          }
        ]
      },
      {
        id: 'checklists',
        title: 'MASTER CHECKLISTS',
        type: 'info',
        icon: 'check',
        children: [
          {
            id: 'checklist1',
            title: 'Document Collection Verification',
            type: 'info',
            icon: 'check',
            checklist: [
              'Death certificate received with visible raised seal',
              'Death certificate includes full name, DOB, date of death, SSN',
              'Marriage certificate shows both spouses names clearly',
              'Photo ID is current and text is legible',
              'Collection letter shows creditor name, amount, account reference',
              'All documents in acceptable format (PDF, JPG, PNG)',
              'All documents are clear and readable (no blur)',
              'All documents properly oriented (not upside down)',
              'File sizes acceptable (under 10MB each)',
              'Documents saved with clear naming convention',
              'Backup copies stored in secure location'
            ]
          },
          {
            id: 'checklist2',
            title: 'Pre-Submission Final Review',
            type: 'info',
            icon: 'check',
            checklist: [
              'All required documents collected and verified',
              'Fraud affidavit completed and signed',
              'All names spelled consistently across all documents',
              'SSN verified correct across multiple sources',
              'Date of death matches exactly on all documents',
              'Deceased person information compiled and verified',
              'Requestor information compiled and verified',
              'Fraudulent account details documented',
              'Case file organized in CRM with unique ID',
              'Peer review completed by another team member',
              'Client notified that submission is ready'
            ]
          },
          {
            id: 'checklist3',
            title: 'Post-Submission Confirmation',
            type: 'info',
            icon: 'check',
            checklist: [
              'Experian confirmation number saved in CRM',
              'Confirmation number emailed to client',
              'Screenshot of confirmation page saved',
              'Submission date recorded in CRM',
              'Expected resolution date calculated (6 weeks)',
              'Calendar reminder set for 6-week mark',
              'Client notification email sent within 24 hours',
              'Creditor dispute letter prepared',
              'Creditor dispute letter sent via certified mail',
              'Certified mail tracking number saved',
              'Case status updated to "Submitted - Pending Processing"',
              'Weekly monitoring schedule established'
            ]
          },
          {
            id: 'checklist4',
            title: 'Case Closure Verification',
            type: 'info',
            icon: 'check',
            checklist: [
              'Experian confirmation letter received and scanned',
              'Experian letter confirms deceased indicator placed',
              'Experian letter mentions all fraudulent accounts',
              'Creditor cancellation letter received and scanned',
              'Creditor letter explicitly states debt cancelled',
              'Creditor letter confirms no further collection activity',
              'Final documentation package compiled',
              'Final email sent to client with all documents',
              'Physical copies mailed to client',
              'Client confirmed receipt and understanding',
              'No outstanding collection activity reported',
              'All case documentation archived properly',
              'Case closed in CRM with completion date',
              '30-day follow-up reminder scheduled',
              'Case added to monthly resolution report'
            ]
          }
        ]
      },
      {
        id: 'tools',
        title: 'TOOLS & TEMPLATES REQUIRED',
        type: 'info',
        icon: 'file',
        children: [
          {
            id: 'tool1',
            title: 'CRM/Case Management System',
            type: 'info',
            details: [
              'Required fields: Case ID, Client Name, Deceased Name, Status, Dates, Confirmation Numbers',
              'Status options: Awaiting Documents → Document Review → Submitted to Experian → Pending Response → Additional Info Needed → Resolved → Closed',
              'Automated reminders: 3-day, 7-day, weekly checks',
              'Document storage capability with version control'
            ]
          },
          {
            id: 'tool2',
            title: 'Email Templates',
            type: 'info',
            details: [
              'Template 1: Initial empathetic response',
              'Template 2: Document checklist email',
              'Template 3: Missing documents request',
              'Template 4: Experian submission confirmation',
              'Template 5: Bi-weekly status update',
              'Template 6: Urgent additional info needed',
              'Template 7: Final resolution email',
              'Template 8: 30-day follow-up'
            ]
          },
          {
            id: 'tool3',
            title: 'Letter Templates',
            type: 'info',
            details: [
              'Template 1: Fraud Affidavit for Experian',
              'Template 2: Creditor Fraud Dispute Letter',
              'Template 3: Creditor Follow-Up Letter',
              'Template 4: Final Documentation Cover Letter',
              'All templates on Elayne letterhead',
              'Include spaces for case-specific information'
            ]
          },
          {
            id: 'tool4',
            title: 'Tracking Spreadsheet',
            type: 'info',
            details: [
              'Column: Case ID, Client Name, Submission Date, Experian Confirmation #',
              'Column: Expected Resolution Date, Creditor Mail Tracking #, Status',
              'Column: Last Update Date, Next Action Due, Notes',
              'Filter/sort capabilities for monitoring multiple cases',
              'Weekly review in team meetings'
            ]
          }
        ]
      },
      {
        id: 'exceptions',
        title: 'EXCEPTION HANDLING & EDGE CASES',
        type: 'info',
        icon: 'alert',
        children: [
          {
            id: 'exception1',
            title: 'Multiple Fraudulent Accounts',
            type: 'info',
            details: [
              'If client discovers additional fraudulent accounts during process:',
              'List ALL accounts in single Experian submission (do not create separate submissions)',
              'Send separate dispute letter to each creditor',
              'Track each creditor response independently',
              'Timeline may extend by 1-2 weeks per additional account'
            ]
          },
          {
            id: 'exception2',
            title: 'Client Cannot Provide Required Documents',
            type: 'info',
            details: [
              'Death certificate: Guide client to county vital records office',
              'Marriage certificate: Usually same office as death certificate',
              'If documents lost: Explain process to obtain certified copies (7-14 days, $10-30 fee)',
              'If client cannot afford fees: Research if Elayne can cover or fee waiver available',
              'Photo ID expired: Current photo + expired ID usually acceptable',
              'Never proceed without required documents - submission will be rejected'
            ]
          },
          {
            id: 'exception3',
            title: 'Experian Online Portal Technical Issues',
            type: 'info',
            details: [
              'If portal is down or malfunctioning:',
              'BACKUP OPTION: Mail submission to Experian, P.O. Box 4500, Allen, TX 75013',
              'Include all same documents, prepare cover letter summarizing case',
              'Send via certified mail with return receipt',
              'Processing time: Same 4-6 weeks, but confirmation may take longer',
              'Call Experian after 2 weeks to confirm receipt: 888-397-3742'
            ]
          },
          {
            id: 'exception4',
            title: 'Creditor Continues Collection After Dispute',
            type: 'critical',
            details: [
              'If collections continue 45+ days after creditor received dispute:',
              'Document all violations: dates, times, what was said, who called',
              'Send final cease-and-desist letter via certified mail',
              'Inform client of their rights under FDCPA',
              'Consider: Filing complaint with Consumer Financial Protection Bureau (CFPB)',
              'Consider: Consultation with Elayne legal team for potential FDCPA lawsuit'
            ]
          },
          {
            id: 'exception5',
            title: 'Experian Denies Deceased Indicator Request',
            type: 'critical',
            details: [
              'Rare but possible if they suspect document fraud or inconsistencies',
              'Request detailed explanation of denial reason',
              'Review all submitted documents for errors or inconsistencies',
              'Common issues: Name mismatch, SSN error, document quality',
              'Correct any errors and resubmit immediately',
              'If denial seems incorrect: Escalate to Experian supervisor',
              'If still denied: May need legal consultation'
            ]
          }
        ]
      },
      {
        id: 'qa',
        title: 'QUALITY ASSURANCE CHECKPOINTS',
        type: 'info',
        icon: 'check',
        children: [
          {
            id: 'qa1',
            title: 'QA Checkpoint 1: Before Experian Submission',
            type: 'info',
            checklist: [
              'All 5 required documents collected and verified',
              'All documents clear, readable, properly oriented',
              'All names spelled consistently across documents',
              'SSN verified correct (compare multiple sources)',
              'Date of death matches exactly on all documents',
              'Fraud affidavit completed and signed',
              'Case file properly organized and backed up',
              'Peer review: Have another team member verify before sending'
            ]
          },
          {
            id: 'qa2',
            title: 'QA Checkpoint 2: Post-Submission',
            type: 'info',
            checklist: [
              'Confirmation number saved in at least 2 places',
              'Screenshot of confirmation page saved',
              'Client notified within 24 hours of submission',
              'Creditor letter sent within 24 hours of Experian submission',
              'All tracking numbers recorded',
              'Calendar reminders set for follow-ups',
              'Case status updated in CRM'
            ]
          },
          {
            id: 'qa3',
            title: 'QA Checkpoint 3: Before Case Closure',
            type: 'info',
            checklist: [
              'Experian confirmation letter received and filed',
              'Creditor cancellation letter received and filed',
              'Both letters explicitly confirm debt cancelled',
              'Client has received final documentation package',
              'Client has confirmed receipt and understanding',
              'No outstanding collection activity reported',
              'All case documentation archived properly',
              '30-day follow-up scheduled'
            ]
          }
        ]
      },
      {
        id: 'metrics',
        title: 'SUCCESS METRICS & KPIs',
        type: 'info',
        icon: 'check',
        children: [
          {
            id: 'metric1',
            title: 'Key Performance Indicators',
            type: 'info',
            details: [
              'METRIC: Average time to initial response (Target: < 2 hours)',
              'METRIC: Average time to Experian submission (Target: 4 days from intake)',
              'METRIC: Percentage of cases resolved without additional info requests (Target: 80%+)',
              'METRIC: Average total resolution time (Target: 6-8 weeks)',
              'METRIC: Client satisfaction score post-resolution (Target: 9+/10)',
              'METRIC: Percentage of cases requiring escalation (Track for process improvement)',
              'METRIC: Number of cases with continued collection violations (Target: 0)',
              'REVIEW: Monthly team review of all metrics, identify bottlenecks and improvements'
            ]
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Standard Operating Procedure
          </h1>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Experian Death Notification & Fraud Dispute Process
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>Purpose:</strong> This SOP provides step-by-step instructions for handling cases where a deceased person's identity has been stolen to open fraudulent accounts. This process covers notification to Experian, creditor dispute, and complete resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Timeline</span>
              </div>
              <p className="text-sm text-blue-800">6-8 weeks total</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Owner</span>
              </div>
              <p className="text-sm text-green-800">Support Specialist</p>
            </div>
            <div className="bg-emerald-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">Success Rate</span>
              </div>
              <p className="text-sm text-emerald-800">Target: 95%+</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 mb-1">Important: Click any phase to expand and see detailed steps</p>
              <p className="text-sm text-amber-800">This SOP contains complete instructions including exact forms, documents, addresses, and scripts needed at each step.</p>
            </div>
          </div>
        </div>

        <TreeNode node={processData} />

        <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Core Operating Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-2xl leading-none">✓</span>
              <span><strong>Empathy First:</strong> Every interaction acknowledges client's grief and stress</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl leading-none">✓</span>
              <span><strong>Document Everything:</strong> Every action, date, and communication recorded</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl leading-none">✓</span>
              <span><strong>Proactive Communication:</strong> Update clients regularly, even without news</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl leading-none">✓</span>
              <span><strong>Save Everything:</strong> Confirmation numbers, tracking numbers, screenshots</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl leading-none">✓</span>
              <span><strong>Speed on Urgents:</strong> Same-day response to Experian requests</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-2xl leading-none">✓</span>
              <span><strong>Quality Checks:</strong> Peer review before submission, verify before closure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessTree;
