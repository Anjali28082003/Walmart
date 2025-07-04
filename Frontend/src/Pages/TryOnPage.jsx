import React, { useState, useRef, useEffect } from "react";
import { useProductData } from "../data/useProductData";

const TryOnPage = () => {
  const [category, setCategory] = useState("clothes");
  const [cameraOn, setCameraOn] = useState(false);
  const [selectedCloth, setSelectedCloth] = useState(null);
  const [overlayImage, setOverlayImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const { allProducts, loading } = useProductData();

  // Separate products by category
  const clothes = allProducts.filter(
    (p) => p.category === "women's clothing" || p.category === "men's clothing"
  );
  const makeup = allProducts.filter((p) => p.category === "makeup");
  const items = category === "clothes" ? clothes : makeup;

  // Start camera when toggled
  useEffect(() => {
    if (cameraOn && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        })
        .catch((err) => console.error("Error accessing camera:", err));
    }
  }, [cameraOn]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setOverlayImage(null);
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  };

  const handleTryOn = async () => {
  if (!selectedCloth || !videoRef.current) return;

  const imageDataURL = captureImage();
  const userBlob = await (await fetch(imageDataURL)).blob();

  // ✅ Download the selected cloth image and convert to blob
  const clothBlob = await (await fetch(selectedCloth.image)).blob();

  const formData = new FormData();
  formData.append("userImage", userBlob, "user.png");
  formData.append("itemImage", clothBlob, "cloth.png"); // ✅ fixed field name

  try {
    const res = await fetch("http://localhost:5000/api/tryon", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server error: ${res.status} - ${errText}`);
    }

    const data = await res.blob();
    const outputUrl = URL.createObjectURL(data);
    setOverlayImage(outputUrl);
  } catch (err) {
    console.error("Try-on failed:", err);
  }
};


  return (
  <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-[#FDEEF4] to-[#E0F7FA]">
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold text-[#4A4A4A] text-center mb-6">Virtual Try-On</h1>

      {/* Category Switch */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setCategory("clothes")}
          className={`px-6 py-2 rounded-full text-lg font-medium border ${
            category === "clothes"
              ? "bg-[#F8BBD0] text-white border-transparent"
              : "bg-white text-[#4A4A4A] border-gray-300"
          }`}
        >
          Clothes
        </button>
        <button
          onClick={() => setCategory("makeup")}
          className={`px-6 py-2 rounded-full text-lg font-medium border ${
            category === "makeup"
              ? "bg-[#CE93D8] text-white border-transparent"
              : "bg-white text-[#4A4A4A] border-gray-300"
          }`}
        >
          Makeup
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Try-On Area */}
        <div className="flex flex-col items-center justify-center flex-1 bg-[#E6E6FA] rounded-2xl p-6 shadow-lg">
          <div className="w-full h-full max-h-[500px] bg-[#F3F4F6] rounded-xl flex items-center justify-center overflow-hidden relative">
            {overlayImage ? (
              <img src={overlayImage} alt="Result" className="w-full h-full object-contain" />
            ) : cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-gray-400">Your image or live feed</span>
            )}
          </div>

          <button
            className="mt-6 bg-[#81D4FA] text-white px-5 py-2 rounded-lg hover:bg-[#4FC3F7] transition"
            onClick={() => {
              setCameraOn((prev) => !prev);
              if (cameraOn) stopCamera();
            }}
          >
            {cameraOn ? "Stop Camera" : "Start Camera"}
          </button>

          {cameraOn && selectedCloth && (
            <button
              className="mt-4 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
              onClick={handleTryOn}
            >
              Try Selected Cloth
            </button>
          )}
        </div>

        {/* Item List */}
        <div className="w-full lg:w-[350px] bg-[#E6E6FA] rounded-2xl p-6 shadow-lg overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold text-[#4A4A4A] mb-4">
            Try {category === "clothes" ? "Clothes" : "Makeup"}
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading items...</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <img
                  key={item.id}
                  src={item.image}
                  onClick={() => setSelectedCloth(item)}
                  className={`rounded-xl h-24 w-24 object-cover cursor-pointer hover:scale-105 transition ${
                    selectedCloth?.id === item.id ? "ring-4 ring-blue-400" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default TryOnPage;
