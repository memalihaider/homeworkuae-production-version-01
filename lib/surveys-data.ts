// Survey data types and constants
export interface SurveyQuestion {
  id: string
  sectionId: string
  text: string
  type: 'text' | 'textarea' | 'rating' | 'multiple-choice' | 'checkbox' | 'scale' | 'nps' | 'date'
  required: boolean
  order: number
  options?: string[] // For multiple-choice and checkbox
  minLabel?: string // For scale questions
  maxLabel?: string // For scale questions
  minValue?: number // For scale/NPS
  maxValue?: number // For scale/NPS
  placeholder?: string
}

export interface SurveySection {
  id: string
  title: string
  description?: string
  order: number
  questions: SurveyQuestion[]
}

export interface Survey {
  id: string
  clientId: number
  clientName: string
  clientEmail: string
  company: string
  location: string
  serviceType: string
  status: 'draft' | 'active' | 'paused' | 'closed' | 'completed'
  title: string
  description?: string
  sections: SurveySection[]
  createdDate: string
  updatedDate: string
  dueDate?: string
  completedDate?: string
  sendCount: number
  responseCount: number
  completionRate: number
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  assignedTo?: string
}

export interface SurveyResponse {
  id: string
  surveyId: string
  clientId: number
  clientName: string
  clientEmail: string
  submittedDate: string
  responses: {
    questionId: string
    answer: string | number | string[] | boolean
  }[]
  overallRating?: number
  comments?: string
}

export interface SurveyTemplate {
  id: string
  name: string
  description: string
  category: string
  sections: SurveySection[]
  isActive: boolean
}

// Mock survey templates
export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  {
    id: 'template-satisfaction',
    name: 'Service Satisfaction Survey',
    description: 'Measure overall client satisfaction with our cleaning services',
    category: 'Satisfaction',
    isActive: true,
    sections: [
      {
        id: 'sec-1',
        title: 'Service Quality',
        description: 'Please rate the quality of our cleaning services',
        order: 1,
        questions: [
          {
            id: 'q-1',
            sectionId: 'sec-1',
            text: 'How would you rate the overall cleanliness achieved?',
            type: 'rating',
            required: true,
            order: 1,
            minValue: 1,
            maxValue: 5,
          },
          {
            id: 'q-2',
            sectionId: 'sec-1',
            text: 'Were all areas cleaned to your satisfaction?',
            type: 'multiple-choice',
            required: true,
            order: 2,
            options: ['Yes, completely satisfied', 'Mostly satisfied', 'Partially satisfied', 'Not satisfied'],
          },
          {
            id: 'q-3',
            sectionId: 'sec-1',
            text: 'How would you rate the attention to detail?',
            type: 'scale',
            required: true,
            order: 3,
            minValue: 1,
            maxValue: 5,
            minLabel: 'Poor',
            maxLabel: 'Excellent',
          },
        ],
      },
      {
        id: 'sec-2',
        title: 'Staff Performance',
        description: 'Rate our cleaning staff professionalism and courtesy',
        order: 2,
        questions: [
          {
            id: 'q-4',
            sectionId: 'sec-2',
            text: 'Were the staff members professional and courteous?',
            type: 'rating',
            required: true,
            order: 1,
            minValue: 1,
            maxValue: 5,
          },
          {
            id: 'q-5',
            sectionId: 'sec-2',
            text: 'Did staff arrive on time?',
            type: 'multiple-choice',
            required: true,
            order: 2,
            options: ['Yes, on time', 'A few minutes late', 'Significantly late'],
          },
          {
            id: 'q-6',
            sectionId: 'sec-2',
            text: 'Were safety protocols properly followed?',
            type: 'checkbox',
            required: false,
            order: 3,
            options: ['Yes', 'No', 'Not applicable'],
          },
        ],
      },
      {
        id: 'sec-3',
        title: 'Overall Experience',
        description: 'General feedback and recommendations',
        order: 3,
        questions: [
          {
            id: 'q-7',
            sectionId: 'sec-3',
            text: 'How likely are you to recommend our services? (0-10)',
            type: 'nps',
            required: true,
            order: 1,
            minValue: 0,
            maxValue: 10,
          },
          {
            id: 'q-8',
            sectionId: 'sec-3',
            text: 'What could we improve?',
            type: 'textarea',
            required: false,
            order: 2,
            placeholder: 'Please share your suggestions...',
          },
          {
            id: 'q-9',
            sectionId: 'sec-3',
            text: 'Would you like us to contact you regarding your feedback?',
            type: 'multiple-choice',
            required: false,
            order: 3,
            options: ['Yes, please', 'No, thank you'],
          },
        ],
      },
    ],
  },
  {
    id: 'template-complaint',
    name: 'Complaint & Feedback Form',
    description: 'Collect complaints and detailed feedback from clients',
    category: 'Feedback',
    isActive: true,
    sections: [
      {
        id: 'sec-1',
        title: 'Complaint Details',
        description: 'Please describe your complaint in detail',
        order: 1,
        questions: [
          {
            id: 'q-1',
            sectionId: 'sec-1',
            text: 'What is the nature of your complaint?',
            type: 'multiple-choice',
            required: true,
            order: 1,
            options: ['Service quality', 'Staff behavior', 'Pricing', 'Scheduling', 'Other'],
          },
          {
            id: 'q-2',
            sectionId: 'sec-1',
            text: 'Please describe the issue in detail',
            type: 'textarea',
            required: true,
            order: 2,
            placeholder: 'Provide detailed information about the complaint...',
          },
          {
            id: 'q-3',
            sectionId: 'sec-1',
            text: 'When did this issue occur?',
            type: 'date',
            required: true,
            order: 3,
          },
        ],
      },
      {
        id: 'sec-2',
        title: 'Resolution',
        description: 'How would you like us to resolve this?',
        order: 2,
        questions: [
          {
            id: 'q-4',
            sectionId: 'sec-2',
            text: 'What resolution would satisfy you?',
            type: 'textarea',
            required: false,
            order: 1,
            placeholder: 'Describe your preferred resolution...',
          },
          {
            id: 'q-5',
            sectionId: 'sec-2',
            text: 'How would you prefer to be contacted?',
            type: 'multiple-choice',
            required: true,
            order: 2,
            options: ['Email', 'Phone', 'In-person meeting', 'No contact needed'],
          },
        ],
      },
    ],
  },
  {
    id: 'template-training',
    name: 'Staff Training Feedback',
    description: 'Evaluate training effectiveness and staff knowledge',
    category: 'Training',
    isActive: true,
    sections: [
      {
        id: 'sec-1',
        title: 'Training Content',
        description: 'Rate the training content and delivery',
        order: 1,
        questions: [
          {
            id: 'q-1',
            sectionId: 'sec-1',
            text: 'Was the training content relevant to your role?',
            type: 'rating',
            required: true,
            order: 1,
            minValue: 1,
            maxValue: 5,
          },
          {
            id: 'q-2',
            sectionId: 'sec-1',
            text: 'How clear was the instructor?',
            type: 'scale',
            required: true,
            order: 2,
            minValue: 1,
            maxValue: 5,
            minLabel: 'Unclear',
            maxLabel: 'Very clear',
          },
        ],
      },
    ],
  },
];

