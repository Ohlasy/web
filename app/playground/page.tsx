import { Button } from "@/components/Button";

export default function Playground() {
  return (
    <div>
      <h1>Buttons</h1>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col md:flex-row gap-4">
          <Button text="Primary" />
          <Button text="Secondary" style="secondary" />
          <Button text="Disabled" disabled />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Button text="Primary" size="small" />
          <Button text="Secondary" size="small" style="secondary" />
          <Button text="Disabled" size="small" disabled />
        </div>
      </div>
    </div>
  );
}
