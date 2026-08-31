import { type ReactNode, useMemo, useRef, useState } from 'react';
import { Bookmark, Check, ChevronRight, Compass, ExternalLink, Film, Heart, Info, Library, ListFilter, Play, RotateCcw, Search, Sparkles, Star, Tv, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

type Region = 'Hollywood' | 'Bollywood' | 'Tollywood' | 'International';
type MediaType = 'Film' | 'Series';
type Title = {
  id: string;
  name: string;
  year: number;
  region: Region;
  type: MediaType;
  genres: string[];
  runtime: string;
  score: string;
  description: string;
  poster?: string;
  gradient: string;
  streaming: string;
  streamingUrl: string;
  imdb: string;
  letterboxd: string;
  trailer: string;
  featured?: boolean;
};

const titles: Title[] = [
  { id: 'sinners', name: 'Sinners', year: 2025, region: 'Hollywood', type: 'Film', genres: ['Horror', 'Drama'], runtime: '2h 17m', score: '8.2', description: 'A musician returns to his hometown with a suitcase full of records, and finds the night has teeth. Ryan Coogler’s electric Southern gothic is built for the biggest screen in your house.', poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/yqsCU5XOP2mkbFamg9R9D3q0p2p.jpg', gradient: 'linear-gradient(145deg,#2d164d,#ae4f72 68%,#f2a06d)', streaming: 'Prime Video', streamingUrl: 'https://www.primevideo.com/', imdb: 'https://www.imdb.com/title/tt31193180/', letterboxd: 'https://letterboxd.com/film/sinners-2025/', trailer: 'https://www.youtube.com/watch?v=OsN1x1wZs8Q', featured: true },
  { id: 'dune-2', name: 'Dune: Part Two', year: 2024, region: 'Hollywood', type: 'Film', genres: ['Sci-fi', 'Epic'], runtime: '2h 46m', score: '8.6', description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', gradient: 'linear-gradient(145deg,#d49b55,#30271e 64%,#111116)', streaming: 'Max', streamingUrl: 'https://www.max.com/', imdb: 'https://www.imdb.com/title/tt15239678/', letterboxd: 'https://letterboxd.com/film/dune-part-two/', trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w' },
  { id: 'past-lives', name: 'Past Lives', year: 2023, region: 'International', type: 'Film', genres: ['Romance', 'Drama'], runtime: '1h 46m', score: '7.8', description: 'Two childhood sweethearts reunite in New York for one fateful week, and wonder what might have been.', poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg', gradient: 'linear-gradient(145deg,#1c4960,#d39878 72%,#f2d0a8)', streaming: 'MUBI', streamingUrl: 'https://mubi.com/', imdb: 'https://www.imdb.com/title/tt13238346/', letterboxd: 'https://letterboxd.com/film/past-lives/', trailer: 'https://www.youtube.com/watch?v=kA244xewjcI' },
  { id: 'parasite', name: 'Parasite', year: 2019, region: 'International', type: 'Film', genres: ['Thriller', 'Drama'], runtime: '2h 12m', score: '8.5', description: 'A cash-strapped family slowly schemes its way into the immaculate home of a wealthy household.', poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', gradient: 'linear-gradient(145deg,#89a38f,#222e32 60%,#11151a)', streaming: 'Hulu', streamingUrl: 'https://www.hulu.com/', imdb: 'https://www.imdb.com/title/tt6751668/', letterboxd: 'https://letterboxd.com/film/parasite-2019/', trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY' },
  { id: 'laapataa-ladies', name: 'Laapataa Ladies', year: 2024, region: 'Bollywood', type: 'Film', genres: ['Comedy', 'Drama'], runtime: '2h 2m', score: '8.4', description: 'Two brides get separated from their husbands on a train ride. A warm, sharp little story about identity and the freedom to find it.', gradient: 'linear-gradient(145deg,#efaa5c,#b8525a 57%,#381b37)', streaming: 'Netflix', streamingUrl: 'https://www.netflix.com/', imdb: 'https://www.imdb.com/title/tt21626284/', letterboxd: 'https://letterboxd.com/film/laapataa-ladies/', trailer: 'https://www.youtube.com/watch?v=s3MRx2q3J9g' },
  { id: '12th-fail', name: '12th Fail', year: 2023, region: 'Bollywood', type: 'Film', genres: ['Biography', 'Drama'], runtime: '2h 27m', score: '9.0', description: 'A young man from a small town refuses to let one exam decide the size of his life.', gradient: 'linear-gradient(145deg,#d68050,#294f69 65%,#101921)', streaming: 'Disney+ Hotstar', streamingUrl: 'https://www.hotstar.com/', imdb: 'https://www.imdb.com/title/tt23849204/', letterboxd: 'https://letterboxd.com/film/12th-fail/', trailer: 'https://www.youtube.com/watch?v=WeMJo701mvQ' },
  { id: 'rrr', name: 'RRR', year: 2022, region: 'Tollywood', type: 'Film', genres: ['Action', 'Epic'], runtime: '3h 7m', score: '7.8', description: 'Two revolutionaries, an impossible friendship, and a dance number that bends the physics of joy.', gradient: 'linear-gradient(145deg,#e45f34,#e6b64e 55%,#1c3347)', streaming: 'Netflix', streamingUrl: 'https://www.netflix.com/', imdb: 'https://www.imdb.com/title/tt8178634/', letterboxd: 'https://letterboxd.com/film/rrr/', trailer: 'https://www.youtube.com/watch?v=NgBoMJy386M' },
  { id: 'tumbbad', name: 'Tumbbad', year: 2018, region: 'Bollywood', type: 'Film', genres: ['Horror', 'Fantasy'], runtime: '1h 44m', score: '8.2', description: 'A man ventures into a cursed village to harvest a forgotten goddess’s endless gold.', gradient: 'linear-gradient(145deg,#604d26,#201817 56%,#ae542e)', streaming: 'Prime Video', streamingUrl: 'https://www.primevideo.com/', imdb: 'https://www.imdb.com/title/tt8239946/', letterboxd: 'https://letterboxd.com/film/tumbbad/', trailer: 'https://www.youtube.com/watch?v=sN75mpium8k' },
  { id: 'the-bear', name: 'The Bear', year: 2022, region: 'Hollywood', type: 'Series', genres: ['Comedy', 'Drama'], runtime: '3 seasons', score: '8.5', description: 'In a kitchen where every service is personal, a young chef tries to make something worth coming back to.', gradient: 'linear-gradient(145deg,#bd4e37,#20242f 59%,#e6a95e)', streaming: 'Disney+ Hotstar', streamingUrl: 'https://www.hotstar.com/', imdb: 'https://www.imdb.com/title/tt14452776/', letterboxd: 'https://letterboxd.com/film/the-bear/', trailer: 'https://www.youtube.com/watch?v=gBmkI4jlaIo' },
  { id: 'severance', name: 'Severance', year: 2022, region: 'Hollywood', type: 'Series', genres: ['Mystery', 'Sci-fi'], runtime: '2 seasons', score: '8.7', description: 'A surgical split between work and life turns a quiet office into an elegant, existential nightmare.', gradient: 'linear-gradient(145deg,#9ab8ad,#29394a 65%,#121720)', streaming: 'Apple TV+', streamingUrl: 'https://tv.apple.com/', imdb: 'https://www.imdb.com/title/tt11280740/', letterboxd: 'https://letterboxd.com/film/severance/', trailer: 'https://www.youtube.com/watch?v=xEQP4VVuyrY' },
  { id: 'scam-1992', name: 'Scam 1992', year: 2020, region: 'Bollywood', type: 'Series', genres: ['Biography', 'Crime'], runtime: '10 episodes', score: '9.2', description: 'The rise and fall of a stock-market legend, told with swagger, rhythm, and a very good soundtrack.', gradient: 'linear-gradient(145deg,#d97b3f,#50412c 60%,#1d2529)', streaming: 'SonyLIV', streamingUrl: 'https://www.sonyliv.com/', imdb: 'https://www.imdb.com/title/tt12392504/', letterboxd: 'https://letterboxd.com/film/scam-1992-the-harshad-mehta-story/', trailer: 'https://www.youtube.com/watch?v=ISORfezBh9E' },
  { id: 'panchayat', name: 'Panchayat', year: 2020, region: 'Bollywood', type: 'Series', genres: ['Comedy', 'Drama'], runtime: '3 seasons', score: '8.9', description: 'A reluctant city graduate finds an unexpected rhythm in the smallest office in rural India.', gradient: 'linear-gradient(145deg,#74a8a0,#e1aa60 63%,#37293d)', streaming: 'Prime Video', streamingUrl: 'https://www.primevideo.com/', imdb: 'https://www.imdb.com/title/tt12004706/', letterboxd: 'https://letterboxd.com/film/panchayat/', trailer: 'https://www.youtube.com/watch?v=mojZJ7oeD_g' },
  { id: 'mahanati', name: 'Mahanati', year: 2018, region: 'Tollywood', type: 'Film', genres: ['Biography', 'Drama'], runtime: '2h 57m', score: '8.5', description: 'The luminous, bittersweet story of an actor whose stardom could not protect her from the cost of being adored.', gradient: 'linear-gradient(145deg,#db8b9a,#43335b 63%,#151522)', streaming: 'Prime Video', streamingUrl: 'https://www.primevideo.com/', imdb: 'https://www.imdb.com/title/tt6908274/', letterboxd: 'https://letterboxd.com/film/mahanati/', trailer: 'https://www.youtube.com/watch?v=9w8RzZ5Yw7Q' },
  { id: 'blue-eye-samurai', name: 'Blue Eye Samurai', year: 2023, region: 'International', type: 'Series', genres: ['Animation', 'Action'], runtime: '8 episodes', score: '8.7', description: 'A master of the sword walks through Edo-period Japan with a blue-eyed secret and a very long memory.', gradient: 'linear-gradient(145deg,#187485,#da5b4f 60%,#151c3c)', streaming: 'Netflix', streamingUrl: 'https://www.netflix.com/', imdb: 'https://www.imdb.com/title/tt13309742/', letterboxd: 'https://letterboxd.com/film/blue-eye-samurai/', trailer: 'https://www.youtube.com/watch?v=nJ1yQn17lbE' },
];

const genres = ['All', 'Drama', 'Comedy', 'Thriller', 'Action', 'Horror', 'Sci-fi', 'Biography'];
const queryClient = new QueryClient();

function Poster({ title, large = false, bare = false }: { title: Title; large?: boolean; bare?: boolean }) {
  return (
    <div className={large ? 'detail-poster' : bare ? 'poster-visual' : 'poster-frame'} style={{ ['--poster-gradient' as string]: title.gradient }} data-testid={`poster-${title.id}`}>
      <div className="poster-fallback"><strong>{title.name}</strong><span>{title.region} / {title.year}</span></div>
      {title.poster && <img src={title.poster} alt={`${title.name} poster`} onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
    </div>
  );
}

function PosterCard({ title, saved, onSelect, onToggleSave, index }: { title: Title; saved: boolean; onSelect: () => void; onToggleSave: () => void; index: number }) {
  return (
    <article className="poster-card" style={{ animationDelay: `${index * 45}ms` }} onClick={onSelect} onKeyDown={(event) => { if (event.key === 'Enter') onSelect(); }} tabIndex={0} data-testid={`card-title-${title.id}`}>
      <div className="poster-frame">
        <Poster title={title} bare />
        <div className="poster-shade" />
        <button className={`card-save ${saved ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onToggleSave(); }} aria-label={`${saved ? 'Remove' : 'Save'} ${title.name}`} data-testid={`button-save-${title.id}`}>
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <div className="poster-hover-cta"><Info size={12} /> View story</div>
      </div>
      <div className="poster-copy">
        <h3 data-testid={`text-title-${title.id}`}>{title.name}</h3>
        <p>{title.year} · {title.region} · {title.type}</p>
      </div>
    </article>
  );
}

function Home() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All regions');
  const [type, setType] = useState('All types');
  const [genre, setGenre] = useState('All');
  const [watchlist, setWatchlist] = useState<string[]>(['past-lives', 'panchayat']);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [selectedId, setSelectedId] = useState('sinners');
  const detailRef = useRef<HTMLElement>(null);
  const selected = titles.find((title) => title.id === selectedId) ?? titles[0];
  const filtered = useMemo(() => titles.filter((title) => {
    const haystack = `${title.name} ${title.region} ${title.genres.join(' ')}`.toLowerCase();
    return haystack.includes(query.toLowerCase().trim())
      && (region === 'All regions' || title.region === region)
      && (type === 'All types' || title.type === type)
      && (genre === 'All' || title.genres.includes(genre))
      && (!watchlistOnly || watchlist.includes(title.id));
  }), [genre, query, region, type, watchlist, watchlistOnly]);
  const recent = titles.filter((title) => ['sinners', 'past-lives', 'laapataa-ladies', 'severance', 'rrr'].includes(title.id));
  const tonight = titles.filter((title) => ['tumbbad', 'the-bear', 'blue-eye-samurai', 'parasite', 'panchayat'].includes(title.id));
  const isSaved = (id: string) => watchlist.includes(id);
  const toggleSave = (id: string) => setWatchlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const selectTitle = (id: string) => {
    setSelectedId(id);
    window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40);
  };
  const surpriseMe = () => {
    const pick = titles[Math.floor(Math.random() * titles.length)];
    resetFilters();
    selectTitle(pick.id);
  };
  const resetFilters = () => { setQuery(''); setRegion('All regions'); setType('All types'); setGenre('All'); setWatchlistOnly(false); };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="screenroom-app">
      <aside className="app-rail" aria-label="Primary navigation">
        <button className="rail-logo" onClick={() => scrollTo('top')} aria-label="Back to top" data-testid="button-home">S</button>
        <nav className="rail-nav">
          <button className="rail-button active" onClick={() => scrollTo('discover')} aria-label="Discover" data-testid="button-nav-discover"><Compass size={19} /></button>
          <button className="rail-button" onClick={() => scrollTo('catalog')} aria-label="Catalog" data-testid="button-nav-catalog"><Library size={19} /></button>
          <button className="rail-button" onClick={() => { setGenre('All'); scrollTo('catalog'); }} aria-label="Filters" data-testid="button-nav-filters"><ListFilter size={19} /></button>
        </nav>
        <div className="rail-foot" aria-label="Screenroom profile">SR</div>
      </aside>
      <div className="main-wrap" id="top">
        <header className="topbar">
          <div className="wordmark">screen<i>room</i></div>
          <label className="top-search" aria-label="Search the catalog">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a title, mood, or region" data-testid="input-search-top" />
          </label>
          <div className="eyebrow">{watchlist.length.toString().padStart(2, '0')} saved</div>
        </header>
        <main>
          <section className="section-shell hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="eyebrow">A late-night cinema journal / 2025</div>
              <h1 id="hero-title">Find your next<br /><em>after-dark</em> obsession.</h1>
              <p className="hero-lede">A considered shortlist for the hours when you want a film with a pulse, a series with somewhere to go, or a story you can’t shake by morning.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={() => scrollTo('catalog')} data-testid="button-browse-catalog"><Play size={14} fill="currentColor" /> Browse the room</button>
                <button className="btn-quiet" onClick={surpriseMe} data-testid="button-surprise-me"><Sparkles size={14} /> Surprise me</button>
              </div>
              <div className="hero-meta">
                <div><strong>04</strong>regions</div>
                <div><strong>{titles.length}</strong>handpicked titles</div>
                <div><strong>01</strong>good excuse</div>
              </div>
            </div>
            <div className="feature-wrap">
              <div className="feature-card">
                <div className="feature-art"><div className="feature-geometry" /></div>
                <div className="feature-info">
                  <div className="eyebrow">Tonight’s headliner</div>
                  <h2>{titles[0].name}</h2>
                  <p>Big sound, Southern heat, and a midnight screening energy.</p>
                  <div className="feature-tags"><span className="tag">Horror</span><span className="tag">2025</span><span className="tag">2h 17m</span></div>
                  <div className="feature-score"><Star size={12} fill="currentColor" /> {titles[0].score} / 10</div>
                </div>
              </div>
            </div>
          </section>
          <div className="ticker" aria-label="Screenroom editorial note"><b>SR</b><span>New releases worth leaving the house for</span><span>•</span><span>Three-hour epics welcome</span><span>•</span><span>Subtitles are a feature, not a chore</span><ChevronRight size={13} /></div>
          <section className="section-shell" id="discover" aria-labelledby="discover-title">
            <div className="section-head">
              <div><div className="eyebrow">The editorial cut</div><h2 id="discover-title">Start with a <em>feeling.</em></h2></div>
              <p className="section-note">Rows for the exact mood of the room. No algorithmic shouting.</p>
            </div>
            <div className="row-grid">
              {recent.map((title, index) => <PosterCard key={title.id} title={title} saved={isSaved(title.id)} onSelect={() => selectTitle(title.id)} onToggleSave={() => toggleSave(title.id)} index={index} />)}
            </div>
          </section>
          <section className="section-shell" style={{ marginTop: '60px' }} aria-labelledby="tonight-title">
            <div className="section-head">
              <div><div className="eyebrow">Low lights, high stakes</div><h2 id="tonight-title">For <em>tonight.</em></h2></div>
              <p className="section-note">Press play when the group chat has gone quiet.</p>
            </div>
            <div className="row-grid">
              {tonight.map((title, index) => <PosterCard key={title.id} title={title} saved={isSaved(title.id)} onSelect={() => selectTitle(title.id)} onToggleSave={() => toggleSave(title.id)} index={index + 2} />)}
            </div>
          </section>
          <section className="discover section-shell" id="catalog" aria-labelledby="catalog-title">
            <div className="section-head">
              <div><div className="eyebrow">The full room / {filtered.length} results</div><h2 id="catalog-title">Keep <em>looking.</em></h2></div>
              <p className="section-note">Search the corners. Hollywood, Bollywood, Tollywood and further out.</p>
            </div>
            <div className="filter-bar">
              <label className="filter-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “quiet”, “horror”, “Mumbai”…" data-testid="input-catalog-search" /></label>
              <select className="filter-select" value={region} onChange={(event) => setRegion(event.target.value)} aria-label="Filter by region" data-testid="select-region">
                <option>All regions</option><option>Hollywood</option><option>Bollywood</option><option>Tollywood</option><option>International</option>
              </select>
              <select className="filter-select" value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by type" data-testid="select-type">
                <option>All types</option><option>Film</option><option>Series</option>
              </select>
              <button className={`filter-chip ${watchlistOnly ? 'selected' : ''}`} onClick={() => setWatchlistOnly((current) => !current)} data-testid="button-filter-watchlist"><Bookmark size={12} /> Watchlist · {watchlist.length}</button>
              <button className="btn-quiet" style={{ minHeight: 39, padding: '0 11px', fontSize: 10 }} onClick={resetFilters} data-testid="button-reset-filters"><RotateCcw size={12} /> Reset</button>
            </div>
            <div className="filter-bar" style={{ padding: '0 0 20px', border: 0, background: 'transparent', marginBottom: 0 }}>
              {genres.map((item) => <button key={item} className={`filter-chip ${genre === item ? 'selected' : ''}`} onClick={() => setGenre(item)} data-testid={`button-genre-${item.toLowerCase()}`}>{item}</button>)}
            </div>
            <div className="catalog-grid">
              {filtered.length > 0 ? filtered.map((title, index) => <PosterCard key={title.id} title={title} saved={isSaved(title.id)} onSelect={() => selectTitle(title.id)} onToggleSave={() => toggleSave(title.id)} index={index} />) : (
                <div className="empty-state" data-testid="empty-catalog">
                  <div className="empty-orbit"><Search size={24} /></div>
                  <h3>No titles in this cut.</h3>
                  <p>The room is being particular tonight. Try a wider region, a different genre, or clear the filters.</p>
                  <button className="btn-primary" onClick={resetFilters} data-testid="button-empty-reset"><RotateCcw size={13} /> Clear the room</button>
                </div>
              )}
            </div>
          </section>
          <section className="detail-section" ref={detailRef} aria-labelledby="detail-title">
            <div className="detail-panel">
              <Poster title={selected} large />
              <div className="detail-copy">
                <div className="eyebrow">Now in focus / {selected.region}</div>
                <h2 id="detail-title">{selected.name.includes(':') ? <>{selected.name.split(':')[0]}:<br /><em>{selected.name.split(':').slice(1).join(':').trim()}</em></> : selected.name}</h2>
                <p className="detail-description">{selected.description}</p>
                <div className="detail-meta"><span>Year <strong>{selected.year}</strong></span><span>Score <strong><Star size={11} fill="currentColor" /> {selected.score}</strong></span><span>Format <strong>{selected.type}</strong></span><span>Runtime <strong>{selected.runtime}</strong></span></div>
                <div className="detail-actions">
                  <a className="icon-button" href={selected.trailer} target="_blank" rel="noreferrer" data-testid={`link-trailer-${selected.id}`}><Play size={13} fill="currentColor" /> Watch trailer</a>
                  <button className={`icon-button ${isSaved(selected.id) ? 'saved' : ''}`} onClick={() => toggleSave(selected.id)} data-testid={`button-detail-save-${selected.id}`}>{isSaved(selected.id) ? <Check size={14} /> : <Bookmark size={14} />} {isSaved(selected.id) ? 'Saved for later' : 'Save for later'}</button>
                  <a className="icon-button" href={selected.streamingUrl} target="_blank" rel="noreferrer" data-testid={`link-stream-${selected.id}`}><Tv size={13} /> Find on {selected.streaming}</a>
                </div>
                <div className="links-line"><a className="text-link" href={selected.imdb} target="_blank" rel="noreferrer" data-testid={`link-imdb-${selected.id}`}>IMDb <ExternalLink size={10} /></a><a className="text-link" href={selected.letterboxd} target="_blank" rel="noreferrer" data-testid={`link-letterboxd-${selected.id}`}>Letterboxd <ExternalLink size={10} /></a></div>
              </div>
              <button className="card-save" style={{ opacity: 1, transform: 'none', right: 20, top: 20 }} onClick={() => scrollTo('catalog')} aria-label="Close title detail" data-testid="button-close-detail"><X size={15} /></button>
            </div>
          </section>
        </main>
        <footer className="footer"><strong>screenroom</strong><span>Made for the last screening of the night · {new Date().getFullYear()}</span><span>Films across the map</span></footer>
      </div>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
