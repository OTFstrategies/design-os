'use client'

import type { HierarchieBrowserProps, HierarchieNode, DocumentNiveau } from './types'

export function HierarchieBrowserTab({
  hierarchie,
  onToggleNode,
  onSelectNode,
  onOpenMiro,
}: HierarchieBrowserProps) {
  return (
    <div className="p-6">
      {/* Legend */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4 mb-6">
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
          Proceshuis Hiërarchie
        </h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <NiveauLegendItem niveau="N1" label="Waardeketen" description="Context (niet bewerkbaar)" />
          <NiveauLegendItem niveau="N2" label="Bedrijfsproces" description="Swimlane → MIRO" />
          <NiveauLegendItem niveau="N3" label="Werkproces" description="Swimlane → MIRO" />
          <NiveauLegendItem niveau="N4" label="Werkinstructie" description="WAT - kernfocus" />
          <NiveauLegendItem niveau="N5" label="Instructie" description="HOE - kernfocus" />
        </div>
      </div>

      {/* Tree view */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
        <div className="p-4 border-b border-stone-200 dark:border-stone-700">
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Structuur Navigator
          </h3>
        </div>
        <div className="p-2">
          {hierarchie.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              onToggle={onToggleNode}
              onSelect={onSelectNode}
              onOpenMiro={onOpenMiro}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface NiveauLegendItemProps {
  niveau: DocumentNiveau
  label: string
  description: string
}

function NiveauLegendItem({ niveau, label, description }: NiveauLegendItemProps) {
  const colors: Record<DocumentNiveau, string> = {
    N1: 'bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-stone-200',
    N2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    N3: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    N4: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    N5: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono font-bold px-2 py-0.5 rounded ${colors[niveau]}`}>
        {niveau}
      </span>
      <span className="text-stone-600 dark:text-stone-300">{label}</span>
      <span className="text-stone-400">({description})</span>
    </div>
  )
}

interface TreeNodeProps {
  node: HierarchieNode
  depth: number
  onToggle?: (nodeId: string) => void
  onSelect?: (nodeId: string) => void
  onOpenMiro?: (url: string) => void
}

function TreeNode({ node, depth, onToggle, onSelect, onOpenMiro }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const hasMiroLink = node.miroLink && (node.niveau === 'N2' || node.niveau === 'N3')
  const isEditable = node.niveau === 'N4' || node.niveau === 'N5'

  const niveauColors: Record<DocumentNiveau, { bg: string; text: string; border: string }> = {
    N1: {
      bg: 'bg-stone-100 dark:bg-stone-700/50',
      text: 'text-stone-600 dark:text-stone-300',
      border: 'border-stone-300 dark:border-stone-600',
    },
    N2: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    N3: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-700 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
    },
    N4: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
    N5: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
  }

  const colors = niveauColors[node.niveau]

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
          hover:bg-stone-100 dark:hover:bg-stone-700/50
          ${depth > 0 ? 'ml-6' : ''}
        `}
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : undefined }}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => onToggle?.(node.id)}
            className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${node.expanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <span className="w-5 h-5 flex items-center justify-center text-stone-300 dark:text-stone-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
        )}

        {/* Niveau badge */}
        <span
          className={`
            font-mono text-xs font-bold px-1.5 py-0.5 rounded
            ${colors.bg} ${colors.text}
          `}
        >
          {node.niveau}
        </span>

        {/* Node content */}
        <button
          onClick={() => onSelect?.(node.id)}
          className={`
            flex-1 text-left text-sm font-medium transition-colors
            ${isEditable ? 'text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400' : 'text-stone-600 dark:text-stone-400'}
          `}
        >
          <span className="font-mono text-xs text-stone-400 mr-2">{node.code}</span>
          {node.titel}
        </button>

        {/* Document count */}
        {node.documentCount !== undefined && node.documentCount > 0 && (
          <span className="text-xs bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full">
            {node.documentCount} docs
          </span>
        )}

        {/* MIRO link */}
        {hasMiroLink && (
          <button
            onClick={() => onOpenMiro?.(node.miroLink!)}
            className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
            title="Open in MIRO"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            MIRO
          </button>
        )}

        {/* Edit indicator for N4/N5 */}
        {isEditable && (
          <span className="text-xs text-amber-500 dark:text-amber-400" title="Bewerkbaar document">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && node.expanded && (
        <div className="relative">
          {/* Vertical connection line */}
          <div
            className="absolute left-[30px] top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-700"
            style={{ left: `${(depth + 1) * 24 + 10}px` }}
          />
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              onOpenMiro={onOpenMiro}
            />
          ))}
        </div>
      )}
    </div>
  )
}
