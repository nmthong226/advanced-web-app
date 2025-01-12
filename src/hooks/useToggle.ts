// hooks/useToggle.ts
import { useState } from 'react';

export const useToggle = (initialValue: boolean = false) => {
  const [isToggled, setIsToggled] = useState(initialValue);

  const toggle = () => setIsToggled(!isToggled);

  return [isToggled, toggle] as const;
};