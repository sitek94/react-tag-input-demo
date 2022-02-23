import * as React from 'react'
import { Tag, WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

interface TagInputProps {
  suggestions: string[]
  selected: string[]
}

export function TagsInput({ selected, suggestions }: TagInputProps) {
  const selectedTags = createTags(selected)
  const suggestionsTags = createTags(suggestions)

  const [tags, setTags] = React.useState(selectedTags)
  const [input, setInput] = React.useState('')

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag: Tag) => {
    // Prevent empty tags
    if (!input) {
      return
    }
    setTags([...tags, tag])
    setInput('')
  }

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    setTags(newTags)
  }

  const handleAddClick = () => {
    handleAddition({
      id: input,
      text: input,
    })
  }

  return (
    <div className="mx-auto mt-12 max-w-sm">
      <div className="relative">
        <ReactTags
          tags={tags}
          suggestions={suggestionsTags}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          inputValue={input}
          handleInputChange={setInput}
          inputFieldPosition="bottom"
          classNames={{
            tags: 'w-full',
            selected: 'flex flex-wrap gap-2 mb-2',
            tag: 'inline-flex items-center gap-2 p-2 bg-gray-200 rounded-lg',
            tagInputField:
              'border-gray-500 border-2 rounded-lg px-4 py-2 w-full',
            // ⚠️ Suggestions are styled in `index.css`, so don't use `suggestions` prop,
            // because it will overwrite existing styles.
            // suggestions <- Don't use it!
            // renderSuggestion
          }}
        />
        <button
          onClick={handleAddClick}
          className="absolute right-1.5 -mt-[38px] rounded-lg bg-blue-500 p-2 text-xs text-white"
        >
          Add
        </button>
      </div>
    </div>
  )
}

function createTags(suggestions: string[]): Tag[] {
  return suggestions.map(suggestion => ({
    id: suggestion,
    text: suggestion,
  }))
}
