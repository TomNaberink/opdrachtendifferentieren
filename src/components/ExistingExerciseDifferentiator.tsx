'use client'

import { useState, useRef } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

interface ExistingExerciseDifferentiatorProps {
  onBack: () => void
}

type DifferentiationOption = 
  | 'variants' 
  | 'easier' 
  | 'harder' 
  | 'newData' 
  | 'different' 
  | 'custom'

export default function ExistingExerciseDifferentiator({ onBack }: ExistingExerciseDifferentiatorProps) {
  const [exerciseText, setExerciseText] = useState('')
  const [selectedOption, setSelectedOption] = useState<DifferentiationOption | null>(null)
  const [customRequest, setCustomRequest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const differentiationOptions = [
    {
      id: 'variants' as DifferentiationOption,
      title: '🎯 Maak 3 Varianten',
      description: 'Genereer makkelijke, normale en moeilijke versie',
      color: 'blue',
      icon: '🎯'
    },
    {
      id: 'easier' as DifferentiationOption,
      title: '🟢 Maak Makkelijker',
      description: 'Vereenvoudig de opdracht voor zwakkere leerlingen',
      color: 'green',
      icon: '🟢'
    },
    {
      id: 'harder' as DifferentiationOption,
      title: '🔴 Maak Moeilijker',
      description: 'Uitdagendere versie voor sterke leerlingen',
      color: 'red',
      icon: '🔴'
    },
    {
      id: 'newData' as DifferentiationOption,
      title: '🔢 Nieuwe Getallen/Data',
      description: 'Behoud de structuur, verander alleen de cijfers/gegevens',
      color: 'purple',
      icon: '🔢'
    },
    {
      id: 'different' as DifferentiationOption,
      title: '🔄 Andere Context',
      description: 'Zelfde leerdoel, maar in een andere situatie',
      color: 'orange',
      icon: '🔄'
    },
    {
      id: 'custom' as DifferentiationOption,
      title: '✏️ Eigen Wens',
      description: 'Beschrijf zelf wat je wilt aanpassen',
      color: 'gray',
      icon: '✏️'
    }
  ]

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.txt')) {
      setError('Alleen .docx, .pdf en .txt bestanden worden ondersteund')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Fout bij het uploaden van het bestand')
      }

      const data = await response.json()
      setExerciseText(data.content)
      setError('')
    } catch (err) {
      console.error('Upload error:', err)
      setError('Er is een fout opgetreden bij het uploaden van het bestand')
    }
  }

  const generateDifferentiation = async () => {
    if (!exerciseText.trim() || !selectedOption) {
      setError('Voeg eerst een oefening toe en kies een optie')
      return
    }

    setIsLoading(true)
    setError('')
    setResult('')

    try {
      let prompt = ''

      switch (selectedOption) {
        case 'variants':
          prompt = `
Hier is een bestaande oefening:

${exerciseText}

Maak hiervan drie gedifferentieerde versies:

## 🟢 MAKKELIJKE VERSIE
[Maak een eenvoudigere versie met:
- Kleinere getallen of eenvoudigere concepten
- Meer begeleiding en stappenplannen
- Duidelijke voorbeelden
- Minder complexe vraagstelling]

## 🟡 NORMALE VERSIE (ORIGINEEL)
[Behoud de originele moeilijkheidsgraad maar verbeter waar nodig:
- Duidelijkere instructies
- Betere structuur
- Eventuele kleine aanpassingen voor helderheid]

## 🔴 MOEILIJKE VERSIE
[Maak een uitdagendere versie met:
- Grotere getallen of complexere concepten
- Minimale begeleiding
- Uitbreidingsvragen
- Meer analytisch denken vereist]

Zorg ervoor dat alle versies hetzelfde leerdoel hebben.`
          break

        case 'easier':
          prompt = `
Hier is een bestaande oefening:

${exerciseText}

Maak hiervan een makkelijkere versie die geschikt is voor leerlingen die extra ondersteuning nodig hebben. Denk aan:
- Kleinere getallen
- Eenvoudigere woordenschat
- Meer stappenplannen
- Duidelijke voorbeelden
- Minder onderdelen tegelijk
- Meer begeleiding

Behoud wel hetzelfde leerdoel.`
          break

        case 'harder':
          prompt = `
Hier is een bestaande oefening:

${exerciseText}

Maak hiervan een moeilijkere versie die geschikt is voor leerlingen die extra uitdaging nodig hebben. Denk aan:
- Grotere getallen
- Complexere situaties
- Minder begeleiding
- Uitbreidingsvragen
- Meer stappen tegelijk
- Analytischer denken

Behoud wel hetzelfde leerdoel.`
          break

        case 'newData':
          prompt = `
Hier is een bestaande oefening:

${exerciseText}

Maak een nieuwe versie met andere getallen, namen, plaatsen of gegevens, maar behoud exact dezelfde structuur en moeilijkheidsgraad. Verander alleen de concrete data, niet de opzet van de opdracht.`
          break

        case 'different':
          prompt = `
Hier is een bestaande oefening:

${exerciseText}

Maak een nieuwe versie met hetzelfde leerdoel maar in een andere context of situatie. Bijvoorbeeld:
- Andere setting (school → winkel → sport)
- Andere personages
- Andere voorwerpen
- Andere tijdsperiode

Behoud de moeilijkheidsgraad en het leerdoel.`
          break

        case 'custom':
          prompt = `
Hier is een bestaande oefening:

${exerciseText}

Pas deze oefening aan volgens de volgende wens:

${customRequest}

Zorg ervoor dat de aanpassing logisch en educatief verantwoord is.`
          break
      }

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
        throw new Error('Er ging iets mis bij het genereren van de differentiatie')
      }

      const data = await response.json()
      setResult(data.response)

    } catch (err) {
      console.error('Error generating differentiation:', err)
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClasses = (color: string, selected: boolean) => {
    const colors = {
      blue: selected ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-blue-200 hover:border-blue-300 hover:shadow-md',
      green: selected ? 'border-green-500 bg-green-50 shadow-lg' : 'border-green-200 hover:border-green-300 hover:shadow-md',
      red: selected ? 'border-red-500 bg-red-50 shadow-lg' : 'border-red-200 hover:border-red-300 hover:shadow-md',
      purple: selected ? 'border-purple-500 bg-purple-50 shadow-lg' : 'border-purple-200 hover:border-purple-300 hover:shadow-md',
      orange: selected ? 'border-orange-500 bg-orange-50 shadow-lg' : 'border-orange-200 hover:border-orange-300 hover:shadow-md',
      gray: selected ? 'border-gray-500 bg-gray-50 shadow-lg' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Bestaande Oefening Differentiëren</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Exercise Input */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stap 1: Voeg je oefening toe</h2>
            
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Word/PDF
                </button>
                <span className="text-gray-500 text-sm">of plak hieronder</span>
              </div>

              {/* Text Area */}
              <textarea
                value={exerciseText}
                onChange={(e) => setExerciseText(e.target.value)}
                placeholder="Plak hier je bestaande oefening..."
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.pdf,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Differentiation Options */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stap 2: Wat wil je doen?</h2>
            
            <div className="grid gap-3">
              {differentiationOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${getColorClasses(option.color, selectedOption === option.id)}`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        {option.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                      selectedOption === option.id 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option.id && (
                        <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Request Input */}
            {selectedOption === 'custom' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijf wat je wilt aanpassen:
                </label>
                <textarea
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  placeholder="Bijv. 'Maak de getallen groter', 'Voeg een extra vraag toe', 'Verander de context naar sport'..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateDifferentiation}
              disabled={isLoading || !exerciseText.trim() || !selectedOption || (selectedOption === 'custom' && !customRequest.trim())}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Bezig met differentiëren...
                </span>
              ) : (
                '🚀 Start Differentiatie'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </span>
                  Gedifferentieerde Oefening
                </h3>
                <ResponseActions 
                  content={result}
                  isMarkdown={true}
                  className="scale-90"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <MarkdownRenderer content={result} />
              </div>
            </div>
          )}

          {!result && !isLoading && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Klaar om te differentiëren?</h3>
              <p className="text-gray-500">Upload of plak je oefening, kies wat je wilt doen, en laat AI het werk voor je doen!</p>
            </div>
          )}

          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
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
      </div>
    </div>
  )
}