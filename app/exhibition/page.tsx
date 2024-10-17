"use client";
import React, { Suspense } from "react";
import Exhibition from "../components/Exhibition";

const ExhibitionPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Your Exhibition</h1>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <Exhibition />
      </Suspense>
    </div>
  );
};

export default ExhibitionPage;
