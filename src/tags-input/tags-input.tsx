import * as React from 'react'
import { Tag, WithContext as ReactTags } from 'react-tag-input'
import { SearchIcon } from '@heroicons/react/outline'
import { renderSuggestion } from 'tags-input/render-suggestion'

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

interface TagInputProps {
  tags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  inputValue: string
  onInputChange: (input: string) => void
  allowDuplicates?: boolean
  suggestions?: string[]
}

export function TagsInput({
  tags,
  onTagsChange,
  inputValue,
  onInputChange,
  allowDuplicates = false,
  suggestions = [],
}: TagInputProps) {
  const handleDelete = (i: number) => {
    onTagsChange(tags.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag: Tag) => {
    // Prevent empty tags
    if (!inputValue) {
      return
    }
    // Prevent adding duplicate tags
    if (!allowDuplicates && tags.find(t => t.text === inputValue)) {
      return
    }
    onTagsChange([...tags, tag])
    onInputChange('')
  }

  // It's not really a good idea to test drag'n'drop functionality in `jsdom` environment.
  // Also, `react-tag-input` is doing heavy lifting here, so we don't need to include this
  // handler in test coverage.
  // istanbul ignore next
  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    onTagsChange(newTags)
  }

  const handleAddClick = () => {
    handleAddition({
      id: inputValue,
      text: inputValue,
    })
  }

  return (
    <div className="not-prose max-w-sm">
      <div className="relative">
        <ReactTags
          tags={tags}
          suggestions={createTags(suggestions)}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          inputValue={inputValue}
          handleInputChange={onInputChange}
          inputFieldPosition="bottom"
          renderSuggestion={renderSuggestion}
          classNames={{
            tags: 'w-full',
            selected: 'flex flex-wrap gap-2 mb-2',
            tag: 'inline-flex items-center gap-2 p-2 bg-gray-200 rounded-lg',
            tagInputField:
              'border-gray-500 border-2 rounded-lg py-2 pl-7 pr-12 w-full',
            suggestions:
              'z-50 absolute mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg',
            suggestionsList: 'max-h-64 overflow-y-auto',
            suggestionsListItem:
              'cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100',
          }}
        />
        <SearchIcon className="absolute left-1.5 -mt-8 h-5 w-5 text-gray-500" />
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
