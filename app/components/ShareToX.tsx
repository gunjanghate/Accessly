"use client";

import React from "react";
import xlogo from "@/public/xlogo.png";
import Image from "next/image";

interface ShareToXProps {
  title?: string; // Optional title for tweet
  content: string; // Main message body
  hashtags?: string[]; // Array of hashtags without #
  url?: string; // Optional URL to include
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

const ShareToX: React.FC<ShareToXProps> = ({
  title,
  content,
  hashtags = [],
  url = "",
  size = "md",
  variant = "default",
}) => {
  const handleClick = () => {
    let tweetText = title ? `${title}\n\n${content}` : content;

    const encodedText = encodeURIComponent(tweetText);
    const encodedURL = encodeURIComponent(url);
    const hashtagText = hashtags.length ? `&hashtags=${hashtags.join(",")}` : "";

    const tweetURL = `https://twitter.com/intent/tweet?text=${encodedText}${url ? `&url=${encodedURL}` : ""}${hashtagText}`;

    window.open(tweetURL, "_blank");
  };

  // Size variants matching your design



  return (
    <button 
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center
        font-semibold rounded-full
        transform 
        focus:outline-none 
        
      `}
    >
      <Image 
      src={xlogo}
      alt="xlogo"
       className={`w-8 h-8 transition-transform duration-300`} />
      <span>Share on X</span>
    </button>
  );
};

export default ShareToX;