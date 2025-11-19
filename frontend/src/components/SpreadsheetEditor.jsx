import { useEffect, useRef } from 'react'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.min.css'

export default function SpreadsheetEditor({ data, columns }) {
  const containerRef = useRef(null)
  const hotRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (hotRef.current) {
      hotRef.current.destroy()
    }

    hotRef.current = new Handsontable(containerRef.current, {
      data: data || [],
      colHeaders: columns || [],
      rowHeaders: true,
      width: '100%',
      height: 500,
      licenseKey: 'non-commercial-and-evaluation',
      contextMenu: true,
      filters: true,
      dropdownMenu: true,
      manualColumnResize: true,
      manualRowResize: true,
      stretchH: 'all'
    })

    return () => {
      if (hotRef.current) {
        hotRef.current.destroy()
      }
    }
  }, [data, columns])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">📊 Editor de Planilha</h2>
      <div ref={containerRef} />
    </div>
  )
}
