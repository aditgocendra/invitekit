"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import LocationPickerWrapper from "../location-picker-wrapper";
import { LocateFixed } from "lucide-react";

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface DialogPickerLocationProps {
  onLocationSelect: (location: LocationData) => void;
  initialPosition?: { lat: number; lng: number } | null;
  triggerLabel?: string;
  triggerClassName?: string;
}

export default function DialogPickerLocation({
  onLocationSelect,
  initialPosition = null,
  triggerLabel = "Setup Location",
  triggerClassName = "w-full",
}: DialogPickerLocationProps) {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialPosition);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    onLocationSelect(location); // Pass ke parent component
    setShowLocationPicker(false);
  };

  return (
    <Dialog
      open={showLocationPicker}
      onOpenChange={setShowLocationPicker}>
      <DialogTrigger asChild>
        <Button
          className={triggerClassName}
          type='button'>
          <LocateFixed />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent
        className='sm:max-w-[725px] max-h-[90vh]'
        showCloseButton={false}>
        <DialogTitle hidden>Set Location</DialogTitle>
        <LocationPickerWrapper
          onLocationSelect={handleLocationSelect}
          initialPosition={selectedLocation}
        />
        <DialogFooter>
          <Button
            className='w-full'
            onClick={() => setShowLocationPicker(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
