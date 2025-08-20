"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Item {
  id?: string | number;
  name?: string;
  [key: string]: any;
}

interface MultiSelectInputProps {
  name: string;
  control: Control<any>;
  label: string;
  data: Item[];
  valueKey: string;
  placeholder: string;
  currentValue?: string;
  disabled?: boolean;
  rules?: Record<string, any>;
  className?: string;
}

export default function MultiSelectInput({
  name,
  control,
  label,
  data,
  valueKey,
  placeholder,
  currentValue = "",
  disabled = false,
  rules = {},
  className = "",
}: MultiSelectInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Parse current value on component mount
  useEffect(() => {
    if (currentValue) {
      try {
        const parsedValues = JSON.parse(currentValue);
        if (Array.isArray(parsedValues) && parsedValues.length > 0) {
          const items = data.filter(item => 
            parsedValues.includes(item[valueKey])
          );
          setSelectedItems(items);
        }
      } catch (e) {
        console.error("Error parsing currentValue:", e);
      }
    }
  }, [currentValue, data, valueKey]);

  // Filter data based on search term
  const filteredData = data
    .filter(item => 
      !selectedItems.some(selected => selected[valueKey] === item[valueKey]) && 
      item[valueKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelect = (item: Item, onChange: (value: string) => void) => {
    const updatedItems = [...selectedItems, item];
    setSelectedItems(updatedItems);
    setSearchTerm("");
    
    // Convert to JSON string for form storage
    const itemValues = updatedItems.map(i => i[valueKey]);
    onChange(JSON.stringify(itemValues));
  };

  const handleRemove = (item: Item, onChange: (value: string) => void) => {
    const updatedItems = selectedItems.filter(
      selected => selected[valueKey] !== item[valueKey]
    );
    setSelectedItems(updatedItems);
    
    // Convert to JSON string for form storage
    const itemValues = updatedItems.map(i => i[valueKey]);
    onChange(JSON.stringify(itemValues));
  };

  // Close dropdown when clicking outside
  // Reset highlighted index when filtered data changes
  useEffect(() => {
    setHighlightedIndex(-1);
    listItemsRef.current = listItemsRef.current.slice(0, filteredData.length);
  }, [filteredData.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, onChange: (value: string) => void) => {
    if (!isFocused) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const newIndex = prevIndex < filteredData.length - 1 ? prevIndex + 1 : 0;
          scrollIntoView(newIndex);
          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prevIndex => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : filteredData.length - 1;
          scrollIntoView(newIndex);
          return newIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredData.length) {
          handleSelect(filteredData[highlightedIndex], onChange);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsFocused(false);
        break;
    }
  };

  // Scroll item into view when navigating with keyboard
  const scrollIntoView = (index: number) => {
    if (index >= 0 && listItemsRef.current[index]) {
      listItemsRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className="relative w-full" ref={dropdownRef}>
          {/* Selected items */}
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedItems.map((item) => (
              <Badge
                key={item[valueKey]}
                variant="outline"
                className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100 flex items-center gap-1 py-1 px-2"
              >
                {item[valueKey]}
                <X
                  size={14}
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => handleRemove(item, field.onChange)}
                />
              </Badge>
            ))}
          </div>
          
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => handleKeyDown(e, field.onChange)}
            placeholder={selectedItems.length === 0 ? placeholder : "Ajouter un autre élément..."}
            className={`${className} ${
              fieldState.error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            disabled={disabled}
            aria-autocomplete="list"
            aria-expanded={isFocused}
            role="combobox"
          />
          
          {/* Dropdown menu avec recherche et défilement */}
          {isFocused && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredData.length > 0 ? (
                <>
                  {filteredData.length > 10 && (
                    <div className="sticky top-0 bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                      {filteredData.length} éléments trouvés
                    </div>
                  )}
                  {filteredData.map((item, index) => (
                    <div
                      key={item[valueKey]}
                      ref={(el) => { listItemsRef.current[index] = el; }}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                        index === highlightedIndex 
                          ? 'bg-cyan-100 dark:bg-cyan-900' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleSelect(item, field.onChange)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={index === highlightedIndex}
                    >
                      <span className="truncate">{item[valueKey]}</span>
                    </div>
                  ))}
                </>
              ) : searchTerm ? (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  Aucun résultat pour "{searchTerm}"
                </div>
              ) : (
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  Aucun élément disponible
                </div>
              )}
            </div>
          )}
          
          {fieldState.error && (
            <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
