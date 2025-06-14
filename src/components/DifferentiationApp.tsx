'use client'

import { useState } from 'react'
import NewExerciseCreator from './NewExerciseCreator'
import ExistingExerciseDifferentiator from './ExistingExerciseDifferentiator'

type AppMode = 'selection' | 'new' | 'existing'

export default function DifferentiationApp() {
  const [mode, setMode] = useState<AppMode>('selection')

  const resetToSelection = () => {
    setMode('selection')
  }

  if (mode === 'new') {
    return <NewExerciseCreator onBack={resetToSelection} />
  }

  if (mode === 'existing') {
    return <ExistingExerciseDifferentiator onBack={resetToSelection} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Selection */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Wat wil je vandaag doen?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* New Exercise Option */}
          <div 
            onClick={() => setMode('new')}
            className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-xl p-8 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-700 transition-colors">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Nieuwe Oefening Maken
              </h3>
              
              <p className="text-green-700 mb-6">
                Maak een compleet nieuwe oefening met automatisch 3 verschillende niveaus: 
                makkelijk, normaal en moeilijk.
              </p>
              
              <div className="bg-white bg-opacity-60 rounded-lg p-4 text-sm text-green-800">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span className="font-medium">Wat krijg je?</span>
                </div>
                <ul className="text-left space-y-1">
                  <li>• 🟢 Makkelijke variant</li>
                  <li>• 🟡 Normale variant</li>
                  <li>• 🔴 Moeilijke variant</li>
                  <li>• 📋 Antwoordmodellen</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Existing Exercise Option */}
          <div 
            onClick={() => setMode('existing')}
            className="group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-8 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-700 transition-colors">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Bestaande Oefening Differentiëren
              </h3>
              
              <p className="text-blue-700 mb-6">
                Upload een bestaande opdracht en laat AI verschillende varianten maken 
                of specifieke aanpassingen doorvoeren.
              </p>
              
              <div className="bg-white bg-opacity-60 rounded-lg p-4 text-sm text-blue-800">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                  <span className="font-medium">Mogelijkheden:</span>
                </div>
                <ul className="text-left space-y-1">
                  <li>• 📤 Upload Word/PDF</li>
                  <li>• ✏️ Plak tekst direct</li>
                  <li>• 🎯 Maak varianten</li>
                  <li>• 🔢 Nieuwe getallen/data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Waarom DifferentieAssistent?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Bespaar Tijd</h4>
              <p className="text-gray-600 text-sm">
                Van uren naar minuten - maak automatisch verschillende niveaus
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Betere Resultaten</h4>
              <p className="text-gray-600 text-sm">
                Elke leerling krijgt oefeningen op het juiste niveau
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Minder Stress</h4>
              <p className="text-gray-600 text-sm">
                Focus op lesgeven, niet op eindeloos materiaal maken
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}