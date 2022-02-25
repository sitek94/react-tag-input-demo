import * as React from 'react'

interface RemoveButtonProps {
  onRemove: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  className: string
  index: number
  ariaLabel: string
}

const crossStr = String.fromCharCode(215)

/**
 * ⚠️
 *
 * When passing this component to `removeComponent` prop of `ReactTags`, TypeScript will
 * complain, but that's because the types are incorrect there.
 *
 * This is fine, and it works, as long as this component will match the expected shape.
 * Before making changes to this component please check its original implementation first, source:
 *
 * https://github.com/react-tags/react-tags/blob/4cd4f6519a51b3d0b17b40ccf5d12ff85e9d24e6/src/components/RemoveComponent.js#L25
 */
export function RemoveButton({
  onRemove,
  onKeyDown,
  className,
  ariaLabel,
}: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      onKeyDown={onKeyDown}
      className={className}
      aria-label={ariaLabel}
    >
      {crossStr}
    </button>
  )
}
