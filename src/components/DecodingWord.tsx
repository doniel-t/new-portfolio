"use client";


type DecodingWordProps = {
  word: string;
  className?: string;
};


export default function DecodingWord({ word, className }: DecodingWordProps) {
  return <span className={className}>{word}</span>;
}
