import * as React from 'react'
import { Tag, WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

interface TagInputProps {
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  input: string
  onInputChange: (input: string) => void
  allowDuplicates?: boolean
}

export function TagsInput({
  tags,
  onTagsChange,
  input,
  onInputChange,
  allowDuplicates = false,
}: TagInputProps) {
  const handleDelete = (i: number) => {
    onTagsChange(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag: Tag) => {
    // Prevent empty tags
    if (!input) {
      return
    }
    // Prevent adding duplicate tags
    if (!allowDuplicates && tags.find(t => t.text === input)) {
      return
    }
    onTagsChange([...tags, tag])
    onInputChange('')
  }

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    onTagsChange(newTags)
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
          suggestions={[]}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          inputValue={input}
          handleInputChange={onInputChange}
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
          type="button"
          onClick={handleAddClick}
          className="absolute right-1.5 -mt-[38px] rounded-lg bg-blue-500 p-2 text-xs text-white"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export function createTags(suggestions: string[]): Tag[] {
  return suggestions.map(createTag)
}

function createTag(suggestion: string): Tag {
  return {
    id: suggestion,
    text: suggestion,
  }
}
