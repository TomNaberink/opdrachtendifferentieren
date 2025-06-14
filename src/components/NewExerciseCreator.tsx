'use client'

import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

interface NewExerciseCreatorProps {
  onBack: () => void
}

interface ExerciseResult {
  easy: string
  normal: string
  hard: string
  answerKey: string
}

export default function NewExerciseCreator({ onBack }: NewExerciseCreatorProps) {
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [exerciseType, setExerciseType] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ExerciseResult | null>(null)
  const [error, setError] = useState('')

  const subjects = [
    'Wiskunde', 'Nederlands', 'Engels', 'Geschiedenis', 'Aardrijkskunde', 
    'Biologie', 'Natuurkunde', 'Scheikunde', 'Economie', 'Maatschappijleer', 'Andere'
  ]

  const exerciseTypes = [
    'Rekensommen', 'Woordproblemen', 'Begrijpend lezen', 'Grammatica', 
    'Woordenschat', 'Opstel/verhaal', 'Onderzoeksopdracht', 'Experiment', 
    'Kaartvaardigheden', 'Tijdlijn', 'Andere'
  ]

  const gradeLevels = [
    'Groep 1-2', 'Groep 3', 'Groep 4', 'Groep 5', 'Groep 6', 
    'Groep 7', 'Groep 8', 'Klas 1', 'Klas 2', 'Klas 3', 'Klas 4', 'Klas 5', 'Klas 6'
  ]

  const generateExercise = async () => {
    if (!subject || !topic || !gradeLevel || !exerciseType) {
      setError('Vul alle verplichte velden in')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const prompt = `
Maak een gedifferentieerde oefening voor het onderwijs met de volgende specificaties:

**Vak:** ${subject}
**Onderwerp:** ${topic}
**Groep/Klas:** ${gradeLevel}
**Type oefening:** ${exerciseType}
${additionalInfo ? `**Extra informatie:** ${additionalInfo}` : ''}

Maak drie versies van dezelfde oefening:

## 🟢 MAKKELIJKE VERSIE
[Maak een eenvoudige versie met:
- Kleinere getallen/eenvoudigere concepten
- Meer begeleiding en stappenplannen
- Duidelijke voorbeelden
- Minder complexe vraagstelling]

## 🟡 NORMALE VERSIE  
[Maak een standaard versie met:
- Gemiddelde moeilijkheidsgraad
- Standaard getallen/concepten voor dit niveau
- Beperkte begeleiding
- Normale vraagstelling]

## 🔴 MOEILIJKE VERSIE
[Maak een uitdagende versie met:
- Grotere getallen/complexere concepten
- Minimale begeleiding
- Uitbreidingsvragen
- Meer analytisch denken vereist]

## 📋 ANTWOORDMODEL
[Geef voor alle drie de versies:
- Uitgewerkte antwoorden
- Stappenplannen waar relevant
- Beoordelingscriteria
- Tips voor feedback]

Zorg ervoor dat alle versies hetzelfde leeroel hebben maar op verschillende niveaus worden aangeboden. Gebruik duidelijke Nederlandse taal die past bij ${gradeLevel}.
`

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          aiModel: 'smart'
        }),
      })

      if (!response.ok) {
        throw new Error('Er ging iets mis bij het genereren van de oefening')
      }

      const data = await response.json()
      
      // Parse the response to extract different sections
      const content = data.response
      const sections = content.split('##').filter((section: string) => section.trim())
      
      let easy = '', normal = '', hard = '', answerKey = ''
      
      sections.forEach((section: string) => {
        const trimmed = section.trim()
        if (trimmed.includes('🟢') || trimmed.toLowerCase().includes('makkelijke')) {
          easy = trimmed
        } else if (trimmed.includes('🟡') || trimmed.toLowerCase().includes('normale')) {
          normal = trimmed
        } else if (trimmed.includes('🔴') || trimmed.toLowerCase().includes('moeilijke')) {
          hard = trimmed
        } else if (trimmed.includes('📋') || trimmed.toLowerCase().includes('antwoordmodel')) {
          answerKey = trimmed
        }
      })

      // If parsing failed, use the full content
      if (!easy && !normal && !hard) {
        easy = content
        normal = 'Zie volledige inhoud bij makkelijke versie'
        hard = 'Zie volledige inhoud bij makkelijke versie'
        answerKey = 'Zie volledige inhoud bij makkelijke versie'
      }

      setResult({ easy, normal, hard, answerKey })

    } catch (err) {
      console.error('Error generating exercise:', err)
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Nieuwe Oefening Maken</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Oefening Specificaties</h2>
          
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vak *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Kies een vak</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onderwerp *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Bijv. Breuken, Werkwoordspelling, Fotosynthese..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Groep/Klas *
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Kies groep/klas</option>
                {gradeLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Exercise Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Oefening *
              </label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Kies type oefening</option>
                {exerciseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Informatie (optioneel)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Specifieke wensen, leerdoelen, context..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateExercise}
              disabled={isLoading || !subject || !topic || !gradeLevel || !exerciseType}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Oefening wordt gemaakt...
                </span>
              ) : (
                '🚀 Maak Gedifferentieerde Oefening'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Easy Version */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800 flex items-center">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">🟢</span>
                    </span>
                    Makkelijke Versie
                  </h3>
                  <ResponseActions 
                    content={result.easy}
                    isMarkdown={true}
                    className="scale-75"
                  />
                </div>
                <div className="bg-white rounded-lg p-4">
                  <MarkdownRenderer content={result.easy} />
                </div>
              </div>

              {/* Normal Version */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                    <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">🟡</span>
                    </span>
                    Normale Versie
                  </h3>
                  <ResponseActions 
                    content={result.normal}
                    isMarkdown={true}
                    className="scale-75"
                  />
                </div>
                <div className="bg-white rounded-lg p-4">
                  <MarkdownRenderer content={result.normal} />
                </div>
              </div>

              {/* Hard Version */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-800 flex items-center">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">🔴</span>
                    </span>
                    Moeilijke Versie
                  </h3>
                  <ResponseActions 
                    content={result.hard}
                    isMarkdown={true}
                    className="scale-75"
                  />
                </div>
                <div className="bg-white rounded-lg p-4">
                  <MarkdownRenderer content={result.hard} />
                </div>
              </div>

              {/* Answer Key */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-sm">📋</span>
                    </span>
                    Antwoordmodel
                  </h3>
                  <ResponseActions 
                    content={result.answerKey}
                    isMarkdown={true}
                    className="scale-75"
                  />
                </div>
                <div className="bg-white rounded-lg p-4">
                  <MarkdownRenderer content={result.answerKey} />
                </div>
              </div>
            </>
          )}

          {!result && !isLoading && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Klaar om te beginnen?</h3>
              <p className="text-gray-500">Vul de gegevens in en klik op 'Maak Gedifferentieerde Oefening' om je oefeningen te genereren.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}