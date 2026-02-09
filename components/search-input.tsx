"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";

export default function SearchInput({
  onSearch,
  onReset,
}: {
  onSearch: (keyword: string) => void;
  onReset?: () => void;
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  return (
    <div className='relative'>
      <Input
        className='w-full lg:w-72 h-9'
        placeholder='Search...'
        value={searchKeyword!}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <Button
        variant={"ghost"}
        className='w-7 h-7 absolute bottom-1 right-1 rounded-md'
        disabled={searchKeyword.length === 0}
        onClick={() => {
          if (!isSearch) {
            onSearch(searchKeyword);
            setIsSearch(true);
          } else {
            setSearchKeyword("");
            setIsSearch(false);
            onReset!();
          }
        }}>
        {isSearch ? <X /> : <Search />}
      </Button>
    </div>
  );
}
