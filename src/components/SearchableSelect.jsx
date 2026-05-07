import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export function SearchableSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Pilih...", 
  label,
  required = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-1 relative" ref={wrapperRef}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg flex justify-between items-center cursor-pointer hover:border-amber-500 transition-colors ${isOpen ? 'ring-2 ring-amber-500 border-amber-500' : ''}`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
            <Search size={16} className="text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Cari instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-1 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-slate-200 rounded-full">
                <X size={14} className="text-slate-500" />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === option ? 'bg-amber-50 text-amber-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                Tidak ditemukan hasil untuk "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
