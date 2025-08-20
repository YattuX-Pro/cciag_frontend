import React, { useState, useMemo, useEffect, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useController, Control } from "react-hook-form";

interface SearchableSelectProps<T> {
  data: T[];
  label: string;
  valueKey: keyof T & string;
  name: string;
  control: Control<any>;
  placeholder?: string;
  rules?: Record<string, any>;
  disabled?: boolean;
  currentValue?: string | number;
  className?: string;
}

export default function SearchableSelect<T>({
  data,
  valueKey,
  label,
  name,
  control,
  placeholder = "Sélectionner une option",
  rules,
  disabled,
  currentValue,
  className,
}: SearchableSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const displayValue = useMemo(() => {
    if (!value) return placeholder;
    const selectedItem = data?.find((item) => item["id"] === value);
    if (!selectedItem) return "Sélection invalide";
    const displayedValue = selectedItem[valueKey];
    return typeof displayedValue === "string" || typeof displayedValue === "number"
      ? String(displayedValue)
      : "Valeur non affichable";
  }, [data, value, valueKey, placeholder]);

  const filteredData = useMemo(() => {
    return data?.filter((item) =>
      String(item[valueKey])?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter, valueKey]);

  useEffect(() => {
    if (currentValue) {
      onChange(currentValue);
    }
  }, [currentValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          disabled={disabled}
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex justify-between items-center border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
            error ? "border-red-500" : className || "border-border"
          }`}
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </button>
        {open && (
          <div className="absolute left-0 right-0 z-50 mt-1 bg-card shadow-lg overflow-hidden rounded-md border border-border">
            <div className="p-2">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-border rounded-md  focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y divide-border text-sm">
              {filteredData?.length ? (
                filteredData.map((item) => (
                  <li
                    key={item["id"]}
                    onClick={() => {
                      onChange(item["id"]);
                      setOpen(false);
                    }}
                    className={`flex items-center px-4 py-2 cursor-pointer hover:bg-muted transition-all ${
                      value === item["id"]
                        ? "bg-primary/90 text-primary-foreground"
                        : ""
                    }`}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === item["id"] ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {item[valueKey] as string || "Option sans nom"}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-muted-foreground">Aucune donnée trouvée.</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error.message}</span>}
    </div>
  );
}
