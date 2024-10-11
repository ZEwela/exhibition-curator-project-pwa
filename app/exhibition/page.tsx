"use client";
import React from "react";
import Exhibition from "../components/Exhibition";

const ExhibitionPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Your Exhibition</h1>
      <Exhibition />
    </div>
  );
};

export default ExhibitionPage;
