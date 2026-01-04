import { useState } from 'react'
import { Upload, Mic, Image, MapPin, Tag, Play, ChevronRight, ChevronLeft, Copy, Check, Info, X } from 'lucide-react'
import type { Categorie, PlaudPromptTemplate, NieuweRunParams } from '@/../product/sections/ai-agents/types'

interface NieuweRunTabProps {
  categorieen: Categorie[]
  plaudPromptTemplate: PlaudPromptTemplate
  onStartRun?: (params: NieuweRunParams) => void
}

type WizardStep = 1 | 2 | 3 | 4

export function NieuweRunTab({ categorieen, plaudPromptTemplate, onStartRun }: NieuweRunTabProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [titel, setTitel] = useState('')
  const [categorie, setCategorie] = useState('')
  const [locatie, setLocatie] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [fotos, setFotos] = useState<File[]>([])
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const steps = [
    { num: 1, label: 'Audio', icon: <Mic className="w-4 h-4" /> },
    { num: 2, label: "Foto's", icon: <Image className="w-4 h-4" /> },
    { num: 3, label: 'Metadata', icon: <Tag className="w-4 h-4" /> },
    { num: 4, label: 'Review', icon: <Play className="w-4 h-4" /> },
  ]

  const canProceed = () => {
    switch (currentStep) {
      case 1: return audioFile !== null
      case 2: return true // Photos are optional
      case 3: return titel.trim() !== '' && categorie !== '' && locatie.trim() !== ''
      case 4: return true
      default: return false
    }
  }

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(plaudPromptTemplate.template)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleStartRun = () => {
    if (audioFile) {
      onStartRun?.({
        titel,
        categorie,
        locatie,
        audioFile,
        fotos,
      })
    }
  }

  const handleRemoveFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6">
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.num} className="flex items-center">
                <button
                  onClick={() => step.num < currentStep && setCurrentStep(step.num as WizardStep)}
                  disabled={step.num > currentStep}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all
                    ${currentStep === step.num
                      ? 'bg-amber-500 text-white'
                      : step.num < currentStep
                        ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-800'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                    }
                  `}
                >
                  {step.icon}
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-1 ${step.num < currentStep ? 'bg-amber-300 dark:bg-amber-700' : 'bg-stone-200 dark:bg-stone-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
          {currentStep === 1 && (
            <Step1Audio
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              plaudPromptTemplate={plaudPromptTemplate}
              copiedPrompt={copiedPrompt}
              onCopyPrompt={handleCopyPrompt}
            />
          )}

          {currentStep === 2 && (
            <Step2Fotos
              fotos={fotos}
              setFotos={setFotos}
              onRemove={handleRemoveFoto}
            />
          )}

          {currentStep === 3 && (
            <Step3Metadata
              titel={titel}
              setTitel={setTitel}
              categorie={categorie}
              setCategorie={setCategorie}
              locatie={locatie}
              setLocatie={setLocatie}
              categorieen={categorieen}
            />
          )}

          {currentStep === 4 && (
            <Step4Review
              titel={titel}
              categorie={categorie}
              locatie={locatie}
              audioFile={audioFile}
              fotos={fotos}
              categorieen={categorieen}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentStep(prev => (prev - 1) as WizardStep)}
            disabled={currentStep === 1}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${currentStep === 1
                ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            Vorige
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(prev => (prev + 1) as WizardStep)}
              disabled={!canProceed()}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors
                ${canProceed()
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                }
              `}
            >
              Volgende
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStartRun}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Play className="w-4 h-4" />
              Pipeline starten
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface Step1Props {
  audioFile: File | null
  setAudioFile: (file: File | null) => void
  plaudPromptTemplate: PlaudPromptTemplate
  copiedPrompt: boolean
  onCopyPrompt: () => void
}

