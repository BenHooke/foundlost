import { useState, type FormEvent } from 'react'
import { createFoundItem, createLostItem } from '../api/listings'
import { CATEGORY_OPTIONS } from '../data/categoryStyles'
import type { ListingCategory, ListingType } from '../types/listing'

interface NewPostFormProps {
  type: ListingType
  pins: [number, number][]
  pinsNeeded: number
  onCancel: () => void
  onSubmitted: () => void
}

const PIN_INSTRUCTIONS: Record<ListingType, string[]> = {
  found: ['Click the map to drop a pin where you found it.'],
  lost: [
    'Click the map to drop a pin where you last had it.',
    'Now click again for where you realized it was missing.',
  ],
}

export function NewPostForm({ type, pins, pinsNeeded, onCancel, onSubmitted }: NewPostFormProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ListingCategory>('other')
  const [description, setDescription] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pinsComplete = pins.length >= pinsNeeded
  const instruction = PIN_INSTRUCTIONS[type][Math.min(pins.length, pinsNeeded - 1)]
  const canSubmit = pinsComplete && name.trim() && description.trim() && contactInfo.trim() && !submitting

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    setError(null)

    try {
      if (type === 'lost') {
        await createLostItem({
          name,
          category,
          description,
          contact_info: contactInfo,
          last_had_location: { type: 'Point', coordinates: pins[0] },
          realized_location: { type: 'Point', coordinates: pins[1] },
        })
      } else {
        await createFoundItem({
          name,
          category,
          description,
          contact_info: contactInfo,
          found_location: { type: 'Point', coordinates: pins[0] },
        })
      }
      onSubmitted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 2,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        padding: 16,
        width: 280,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
      }}
    >
      <h3 style={{ margin: '0 0 10px', fontSize: 16 }}>
        {type === 'lost' ? 'Report a lost item' : 'Report a found item'}
      </h3>

      {!pinsComplete && (
        <p style={{ margin: '0 0 10px', padding: 8, background: '#fff3cd', borderRadius: 4 }}>{instruction}</p>
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Item name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory)}
            style={{ width: '100%', boxSizing: 'border-box', marginTop: 4 }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', boxSizing: 'border-box', marginTop: 4, resize: 'vertical' }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Contact info (email or phone)
          <input
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', marginTop: 4 }}
          />
        </label>

        {error && <p style={{ color: '#d32f2f', margin: '0 0 8px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onCancel} style={{ flex: 1, padding: '8px 0' }}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              flex: 1,
              padding: '8px 0',
              background: canSubmit ? '#d32f2f' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}
