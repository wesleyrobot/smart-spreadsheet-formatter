import { useEffect, useRef } from 'react'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.min.css'

export default function SpreadsheetEditor({ data, columns }) {
  const containerRef = useRef(null)
  const hotRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (hotRef.current && !hotRef.current.isDestroyed) {
      try {
        hotRef.current.destroy()
      } catch (e) {
        console.log('Instância já destruída')
      }
      hotRef.current = null
    }

    if (containerRef.current && !hotRef.current) {
      hotRef.current = new Handsontable(containerRef.current, {
        data: data || [],
        colHeaders: columns || true,
        rowHeaders: true,
        width: '100%',
        height: 650,
        licenseKey: 'non-commercial-and-evaluation',
        contextMenu: true,
        filters: true,
        dropdownMenu: true,
        manualColumnResize: true,
        manualRowResize: true,
        stretchH: 'all',
        className: 'htDark'
      })
    }

    return () => {
      if (hotRef.current && !hotRef.current.isDestroyed) {
        try {
          hotRef.current.destroy()
          hotRef.current = null
        } catch (e) {
          console.log('Erro ao destruir:', e.message)
        }
      }
    }
  }, [data, columns])

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Editor de Planilha</h2>
      <div ref={containerRef} className="rounded-xl overflow-hidden shadow-inner" />
    </div>
  )
}