function Step1Audio({ audioFile, setAudioFile, plaudPromptTemplate, copiedPrompt, onCopyPrompt }: Step1Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAudioFile(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Plaud-opname uploaden</h2>
        <p className="text-stone-600 dark:text-stone-400">Upload de audio-opname van je procedure-beschrijving.</p>
      </div>

      {/* Plaud prompt template */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Plaud Prompt Template</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Gebruik deze prompt bij het maken van je opname voor optimale resultaten:
            </p>
            <pre className="text-xs bg-white dark:bg-stone-900 rounded-lg p-3 overflow-x-auto text-stone-700 dark:text-stone-300 whitespace-pre-wrap border border-amber-200 dark:border-amber-800">
              {plaudPromptTemplate.template}
            </pre>
            <button
              onClick={onCopyPrompt}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-lg transition-colors"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4" />
                  Gekopieerd!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopieer prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upload area */}
      <label className={`
        relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all
        ${audioFile
          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950'
          : 'border-stone-300 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-stone-50 dark:hover:bg-stone-800'
        }
      `}>
        <input
          type="file"
          accept="audio/*,.m4a,.mp3,.wav"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {audioFile ? (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <Mic className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="font-medium text-stone-900 dark:text-stone-100">{audioFile.name}</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {(audioFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <Upload className="w-6 h-6 text-stone-400" />
            </div>
            <p className="font-medium text-stone-900 dark:text-stone-100">Sleep je audio-bestand hierheen</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">of klik om te bladeren</p>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-2">M4A, MP3, WAV ondersteund</p>
          </div>
        )}
      </label>
    </div>
  )
}

interface Step2Props {
  fotos: File[]
  setFotos: (files: File[]) => void
  onRemove: (index: number) => void
}

function Step2Fotos({ fotos, setFotos, onRemove }: Step2Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFotos([...fotos, ...files])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Foto's uploaden</h2>
        <p className="text-stone-600 dark:text-stone-400">
          Voeg foto's toe van apparatuur, locaties of materialen. Dit helpt de AI bij het herkennen en taggen.
        </p>
      </div>

      {/* Photo grid */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {fotos.map((foto, index) => (
            <div key={index} className="relative group aspect-square bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(foto)}
                alt={foto.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-xs text-white truncate">{foto.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl cursor-pointer hover:border-amber-400 dark:hover:border-amber-600 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <Image className="w-6 h-6 text-stone-400" />
          </div>
          <p className="font-medium text-stone-900 dark:text-stone-100">
            {fotos.length > 0 ? 'Meer foto\'s toevoegen' : 'Sleep foto\'s hierheen'}
          </p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">of klik om te bladeren</p>
        </div>
      </label>

      {fotos.length === 0 && (
        <p className="text-sm text-stone-500 dark:text-stone-400 text-center">
          Foto's zijn optioneel maar helpen bij betere resultaten
        </p>
      )}
    </div>
  )
}

interface Step3Props {
  titel: string
  setTitel: (v: string) => void
  categorie: string
  setCategorie: (v: string) => void
  locatie: string
  setLocatie: (v: string) => void
  categorieen: Categorie[]
}

function Step3Metadata({ titel, setTitel, categorie, setCategorie, locatie, setLocatie, categorieen }: Step3Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Metadata invoeren</h2>
        <p className="text-stone-600 dark:text-stone-400">Geef de procedure een titel en selecteer de categorie en locatie.</p>
      </div>

      <div className="space-y-4">
        {/* Titel */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            placeholder="Bijv. Heftruckinspectie dagelijkse controle"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          />
        </div>

        {/* Categorie */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Categorie <span className="text-red-500">*</span>
          </label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
          >
            <option value="">Selecteer een categorie</option>
            {categorieen.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.code} — {cat.naam}
              </option>
            ))}
          </select>
        </div>

        {/* Locatie */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
            Locatie <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={locatie}
              onChange={(e) => setLocatie(e.target.value)}
              placeholder="Bijv. Warehouse A, Koelcel 3"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface Step4Props {
  titel: string
  categorie: string
  locatie: string
  audioFile: File | null
  fotos: File[]
  categorieen: Categorie[]
}

function Step4Review({ titel, categorie, locatie, audioFile, fotos, categorieen }: Step4Props) {
  const categorieNaam = categorieen.find(c => c.code === categorie)?.naam || categorie

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">Review & Start</h2>
        <p className="text-stone-600 dark:text-stone-400">Controleer de gegevens en start de pipeline.</p>
      </div>

      <div className="space-y-4">
        <ReviewItem label="Titel" value={titel} />
        <ReviewItem label="Categorie" value={`${categorie} — ${categorieNaam}`} />
        <ReviewItem label="Locatie" value={locatie} />
        <ReviewItem label="Audio" value={audioFile?.name || '-'} subValue={audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : undefined} />
        <ReviewItem label="Foto's" value={`${fotos.length} bestand${fotos.length !== 1 ? 'en' : ''}`} />
      </div>

      {fotos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {fotos.slice(0, 6).map((foto, i) => (
            <img
              key={i}
              src={URL.createObjectURL(foto)}
              alt={foto.name}
              className="w-16 h-16 object-cover rounded-lg border border-stone-200 dark:border-stone-700"
            />
          ))}
          {fotos.length > 6 && (
            <div className="w-16 h-16 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-sm font-medium text-stone-500">
              +{fotos.length - 6}
            </div>
          )}
        </div>
      )}

      <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-emerald-900 dark:text-emerald-100">Klaar om te starten</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              De pipeline verwerkt je opname door 7 AI-agents. Dit duurt gemiddeld 2-3 minuten.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewItem({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-stone-100 dark:border-stone-800 last:border-0">
      <span className="text-sm text-stone-500 dark:text-stone-400">{label}</span>
      <div className="text-right">
        <span className="text-sm font-medium text-stone-900 dark:text-stone-100">{value}</span>
        {subValue && <span className="block text-xs text-stone-500 dark:text-stone-400">{subValue}</span>}
      </div>
    </div>
  )
}
