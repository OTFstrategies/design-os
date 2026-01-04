import { useState, useMemo } from 'react'
import { Copy, Check, Wand2 } from 'lucide-react'
import type { CoderingFormaat, DocumentNiveau, DocumentType, CodeGeneratorParams } from '@/../product/sections/schrijfstandaard-structuur/types'

interface CodeGeneratorProps {
  coderingFormaat: CoderingFormaat
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  onGenerate?: (params: CodeGeneratorParams) => void
}

export function CodeGenerator({
  coderingFormaat,
  documentNiveaus,
  documentTypes,
  onGenerate,
}: CodeGeneratorProps) {
  const [niveau, setNiveau] = useState('')
  const [type, setType] = useState('')
  const [afdeling, setAfdeling] = useState('')
  const [categorie, setCategorie] = useState('')
  const [volgnummer, setVolgnummer] = useState('001')
  const [versie, setVersie] = useState('1.0')
  const [copied, setCopied] = useState(false)

  // Filter document types based on selected niveau
  const filteredTypes = useMemo(() => {
    if (!niveau) return documentTypes
    return documentTypes.filter((t) => t.niveau === niveau)
  }, [niveau, documentTypes])

  // Generate the code
  const generatedCode = useMemo(() => {
    if (!niveau || !type || !afdeling || !categorie || !volgnummer || !versie) {
      return null
    }
    return `${niveau}_${type}_${afdeling.toUpperCase()}_${categorie.toUpperCase()}_${volgnummer}_V${versie}`
  }, [niveau, type, afdeling, categorie, volgnummer, versie])

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onGenerate?.({
        niveau,
        type,
        afdeling: afdeling.toUpperCase(),
        categorie: categorie.toUpperCase(),
        volgnummer,
        versie,
      })
    }
  }

  const isComplete = niveau && type && afdeling && categorie && volgnummer && versie

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden bg-white dark:bg-stone-900">
      {/* Header */}
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-stone-900 dark:text-stone-100">
            Code Generator
          </h3>
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Formaat: <code className="font-mono text-xs bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">{coderingFormaat.patroon}</code>
        </p>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Niveau */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Niveau
            </label>
            <select
              value={niveau}
              onChange={(e) => {
                setNiveau(e.target.value)
                setType('') // Reset type when niveau changes
              }}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            >
              <option value="">Selecteer...</option>
              {documentNiveaus.map((n) => (
                <option key={n.id} value={n.code}>
                  {n.code} - {n.naam}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!niveau}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecteer...</option>
              {filteredTypes.map((t) => (
                <option key={t.id} value={t.code}>
                  {t.code} - {t.naam}
                </option>
              ))}
            </select>
          </div>

          {/* Afdeling */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Afdeling (3 letters)
            </label>
            <input
              type="text"
              value={afdeling}
              onChange={(e) => setAfdeling(e.target.value.slice(0, 4))}
              placeholder="LOG"
              maxLength={4}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono uppercase"
            />
          </div>

          {/* Categorie */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Categorie (3-4 letters)
            </label>
            <input
              type="text"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value.slice(0, 4))}
              placeholder="HEF"
              maxLength={4}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono uppercase"
            />
          </div>

          {/* Volgnummer */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Volgnummer
            </label>
            <input
              type="text"
              value={volgnummer}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 3)
                setVolgnummer(val.padStart(3, '0'))
              }}
              placeholder="001"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono"
            />
          </div>

          {/* Versie */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
              Versie
            </label>
            <input
              type="text"
              value={versie}
              onChange={(e) => setVersie(e.target.value)}
              placeholder="1.0"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Generated code output */}
        <div className="mt-6 p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Gegenereerde code
              </span>
              <div className="mt-1">
                {generatedCode ? (
                  <code className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                    {generatedCode}
                  </code>
                ) : (
                  <span className="text-stone-400 dark:text-stone-500 italic">
                    Vul alle velden in om een code te genereren
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleCopy}
              disabled={!isComplete}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${isComplete
                  ? copied
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                }
              `}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Gekopieerd
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Kopieer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Segment reference */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {coderingFormaat.segmenten.map((segment) => (
            <div
              key={segment.naam}
              className="p-2 rounded bg-stone-50 dark:bg-stone-800/30"
            >
              <span className="font-mono font-medium text-stone-700 dark:text-stone-300">
                {segment.naam}
              </span>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                {segment.beschrijving}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
