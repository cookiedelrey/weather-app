import { useEffect, useState } from "react";
import DarkModeToggle from 'react-dark-mode-toggle';

export default function Toggler() {
const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

useEffect(() => {
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
setIsDarkTheme(false);
} else {
setIsDarkTheme(true);
}
}, []);

useEffect(() => {
if (isDarkTheme) {
document.documentElement.classList.add("dark");
} else {
document.documentElement.classList.remove("dark");
}
}, [isDarkTheme]);

const handleThemeSwitch = () => {
setIsDarkTheme(!isDarkTheme);
};

return (
<div className="">
<div className=" left-0 top-">
<DarkModeToggle checked={isDarkTheme} onChange={handleThemeSwitch} size={60} />
</div>
</div>
);
}