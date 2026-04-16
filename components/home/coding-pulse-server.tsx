import { CodingPulse } from "@/components/home/coding-pulse";
import { loadWakaTimeShare } from "@/lib/wakatime";

type CodingPulseServerProps = {
  shareUrl?: string | null;
};

export async function CodingPulseServer({ shareUrl }: CodingPulseServerProps) {
  const data = await loadWakaTimeShare(shareUrl);
  return <CodingPulse data={data} />;
}
