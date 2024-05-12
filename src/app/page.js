import VideoPlayer from "@/components/VideoPlayer";

export default function Home() {
  return (
    <div className={`w-100 h-100`}>
      <VideoPlayer url={'/HCW.mp4'}/>
    </div>
  );
}
