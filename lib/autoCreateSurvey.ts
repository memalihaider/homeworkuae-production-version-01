// lib/autoCreateSurvey.ts - FIXED VERSION

import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface AutoCreateSurveyParams {
  leadId: string
  leadName: string
  leadCompany: string
  surveyType: string
  email?: string
  phone?: string
}

export async function autoCreateSurveyFromLead({
  leadId,
  leadName,
  leadCompany,
  surveyType,
  email,
  phone
}: AutoCreateSurveyParams) {
  
  // Agar "needed or not" hai toh koi survey create na karo
  if (surveyType === 'needed or not') {
    console.log('🚫 No survey needed for this lead')
    return null
  }

  // Survey category decide karo
  const category = surveyType === 'survey-Online' ? 'Online Survey' : 'Physical Survey'
  
  // Survey title create karo
  const surveyTitle = `${category} - ${leadName} (${leadCompany})`

  // 2 long questions create karo
  const questions = [
    {
      id: `q1-${Date.now()}`,
      text: 'Which type of survey would you prefer?',
      type: 'textarea',
      required: true,
      placeholder: 'Please describe your preferred survey type...'
    },
    {
      id: `q2-${Date.now()}`,
      text: 'Which type of proper survey methodology do you recommend?',
      type: 'textarea',
      required: true,
      placeholder: 'Please explain the proper survey methodology...'
    }
  ]

  // Section create karo
  const section = {
    id: `section-${Date.now()}`,
    title: 'Survey Requirements',
    description: 'Please answer the following questions about your survey preferences',
    questions: questions
  }

  // 🔥 IMPORTANT: selectedClient object EXACT same format mein
  const selectedClientObject = {
    id: leadId,
    name: leadName,
    company: leadCompany,
    type: 'lead',
    email: email || '',
    phone: phone || ''
  }

  // Survey data prepare karo
  const surveyData = {
    title: surveyTitle,
    description: `Auto-generated survey from lead: ${leadName} (${leadCompany})`,
    sections: [section],
    status: 'draft',
    category: category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    responsesCount: 0,
    // ✅ YEH EXACT FORMAT HAI JO DASHBOARD EXPECT KARTA HAI
    selectedClient: selectedClientObject,
    // Meta information (optional)
    meta: {
      generatedFrom: 'lead',
      leadId: leadId,
      surveyType: surveyType,
      generatedAt: new Date().toISOString()
    }
  }

  try {
    // Survey Firebase mein save karo
    const docRef = await addDoc(collection(db, 'surveys'), surveyData)
    console.log('✅ Survey auto-created successfully:', {
      id: docRef.id,
      title: surveyTitle,
      selectedClient: selectedClientObject
    })
    return docRef.id
  } catch (error) {
    console.error('❌ Error auto-creating survey:', error)
    return null
  }
}