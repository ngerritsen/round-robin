import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";
import { Button } from "./button";

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  return {
    colorMode: resolvedTheme === "dark" ? ("dark" as const) : ("light" as const),
    toggleColorMode: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
  };
}

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button variant="ghost" size="icon" onClick={toggleColorMode} aria-label="Toggle theme">
      {colorMode === "dark" ? (
        <LuMoon className="h-4 w-4" />
      ) : (
        <LuSun className="h-4 w-4" />
      )}
    </Button>
  );
}
