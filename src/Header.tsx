import { ColorModeButton } from "./components/ui/color-mode";

const Header = () => (
  <header className="flex items-center justify-between">
    <h1 className="text-2xl font-black tracking-tight">🏆 Round Robin</h1>
    <ColorModeButton />
  </header>
);

export default Header;
