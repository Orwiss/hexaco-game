import EpisodeClient from './EpisodeClient';

interface EpisodePageProps {
  params: Promise<{ episode: string }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { episode } = await params;
  const episodeNum = parseInt(episode, 10);

  if (isNaN(episodeNum) || episodeNum < 1 || episodeNum > 6) {
    return (
      <div className="flex items-center justify-center min-h-dvh p-6">
        <p>잘못된 에피소드입니다.</p>
      </div>
    );
  }

  return <EpisodeClient episodeNumber={episodeNum} />;
}
