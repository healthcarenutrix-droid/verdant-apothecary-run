import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import RecentPurchasePopup from "@/components/RecentPurchasePopup";
import { DEFAULT_PROOF_SETTINGS, PROOF_COLUMNS, type SocialProofSettings } from "@/lib/socialProof";

const DashboardSocialProof = () => {
  const { toast } = useToast();
  const [s, setS] = useState<SocialProofSettings>(DEFAULT_PROOF_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    supabase.from("social_proof_settings").select(PROOF_COLUMNS).eq("id", true).maybeSingle()
      .then(({ data }) => data && setS({ ...DEFAULT_PROOF_SETTINGS, ...(data as any) }));
  }, []);

  const set = <K extends keyof SocialProofSettings>(k: K, v: SocialProofSettings[K]) => setS((c) => ({ ...c, [k]: v }));
  const num = (k: "initial_delay_seconds" | "display_seconds" | "gap_seconds") => (
    <Input type="number" min={1} max={120} value={s[k]} onChange={(e) => set(k, Math.max(1, Number(e.target.value) || 1))} />
  );

  const toggleProduct = (id: string) =>
    set("product_ids", s.product_ids.includes(id) ? s.product_ids.filter((x) => x !== id) : [...s.product_ids, id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("social_proof_settings").upsert({ id: true, ...s });
    setSaving(false);
    toast(error ? { title: "Could not save", description: error.message, variant: "destructive" } : { title: "Recent purchase pop-up saved" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Recent Purchase Pop-up</CardTitle>
            <CardDescription>Small "Ayesha from Lahore just purchased…" notice in the corner of store pages.</CardDescription>
          </div>
          <Switch checked={s.enabled} onCheckedChange={(v) => set("enabled", v)} aria-label="Enable" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2"><Label>First appears after (sec)</Label>{num("initial_delay_seconds")}</div>
            <div className="space-y-2"><Label>Stays visible (sec)</Label>{num("display_seconds")}</div>
            <div className="space-y-2"><Label>Hidden between (sec)</Label>{num("gap_seconds")}</div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={s.position} onValueChange={(v) => set("position", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="top-left">Top left</SelectItem>
                  <SelectItem value="top-center">Top center</SelectItem>
                  <SelectItem value="top-right">Top right</SelectItem>
                  <SelectItem value="bottom-left">Bottom left</SelectItem>
                  <SelectItem value="bottom-center">Bottom center</SelectItem>
                  <SelectItem value="bottom-right">Bottom right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Movement direction</Label>
              <Select value={s.animation_direction} onValueChange={(v) => set("animation_direction", v as SocialProofSettings["animation_direction"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="up">Move up</SelectItem>
                  <SelectItem value="down">Move down</SelectItem>
                  <SelectItem value="left">Move left</SelectItem>
                  <SelectItem value="right">Move right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default language</Label>
              <Select value={s.language} onValueChange={(v) => set("language", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="roman">Roman Urdu</SelectItem>
                  <SelectItem value="ur">اردو (Urdu)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Badge</Label>
              <Select value={s.badge} onValueChange={(v) => set("badge", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Cash on Delivery available</SelectItem>
                  <SelectItem value="verified">Verified purchase</SelectItem>
                  <SelectItem value="none">No badge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Products to show</Label>
            <p className="text-xs text-muted-foreground">Leave all unticked to use every active product.</p>
            <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-border rounded-md p-3">
              {products.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={s.product_ids.includes(p.id)} onCheckedChange={() => toggleProduct(p.id)} />
                  <img src={p.image} alt="" className="h-7 w-7 rounded object-cover" />
                  <span className="truncate">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-1" />{saving ? "Saving…" : "Save"}</Button>
            <Button variant="outline" onClick={() => setPreview((p) => !p)}>{preview ? "Stop preview" : "Preview"}</Button>
          </div>
        </CardContent>
      </Card>
      {preview && <RecentPurchasePopup previewSettings={{ ...s, enabled: true, initial_delay_seconds: 1 }} />}
    </div>
  );
};

export default DashboardSocialProof;
