/* components/searchbars/ClientSearch.tsx */

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { MdArrowBackIosNew } from "react-icons/md";
import Tag from "@/components/tag/Tag";
import { formatCurrency } from "@/utils/formatCurrency";
import { SearchEvent } from "@/types/searchevent";
import "./Searchbar.css";

type SearchbarProps = {
  isMobileSearchOpen: boolean;
  onCloseMobileSearch: () => void;
};

export default function Searchbar({ isMobileSearchOpen, onCloseMobileSearch }: SearchbarProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [dbEvents, setDbEvents] = useState<SearchEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/Events/active");
        if (res.ok) {
          const data = await res.json();
          setDbEvents(data);
        }
      } catch (error) {
        console.error("Falha ao carregar buscas:", error);
      }
    }
    loadEvents();
  }, []);

  /* FILTER EVENTS BASED ON SEARCH - USANDO useMemo */
  const filteredEvents = useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }
    
    return dbEvents.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dbEvents]);

  /* DETERMINE IF SHOULD SHOW RESULTS */
  const showResults = searchTerm.trim() !== "" && isInputFocused;

  /* CLOSE RESULTS WHEN CLICKING OUTSIDE */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      };
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* HANDLE EVENT SELECTION */
  const handleEventClick = (eventId: string) => {
    setSearchTerm("");
    setIsInputFocused(false);
    onCloseMobileSearch();
    router.push(`/client/events/${eventId}`);
  };

  /* HANDLE SEARCH INPUT CHANGE */
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!isInputFocused) {
      setIsInputFocused(true);
    }
  };

  /* MOBILE SEARCHBAR */
  if (isMobileSearchOpen) {
    return (
      <div className="mobile-active">
        {/* CLOSE BUTTON */}
        <button onClick={onCloseMobileSearch} className="back-button">
          <MdArrowBackIosNew className="back-icon"/>
        </button>
        
        {/* SEARCH INPUT MOBILE */}
        <div className="search-mobile" ref={searchRef}>
          <IoSearch className="search-icon-mobile"/>
          <input 
            type="text" 
            placeholder="Pesquisar"
            className="input pl-8 pr-2"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            autoFocus
          />

          {/* SEARCH RESULTS POPUP - MOBILE */}
          {showResults && (
            <div className="search-results-popup mobile-popup">
              {filteredEvents.length > 0 ? (
                <>
                  <div className="search-results-header">
                    {filteredEvents.length} {filteredEvents.length === 1 ? "resultado encontrado" : "resultados encontrados"}
                  </div>
                  {filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleEventClick(event.id)}
                      className="search-result-item"
                    >
                      <div className="result-image-container">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="result-image"
                        />
                      </div>
                      <div className="result-info">
                        <div className="result-header">
                          <h3 className="result-title">{event.title}</h3>
                          <Tag tag={event.tag} />
                        </div>
                        <p className="result-price">{formatCurrency(event.cashPrice)}</p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="search-no-results">
                  Nenhum evento encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* DESKTOP SEARCHBAR */
  return (
    <div className="search-desktop" ref={searchRef}>
      <IoSearch className="icon-desktop"/>
      <input 
        type="text" 
        placeholder="Pesquisar"
        className="input pl-8 pr-2"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        onFocus={() => setIsInputFocused(true)}
      />

      {/* SEARCH RESULTS POPUP - DESKTOP */}
      {showResults && (
        <div className="search-results-popup desktop-popup">
          {filteredEvents.length > 0 ? (
            <>
              <div className="search-results-header">
                {filteredEvents.length} {filteredEvents.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </div>
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="search-result-item"
                >
                  <div className="result-image-container">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="result-image"
                    />
                  </div>
                  <div className="result-info">
                    <div className="result-header">
                      <h3 className="result-title">{event.title}</h3>
                      <Tag tag={event.tag} />
                    </div>
                    <p className="result-price">{formatCurrency(event.cashPrice)}</p>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="search-no-results">
              Nenhum evento encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};