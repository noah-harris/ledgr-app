export type NavLink = { 
  to: string; 
  label: string; 
  children?: { 
    to: string; 
    label: string
   }[] 
};