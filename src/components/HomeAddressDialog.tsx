"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function HomeAddressDialog({
  open,
  onOpenChange,
  homeAddress,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeAddress: string;
  onSave: (address: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(homeAddress);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(homeAddress);
      setError(null);
    }
  }, [open, homeAddress]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = draft.trim();
    if (!address) return;
    setPending(true);
    setError(null);
    try {
      await onSave(address);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Trajet indisponible");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Trajet en voiture</DialogTitle>
            <DialogDescription>
              Distance et durée entre chez toi et les points d&apos;accès.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="homeAddress">Adresse maison</Label>
            <Input
              id="homeAddress"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoComplete="street-address"
              aria-invalid={error ? true : undefined}
            />
            {error ? (
              <p className="text-destructive text-xs" role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <DialogFooter className="items-center sm:justify-between">
            <span>
              <span className="py-1">via </span>
              <a
                href="https://www.geoapify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-foreground text-xs underline"
              >
                Geoapify
              </a>
            </span>
            <Button type="submit" disabled={pending || !draft.trim()}>
              {pending ? <Loader2 className="animate-spin" /> : null}
              {pending ? "Calcul…" : "Calculer trajet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
