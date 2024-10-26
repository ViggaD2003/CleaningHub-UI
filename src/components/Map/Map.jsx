import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMapGL, { Marker, GeolocateControl } from "react-map-gl";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWluaGh1eTI0MTEiLCJhIjoiY20yYTc1cHRqMDl6azJuczk1ejNmb2RueSJ9.CKdZs3r2gSbrPwUpgb9Ocw";

// eslint-disable-next-line react/prop-types
const Mapbox = ({ onSelectedAddress }) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "90vh",
    latitude: 10.80139886141051,
    longitude: 106.62771841014414,
    zoom: 16,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [presentLocation, setPresentLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);
  };

  const fetchAddressFromCoordinates = async (longitude, latitude) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
      );
      if (response.data.features.length > 0) {
        const fetchedAddress = response.data.features[0].place_name;
        setPresentLocation(fetchedAddress);
        setSearchQuery(fetchedAddress);
        if (onSelectedAddress) {
          onSelectedAddress({
            latitude: latitude,
            longitude: longitude,
            address: fetchedAddress,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching address from coordinates:", error);
    }
  };

  const handleMapClick = async (event) => {
    const [longitude, latitude] = event.lngLat;
    setSelectedLocation({ longitude, latitude });
    fetchAddressFromCoordinates(longitude, latitude);
  };

  const handleGeolocate = (event) => {
    const { longitude, latitude } = event.coords;
    setViewport((prev) => ({
      ...prev,
      longitude,
      latitude,
      zoom: 16,
    }));
  };

  const handleGeolocateError = (error) => {
    console.error("Geolocate error:", error);
  };

  useEffect(() => {
    if (searchQuery.length == 0 && presentLocation) {
      setPresentLocation("");
      setSelectedLocation(null);
      return;
    }

    if (searchQuery && presentLocation && selectedLocation) {
      return;
    }

    if (searchQuery) {
      const delayDebounceFn = setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              searchQuery
            )}.json?access_token=${MAPBOX_TOKEN}&proximity=106.62771841014414,10.80139886141051`
          );
          if (response.data.features.length > 0) {
            setSearchResults(response.data.features);
            setIsDropdownVisible(true);
          } else {
            setIsDropdownVisible(false);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  }, [presentLocation, searchQuery, selectedLocation]);

  const handleResultClick = (result) => {
    const { center, place_name } = result;
    setViewport((prev) => ({
      ...prev,
      longitude: center[0],
      latitude: center[1],
      zoom: 16,
    }));
    setSearchQuery(place_name);
    setPresentLocation(place_name);
    setSelectedLocation({ longitude: center[0], latitude: center[1] });
    setIsDropdownVisible(false);

    fetchAddressFromCoordinates(center[0], center[1]);
  };

  return (
    <div className="relative">
  <div className="absolute top-6 left-6 z-10 flex space-x-4 items-center">
    <form className="relative">
      <input
        type="text"
        placeholder="Nhập địa chỉ cần tìm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 w-72 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
      />
    </form>

    {isDropdownVisible && searchResults.length > 0 && (
      <ul className="absolute top-12 left-0 z-10 bg-white rounded-lg shadow-md w-72 max-h-52 overflow-y-auto divide-y divide-gray-200">
        {searchResults.map((result) => (
          <li
            key={result.id}
            onClick={() => handleResultClick(result)}
            className="px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {result.place_name}
          </li>
        ))}
      </ul>
    )}

    {selectedLocation && (
      <div className="absolute left-80 top-0 bg-white p-4 rounded-lg shadow-md w-80 z-10">
        <p className="text-gray-700">
          <strong>Địa chỉ:</strong> {presentLocation}
        </p>
        <p className="text-gray-700">
          <strong>Tọa độ:</strong> {selectedLocation.latitude},{" "}
          {selectedLocation.longitude}
        </p>
      </div>
    )}
  </div>

  <ReactMapGL
    {...viewport}
    width="100%"
    height="400px"
    mapStyle="mapbox://styles/mapbox/streets-v12"
    onViewportChange={handleViewportChange}
    mapboxApiAccessToken={MAPBOX_TOKEN}
    onClick={handleMapClick}
    className="rounded-lg mt-4"
  >
    <GeolocateControl
      className="absolute top-6 right-4"
      positionOptions={{ enableHighAccuracy: true }}
      trackUserLocation={true}
      showUserLocation={true}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "50%",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
      onGeolocate={handleGeolocate}
      onError={handleGeolocateError}
    />

    {selectedLocation && (
      <Marker
        latitude={selectedLocation.latitude}
        longitude={selectedLocation.longitude}
        offsetLeft={-15}
        offsetTop={-15}
      >
        <img
          className="h-8 w-8 rounded-full border-2 border-blue-500"
          src="https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
          alt="Selected Location"
        />
      </Marker>
    )}
  </ReactMapGL>
</div>


  );
};

export default Mapbox;
