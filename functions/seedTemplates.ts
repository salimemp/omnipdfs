import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const templates = [
      {
        name: 'Professional Invoice',
        description: 'Clean and professional invoice template for businesses',
        category: 'invoice',
        is_public: true,
        usage_count: 245,
        template_data: {
          sections: [
            { title: 'Company Info', content: '[Your Company Name]\n[Address]\n[Phone] | [Email]' },
            { title: 'Invoice Details', content: 'Invoice #: [Number]\nDate: [Date]\nDue Date: [Due Date]' },
            { title: 'Bill To', content: '[Client Name]\n[Client Address]\n[Client Contact]' },
            { title: 'Items', content: 'Description | Qty | Rate | Amount\n[Item details here]' },
            { title: 'Total', content: 'Subtotal: $[Amount]\nTax: $[Tax]\nTotal: $[Total]' }
          ]
        }
      },
      {
        name: 'Modern Resume',
        description: 'Contemporary resume layout with clean design',
        category: 'resume',
        is_public: true,
        usage_count: 532,
        template_data: {
          sections: [
            { title: 'Personal Info', content: '[Full Name]\n[Title/Position]\n[Email] | [Phone] | [Location]' },
            { title: 'Professional Summary', content: '[2-3 sentences highlighting your expertise and career goals]' },
            { title: 'Experience', content: '[Job Title] - [Company]\n[Dates]\n• [Achievement 1]\n• [Achievement 2]\n• [Achievement 3]' },
            { title: 'Education', content: '[Degree] - [University]\n[Graduation Year]\n[GPA/Honors if applicable]' },
            { title: 'Skills', content: '• [Skill 1]\n• [Skill 2]\n• [Skill 3]\n• [Skill 4]' }
          ]
        }
      },
      {
        name: 'Service Agreement',
        description: 'Standard service agreement for contractors',
        category: 'contract',
        is_public: true,
        usage_count: 189,
        template_data: {
          sections: [
            { title: 'Agreement Date', content: 'This Agreement entered on [Date] between [Service Provider] and [Client]' },
            { title: 'Services', content: 'The Service Provider agrees to provide the following services:\n[Detailed service description]' },
            { title: 'Payment Terms', content: 'Payment Amount: $[Amount]\nPayment Schedule: [Schedule]\nPayment Method: [Method]' },
            { title: 'Term', content: 'This agreement begins on [Start Date] and continues until [End Date]' },
            { title: 'Signatures', content: '[Service Provider Signature] Date: _____\n\n[Client Signature] Date: _____' }
          ]
        }
      },
      {
        name: 'Business Report',
        description: 'Comprehensive business report template',
        category: 'report',
        is_public: true,
        usage_count: 167,
        template_data: {
          sections: [
            { title: 'Title Page', content: '[Report Title]\nPrepared by: [Name]\nDate: [Date]\nFor: [Recipient]' },
            { title: 'Executive Summary', content: '[Brief overview of the report\'s key findings and recommendations]' },
            { title: 'Introduction', content: '[Background and purpose of the report]' },
            { title: 'Analysis', content: '[Detailed analysis with data and findings]' },
            { title: 'Recommendations', content: '1. [Recommendation 1]\n2. [Recommendation 2]\n3. [Recommendation 3]' },
            { title: 'Conclusion', content: '[Summary of key points and final thoughts]' }
          ]
        }
      },
      {
        name: 'Proposal Letter',
        description: 'Professional business proposal template',
        category: 'letter',
        is_public: true,
        usage_count: 298,
        template_data: {
          sections: [
            { title: 'Header', content: '[Your Company]\n[Date]\n\n[Recipient Name]\n[Recipient Title]\n[Company Name]' },
            { title: 'Opening', content: 'Dear [Recipient Name],\n\nWe are pleased to submit this proposal for [Project/Service].' },
            { title: 'Project Overview', content: '[Description of the project or service being proposed]' },
            { title: 'Deliverables', content: '• [Deliverable 1]\n• [Deliverable 2]\n• [Deliverable 3]' },
            { title: 'Timeline', content: 'Project Duration: [Timeframe]\nKey Milestones:\n- [Milestone 1]: [Date]\n- [Milestone 2]: [Date]' },
            { title: 'Investment', content: 'Total Investment: $[Amount]\nPayment Terms: [Terms]' },
            { title: 'Closing', content: 'We look forward to the opportunity to work with you.\n\nSincerely,\n[Your Name]\n[Your Title]' }
          ]
        }
      },
      {
        name: 'Certificate of Achievement',
        description: 'Award certificate for accomplishments',
        category: 'certificate',
        is_public: true,
        usage_count: 412,
        template_data: {
          sections: [
            { title: 'Title', content: 'CERTIFICATE OF ACHIEVEMENT' },
            { title: 'Recipient', content: 'This is to certify that\n\n[Recipient Name]\n\nhas successfully' },
            { title: 'Achievement', content: '[Description of achievement or completion]' },
            { title: 'Date', content: 'Awarded on this [Day] day of [Month], [Year]' },
            { title: 'Signature', content: '_____________________\n[Authorizer Name]\n[Title]' }
          ]
        }
      },
      {
        name: 'Employment Contract',
        description: 'Standard employment agreement template',
        category: 'contract',
        is_public: true,
        usage_count: 223,
        template_data: {
          sections: [
            { title: 'Parties', content: 'This Employment Agreement is entered into between [Company Name] ("Employer") and [Employee Name] ("Employee").' },
            { title: 'Position', content: 'Job Title: [Title]\nDepartment: [Department]\nStart Date: [Date]' },
            { title: 'Compensation', content: 'Base Salary: $[Amount] per [Period]\nBenefits: [List of benefits]' },
            { title: 'Responsibilities', content: '[Job duties and responsibilities]' },
            { title: 'Terms', content: 'Employment Type: [Full-time/Part-time/Contract]\nProbation Period: [Duration]\nNotice Period: [Duration]' },
            { title: 'Signatures', content: 'Employer: _____________________ Date: _____\n\nEmployee: _____________________ Date: _____' }
          ]
        }
      },
      {
        name: 'Meeting Minutes',
        description: 'Template for recording meeting notes',
        category: 'report',
        is_public: true,
        usage_count: 334,
        template_data: {
          sections: [
            { title: 'Meeting Info', content: 'Meeting: [Title]\nDate: [Date]\nTime: [Time]\nLocation: [Location/Virtual]' },
            { title: 'Attendees', content: 'Present:\n• [Name 1]\n• [Name 2]\n\nAbsent:\n• [Name 3]' },
            { title: 'Agenda', content: '1. [Agenda Item 1]\n2. [Agenda Item 2]\n3. [Agenda Item 3]' },
            { title: 'Discussion', content: '[Summary of discussions for each agenda item]' },
            { title: 'Action Items', content: '• [Action Item 1] - Assigned to: [Name] - Due: [Date]\n• [Action Item 2] - Assigned to: [Name] - Due: [Date]' },
            { title: 'Next Meeting', content: 'Date: [Date]\nTime: [Time]\nLocation: [Location]' }
          ]
        }
      }
    ];

    const created = [];
    for (const template of templates) {
      const result = await base44.asServiceRole.entities.Template.create(template);
      created.push(result);
    }

    return Response.json({
      success: true,
      message: `Created ${created.length} templates`,
      templates: created
    });
  } catch (error) {
    console.error('Template seeding error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
});