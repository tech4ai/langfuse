import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/src/components/ui/dropdown-menu";
import useLocalStorage from "@/src/components/useLocalStorage";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { Rows3 } from "lucide-react";
import {
  MdDensityLarge,
  MdDensityMedium,
  MdDensitySmall,
} from "react-icons/md";

const heightOptions = [
  { id: "s", label: "Small", value: "h-6", icon: <MdDensitySmall /> },
  { id: "m", label: "Medium", value: "h-24", icon: <MdDensityMedium /> },
  { id: "l", label: "Large", value: "h-64", icon: <MdDensityLarge /> },
] as const;

export type RowHeight = (typeof heightOptions)[number]["id"];

export const getRowHeightTailwindClass = (rowHeight: RowHeight | undefined) =>
  heightOptions.find((h) => h.id === rowHeight)?.value;

export function useRowHeightLocalStorage(
  tableName: string,
  defaultValue: RowHeight,
) {
  const [rowHeight, setRowHeight, clearRowHeight] = useLocalStorage<RowHeight>(
    `${tableName}Height`,
    defaultValue,
  );

  return [rowHeight, setRowHeight, clearRowHeight] as const;
}

export const DataTableRowHeightSwitch = ({
  rowHeight,
  setRowHeight,
}: {
  rowHeight: RowHeight;
  setRowHeight: (e: RowHeight) => void;
}) => {
  const capture = usePostHogClientCapture();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title="Row height">
          <Rows3 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuLabel>Row height</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {heightOptions.map(({ id, label }) => (
            <DropdownMenuCheckboxItem
              key={id}
              checked={rowHeight === id}
              onClick={(e) => {
                // Prevent closing the dropdown menu to allow the user to adjust their selection
                e.preventDefault();
                capture("table:row_height_switch_select", {
                  rowHeight: id,
                });
                setRowHeight(id);
              }}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