// Mock survey data
export const MOCK_SURVEYS: Survey[] = [
  {
    id: 'survey-1',
    clientId: 1,
    clientName: 'Ahmed Al-Mansouri',
    clientEmail: 'ahmed@dubaiprop.ae',
    company: 'Dubai Properties LLC',
    location: 'Dubai Marina',
    serviceType: 'Office Deep Cleaning',
    status: 'active',
    title: 'Service Satisfaction Survey - January 2025',
    description: 'Please help us improve by rating your recent cleaning service experience.',
    sections: SURVEY_TEMPLATES[0].sections,
    createdDate: '2025-12-20',
    updatedDate: '2025-12-20',
    dueDate: '2026-01-27',
    sendCount: 5,
    responseCount: 3,
    completionRate: 60,
    priority: 'High',
    assignedTo: 'Survey Team A',
  },
  {
    id: 'survey-2',
    clientId: 4,
    clientName: 'Mohammed Al-Zahra',
    clientEmail: 'mohammed@emmc.ae',
    company: 'Emirates Medical Center',
    location: 'Dubai Healthcare City',
    serviceType: 'Medical Facility Sanitization',
    status: 'completed',
    title: 'Medical Facility Service Review',
    description: 'Critical feedback for our medical center cleaning protocols.',
    sections: SURVEY_TEMPLATES[0].sections,
    createdDate: '2025-12-19',
    updatedDate: '2026-01-20',
    dueDate: '2026-01-15',
    completedDate: '2026-01-20',
    sendCount: 8,
    responseCount: 7,
    completionRate: 87.5,
    priority: 'Critical',
    assignedTo: 'Survey Team B',
  },
  {
    id: 'survey-3',
    clientId: 2,
    clientName: 'Layla Hassan',
    clientEmail: 'layla@paradisehotels.ae',
    company: 'Paradise Hotels',
    location: 'Palm Jumeirah',
    serviceType: 'Hotel Deep Cleaning',
    status: 'draft',
    title: 'Guest Satisfaction Survey',
    description: 'Collect guest feedback on our hotel cleaning services.',
    sections: SURVEY_TEMPLATES[0].sections,
    createdDate: '2026-01-25',
    updatedDate: '2026-01-25',
    dueDate: '2026-02-10',
    sendCount: 0,
    responseCount: 0,
    completionRate: 0,
    priority: 'Medium',
  },
];

// Mock survey responses
export const MOCK_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp-1',
    surveyId: 'survey-1',
    clientId: 1,
    clientName: 'Ahmed Al-Mansouri',
    clientEmail: 'ahmed@dubaiprop.ae',
    submittedDate: '2026-01-21',
    responses: [
      { questionId: 'q-1', answer: 5 },
      { questionId: 'q-2', answer: 'Yes, completely satisfied' },
      { questionId: 'q-3', answer: 4 },
      { questionId: 'q-4', answer: 5 },
      { questionId: 'q-5', answer: 'Yes, on time' },
      { questionId: 'q-7', answer: 9 },
      { questionId: 'q-8', answer: 'Overall excellent service, no improvements needed.' },
    ],
    overallRating: 4.7,
  },
  {
    id: 'resp-2',
    surveyId: 'survey-1',
    clientId: 1,
    clientName: 'Ahmed Al-Mansouri',
    clientEmail: 'ahmed@dubaiprop.ae',
    submittedDate: '2026-01-22',
    responses: [
      { questionId: 'q-1', answer: 4 },
      { questionId: 'q-2', answer: 'Mostly satisfied' },
      { questionId: 'q-3', answer: 4 },
      { questionId: 'q-4', answer: 4 },
      { questionId: 'q-5', answer: 'A few minutes late' },
      { questionId: 'q-7', answer: 8 },
      { questionId: 'q-8', answer: 'Great service, could improve scheduling.' },
    ],
    overallRating: 4.2,
  },
];
