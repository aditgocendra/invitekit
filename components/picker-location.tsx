"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapPin, Search, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Fix marker icon menggunakan CDN
const DefaultIcon = L.Icon.Default.prototype as L.Icon.Default & {
  _getIconUrl?: string;
};

delete DefaultIcon._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Types
interface Position {
  lat: number;
  lng: number;
}

interface LocationData extends Position {
  address: string;
}

interface LocationMarkerProps {
  position: Position | null;
  setPosition: (position: Position) => void;
}

interface LocationPickerProps {
  onLocationSelect?: (location: LocationData) => void;
  initialPosition?: Position | null;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Component untuk recenter map
function RecenterMap({ position }: { position: Position }) {
  const map = useMap();

  useEffect(() => {
    map.setView([position.lat, position.lng], 15);
  }, [position, map]);

  return null;
}

// Component untuk handle click pada map
function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function LocationPicker({
  onLocationSelect,
  initialPosition,
}: LocationPickerProps) {
  const [position, setPosition] = useState<Position>(
    initialPosition || { lat: -6.2088, lng: 106.8456 },
  );
  const [address, setAddress] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>("");

  // Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Reverse geocoding
  useEffect(() => {
    if (position) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "Address not found");
        })
        .catch(() => setAddress("Failed to fetch address"));
    }
  }, [position]);

  // Search location by address
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setLocationError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      );
      const data: SearchResult[] = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch {
      setLocationError("Failed to search location");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Select search result
  const selectSearchResult = (result: SearchResult) => {
    const newPosition = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
    setPosition(newPosition);
    setAddress(result.display_name);
    setSearchQuery("");
    setShowResults(false);
    setSearchResults([]);
  };

  // Get current location dari device
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPosition(newPosition);
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  const handleConfirm = () => {
    if (onLocationSelect) {
      onLocationSelect({
        lat: position.lat,
        lng: position.lng,
        address: address,
      });
    }
  };

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='relative'>
        <form
          onSubmit={handleSearchSubmit}
          className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              type='text'
              placeholder='Search location by address, street, city...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
            {isSearching && (
              <Loader2 className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400' />
            )}
          </div>
          <Button
            type='submit'
            disabled={isSearching}>
            Search
          </Button>
        </form>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className='absolute z-9999 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                onClick={() => selectSearchResult(result)}
                className='w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 transition-colors'>
                <div className='flex items-start gap-2'>
                  <MapPin className='h-4 w-4 mt-1 shrink-0 text-gray-400' />
                  <span className='text-sm'>{result.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults &&
          searchResults.length === 0 &&
          !isSearching &&
          searchQuery.length > 2 && (
            <div className='absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-4'>
              <p className='text-sm text-gray-500'>No results found</p>
            </div>
          )}
      </div>

      {/* Button untuk detect lokasi */}
      <Button
        onClick={getCurrentLocation}
        disabled={isLoadingLocation}
        variant='outline'
        className='w-full'
        type='button'>
        {isLoadingLocation ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Loading...
          </>
        ) : (
          <>
            <MapPin className='mr-2 h-4 w-4' />
            Use My Current Location
          </>
        )}
      </Button>

      {/* Error message */}
      {locationError && (
        <div className='text-sm text-red-600 bg-red-50 p-2 rounded'>
          {locationError}
        </div>
      )}

      {/* Map */}
      <div className='h-[400px] w-full rounded-lg overflow-hidden border'>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
          />
          <RecenterMap position={position} />
        </MapContainer>
      </div>

      <div className='space-y-2'>
        <div className='text-sm'>
          <strong>Coordinates:</strong> {position.lat.toFixed(6)},{" "}
          {position.lng.toFixed(6)}
        </div>
        <div className='text-sm'>
          <strong>Address:</strong> {address}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
        Confirm Location
      </button>
    </div>
  );
}
