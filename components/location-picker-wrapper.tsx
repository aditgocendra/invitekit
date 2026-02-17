"use client";

import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("./picker-location"), {
  ssr: false,
  loading: () => (
    <div className='h-[400px] w-full flex items-center justify-center bg-gray-100 rounded-lg'>
      <p>Loading map...</p>
    </div>
  ),
});

export default LocationPicker;
