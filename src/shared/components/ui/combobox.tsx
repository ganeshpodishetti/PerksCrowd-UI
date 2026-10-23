import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui/popover"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import * as React from "react"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  allowCustom?: boolean
  customText?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option…",
  searchPlaceholder = "Search…",
  emptyText = "No option found.",
  className,
  disabled = false,
  allowCustom = true,
  customText = "Create"
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Check if current value exists in options
  const validOptions = React.useMemo(
    () => options.filter(opt => opt.label && opt.value),
    [options],
  );
  const selectedOption = validOptions.find(option => option.value === value);
  const displayValue = selectedOption?.label || value || ""

  // Filter options based on search
  const filteredOptions = React.useMemo(
    () => validOptions.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    ),
    [validOptions, searchValue],
  );

  // Handle selection
  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  // Handle custom value creation
  const handleCreateCustom = () => {
    if (searchValue.trim() && !validOptions.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )) {
      onValueChange(searchValue.trim())
      setOpen(false)
      setSearchValue("")
    }
  }

  // Show create option when search value doesn't match any existing option
  const showCreateOption = allowCustom && 
    searchValue.trim() && 
    !validOptions.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )

  // Handle Enter key for creating custom values
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (showCreateOption) {
        handleCreateCustom()
      } else if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value)
      } else if (allowCustom && searchValue.trim()) {
        onValueChange(searchValue.trim())
        setOpen(false)
        setSearchValue("")
      }
    }
  }

  // Handle open change
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // When closing, if there's a search value and allowCustom is true, create it
      if (allowCustom && searchValue.trim() && !validOptions.some(option => 
        option.label.toLowerCase() === searchValue.toLowerCase()
      )) {
        onValueChange(searchValue.trim())
      }
      setSearchValue("")
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "w-full justify-between h-10 px-3 py-2 border border-neutral-200 dark:border-neutral-700",
            "bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800",
            "focus:ring-2 focus:ring-brand-500 focus:ring-offset-0",
            "transition-colors duration-200",
            !value && "text-neutral-500 dark:text-neutral-400",
            value && "text-neutral-900 dark:text-neutral-100",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate text-left">
            {displayValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] max-w-[400px] p-0 z-[9999] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl rounded-lg" 
        align="start" 
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <div className="flex flex-col rounded-lg overflow-hidden">
          <div className="px-3 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-0 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              autoFocus
            />
          </div>
          
          <div className="max-h-[240px] overflow-y-auto bg-white dark:bg-neutral-900 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm cursor-pointer transition-colors mx-1 rounded-md",
                      "hover:bg-brand-100 dark:hover:bg-brand-900/50 text-neutral-900 dark:text-neutral-100",
                      "focus:bg-brand-100 dark:focus:bg-brand-900/50 outline-none",
                      value === option.value && "bg-brand-100 dark:bg-brand-900/70 text-brand-900 dark:text-brand-100"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4",
                        value === option.value ? "opacity-100 text-brand-700 dark:text-brand-300" : "opacity-0"
                      )}
                    />
                    <span className="truncate font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            ) : searchValue.trim() ? (
              allowCustom ? null : (
                <div className="px-3 py-6 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  {emptyText}
                </div>
              )
            ) : (
              <div className="px-3 py-6 text-sm text-neutral-500 dark:text-neutral-400 text-center">
                {emptyText}
              </div>
            )}
            
            {showCreateOption && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-1 pb-1">
                <button
                  type="button"
                  onClick={handleCreateCustom}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm cursor-pointer transition-colors mx-1 rounded-md",
                    "text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/30",
                    "hover:bg-brand-100 dark:hover:bg-brand-900/50 font-medium"
                  )}
                >
                  <Plus className="mr-3 h-4 w-4" />
                  <span className="truncate">{customText} &quot;{searchValue}&quot;</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
