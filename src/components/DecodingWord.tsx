"use client";


type DecodingWordProps = {
  word: string;
  startDelayMs?: number;
  className?: string;
  active?: boolean; // when false, animation waits until true
};


export default function DecodingWord({ word, startDelayMs = 0, className, active = true }: DecodingWordProps) {

  return <span className={className}>{word}</span>;

 
}
