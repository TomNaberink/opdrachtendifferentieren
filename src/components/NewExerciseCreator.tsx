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
    <div className="max-w-7xl mx-auto">
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

      {!result ? (
        // Input Form - Full width when no results
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Oefening Specificaties</h2>
            
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vak *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Bijv. Wiskunde, Nederlands, Biologie..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                  Klas/Groep *
                </label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="Bijv. Groep 5, Klas 2, 3 VMBO-T..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Exercise Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wat voor oefening wil je maken? *
                </label>
                <input
                  type="text"
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                  placeholder="Bijv. Rekensommen, Begrijpend lezen, Woordproblemen, Grammatica..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extra Informatie (optioneel)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Specifieke wensen, leerdoelen, context, aantal vragen..."
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
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

          {isLoading && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">AI is aan het werk...</h3>
              <p className="text-blue-600">Je gedifferentieerde oefening wordt gemaakt. Dit duurt even.</p>
            </div>
          )}
        </div>
      ) : (
        // Results - Large display
        <div className="space-y-8">
          {/* Summary Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {subject} - {topic}
                </h2>
                <p className="text-gray-600">
                  {gradeLevel} • {exerciseType}
                </p>
              </div>
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nieuwe Oefening Maken
              </button>
            </div>
          </div>

          {/* Easy Version */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-green-800 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🟢</span>
                </span>
                Makkelijke Versie
              </h3>
              <ResponseActions 
                content={result.easy}
                isMarkdown={true}
                className=""
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MarkdownRenderer content={result.easy} className="text-base leading-relaxed" />
            </div>
          </div>

          {/* Normal Version */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-yellow-800 flex items-center">
                <span className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🟡</span>
                </span>
                Normale Versie
              </h3>
              <ResponseActions 
                content={result.normal}
                isMarkdown={true}
                className=""
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MarkdownRenderer content={result.normal} className="text-base leading-relaxed" />
            </div>
          </div>

          {/* Hard Version */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-red-800 flex items-center">
                <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🔴</span>
                </span>
                Moeilijke Versie
              </h3>
              <ResponseActions 
                content={result.hard}
                isMarkdown={true}
                className=""
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MarkdownRenderer content={result.hard} className="text-base leading-relaxed" />
            </div>
          </div>

          {/* Answer Key */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-800 flex items-center">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">📋</span>
                </span>
                Antwoordmodel & Beoordelingscriteria
              </h3>
              <ResponseActions 
                content={result.answerKey}
                isMarkdown={true}
                className=""
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MarkdownRenderer content={result.answerKey} className="text-base leading-relaxed" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Nieuwe Oefening Maken
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                🏠 Terug naar Hoofdmenu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}