"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChefHat,
  Clock3,
  Coffee,
  Copy,
  Croissant,
  Flower2,
  Heart,
  IceCreamBowl,
  Laugh,
  MessageCircleHeart,
  MoonStar,
  PartyPopper,
  Pizza,
  Popcorn,
  RefreshCcw,
  Send,
  Sparkles,
  Star,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";
import {
  type ComponentType,
  type RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;
type Screen = "proposal" | "planner" | "summary";

type Choice = {
  id: string;
  label: string;
  detail: string;
  icon: IconType;
  accent: string;
};

const activities: Choice[] = [
  {
    id: "Cozy Café Date",
    label: "Cozy Café",
    detail: "Warm drinks & softer talks",
    icon: Coffee,
    accent: "peach",
  },
  {
    id: "Movie Night",
    label: "Movie Night",
    detail: "Popcorn, cuddles & a good film",
    icon: Popcorn,
    accent: "lilac",
  },
  {
    id: "Sunset Walk",
    label: "Sunset Walk",
    detail: "Golden hour, hand in hand",
    icon: MoonStar,
    accent: "rose",
  },
  {
    id: "Fine Dining",
    label: "Fine Dining",
    detail: "Dress up & make a memory",
    icon: UtensilsCrossed,
    accent: "gold",
  },
  {
    id: "Surprise Me",
    label: "Surprise Me",
    detail: "Sami plans something magical",
    icon: WandSparkles,
    accent: "mint",
  },
];

const foodChoices: Choice[] = [
  {
    id: "Italian",
    label: "Italian",
    detail: "Pasta, pizza & amore",
    icon: Pizza,
    accent: "rose",
  },
  {
    id: "Chinese",
    label: "Chinese",
    detail: "Dumplings & delicious bites",
    icon: ChefHat,
    accent: "gold",
  },
  {
    id: "Street Food",
    label: "Street Food",
    detail: "A little flavour adventure",
    icon: UtensilsCrossed,
    accent: "peach",
  },
  {
    id: "Fast Food",
    label: "Fast Food",
    detail: "Easy, fun & extra fries",
    icon: Croissant,
    accent: "lilac",
  },
  {
    id: "Dessert / Ice Cream",
    label: "Dessert",
    detail: "Because you are the sweet one",
    icon: IceCreamBowl,
    accent: "mint",
  },
];

const steps = [
  { number: 1, eyebrow: "First things first", title: "When shall I steal you away?" },
  { number: 2, eyebrow: "Set the mood", title: "What kind of date feels right?" },
  { number: 3, eyebrow: "The delicious part", title: "What are we craving?" },
  { number: 4, eyebrow: "One last little thing", title: "Anything your heart wants?" },
];

const confettiPalette = ["#e76d86", "#f2af9d", "#efc971", "#b99bc9", "#84b6a7", "#f8dce1"];

function toLocalDateInput(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().split("T")[0];
}

function prettyDate(value: string) {
  if (!value) return "To be chosen";
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function prettyTime(value: string) {
  if (!value) return "To be chosen";
  const [hour, minute] = value.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hour, minute));
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("proposal");
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [noPosition, setNoPosition] = useState({ x: 58, y: 58 });
  const [noMoves, setNoMoves] = useState(0);
  const noZoneRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => toLocalDateInput(new Date()), []);

  const dodgeNo = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      let nextX = 10 + Math.random() * 72;
      let nextY = 8 + Math.random() * 72;

      if (Math.abs(nextX - noPosition.x) < 28) {
        nextX = nextX > 46 ? 10 + Math.random() * 18 : 66 + Math.random() * 16;
      }
      if (Math.abs(nextY - noPosition.y) < 24) {
        nextY = nextY > 46 ? 8 + Math.random() * 18 : 65 + Math.random() * 16;
      }

      setNoPosition({ x: nextX, y: nextY });
      setNoMoves((value) => value + 1);
    },
    [noPosition],
  );

  const toggleFood = (food: string) => {
    setError("");
    setSelectedFoods((current) =>
      current.includes(food)
        ? current.filter((item) => item !== food)
        : [...current, food],
    );
  };

  const validateAndContinue = () => {
    setError("");
    if (step === 1 && (!date || !time)) {
      setError("Pick both a date and time so I know when to be ready ♡");
      return;
    }
    if (step === 2 && !activity) {
      setError("Choose the vibe that makes you smile most.");
      return;
    }
    if (step === 3 && selectedFoods.length === 0) {
      setError("Pick at least one delicious thing for us.");
      return;
    }
    if (step < 4) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const planMessage = useMemo(
    () =>
      [
        "💌 Yes, Sami! It’s a date!",
        "",
        "✨ OUR DATE PLAN ✨",
        `📅 Date: ${prettyDate(date)}`,
        `⏰ Time: ${prettyTime(time)}`,
        `💞 Vibe: ${activity}`,
        `🍽️ Food: ${selectedFoods.join(", ")}`,
        notes.trim() ? `💭 My note: ${notes.trim()}` : "",
        "",
        "I can’t wait! ♡",
      ]
        .filter(Boolean)
        .join("\n"),
    [activity, date, notes, selectedFoods, time],
  );

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planMessage);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = planMessage;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(planMessage)}`, "_blank", "noopener,noreferrer");
  };

  const restart = () => {
    setScreen("proposal");
    setStep(1);
    setDate("");
    setTime("");
    setActivity("");
    setSelectedFoods([]);
    setNotes("");
    setError("");
    setCopied(false);
    setNoPosition({ x: 58, y: 58 });
    setNoMoves(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff9f7] text-[#4d3034]">
      <div className="paper-noise pointer-events-none fixed inset-0 z-50 opacity-25" />
      <div className="pointer-events-none fixed -left-28 top-20 h-80 w-80 rounded-full bg-[#fbdde3]/70 blur-3xl" />
      <div className="pointer-events-none fixed -right-32 bottom-10 h-96 w-96 rounded-full bg-[#f6dccd]/70 blur-3xl" />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <button
          className="group flex items-center gap-2"
          onClick={restart}
          aria-label="Back to invitation"
          type="button"
        >
          <span className="grid size-9 place-items-center rounded-full border border-[#e9b6bf] bg-white/70 shadow-[0_5px_18px_rgba(149,79,91,.08)] transition-transform group-hover:-rotate-6 group-hover:scale-105">
            <Heart className="size-[17px] fill-[#d95d77] text-[#d95d77]" strokeWidth={1.8} />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[10px] font-bold uppercase tracking-[.22em] text-[#b76d7a]">Made with love</span>
            <span className="font-display text-lg leading-none text-[#5a373d]">Sami × Johra</span>
          </span>
        </button>

        <div className="love-pill flex items-center gap-2.5 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[.17em] text-[#9e5967] sm:text-[11px]">
          <Sparkles className="size-3.5 text-[#d9657d]" />
          <span>I love you, Johra</span>
        </div>
      </header>

      {screen === "proposal" && (
        <ProposalScreen
          dodgeNo={dodgeNo}
          noMoves={noMoves}
          noPosition={noPosition}
          noZoneRef={noZoneRef}
          onYes={() => {
            setScreen("planner");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {screen === "planner" && (
        <PlannerScreen
          activity={activity}
          date={date}
          error={error}
          foods={selectedFoods}
          notes={notes}
          setActivity={(value) => {
            setActivity(value);
            setError("");
          }}
          setDate={(value) => {
            setDate(value);
            setError("");
          }}
          setNotes={setNotes}
          setStep={(value) => {
            setStep(value);
            setError("");
          }}
          setTime={(value) => {
            setTime(value);
            setError("");
          }}
          step={step}
          time={time}
          today={today}
          toggleFood={toggleFood}
          validateAndContinue={validateAndContinue}
        />
      )}

      {screen === "summary" && (
        <SummaryScreen
          activity={activity}
          copied={copied}
          copyPlan={copyPlan}
          date={date}
          foods={selectedFoods}
          notes={notes}
          restart={restart}
          shareWhatsApp={shareWhatsApp}
          time={time}
        />
      )}
    </main>
  );
}

function ProposalScreen({
  dodgeNo,
  noMoves,
  noPosition,
  noZoneRef,
  onYes,
}: {
  dodgeNo: (event?: { preventDefault: () => void; stopPropagation: () => void }) => void;
  noMoves: number;
  noPosition: { x: number; y: number };
  noZoneRef: RefObject<HTMLDivElement | null>;
  onYes: () => void;
}) {
  return (
    <section className="relative z-10 mx-auto grid min-h-[calc(100svh-84px)] w-full max-w-6xl items-center gap-10 px-5 pb-10 pt-3 sm:px-8 lg:grid-cols-[1.06fr_.94fr] lg:gap-16 lg:pb-16">
      <div className="relative z-10 mx-auto max-w-[650px] text-center lg:mx-0 lg:text-left">
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[#edcbd0] bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#ab6572] backdrop-blur sm:text-[11px]">
          <span className="h-px w-4 bg-[#d78494]" />
          A little question for my favorite person
        </div>

        <h1 className="font-display text-[clamp(3.6rem,12vw,7.8rem)] leading-[.79] tracking-[-.055em] text-[#543238]">
          Will you go
          <span className="relative block italic text-[#d85f78]">
            on a date
            <span className="hand-underline absolute -bottom-3 left-1/2 h-4 w-[78%] -translate-x-1/2 lg:left-0 lg:translate-x-0" />
          </span>
          <span className="block">with me?</span>
        </h1>

        <p className="mx-auto mt-9 max-w-[490px] text-[15px] leading-7 text-[#7f5b60] sm:text-base lg:mx-0">
          I have a thousand reasons to love you and one tiny plan to make you smile.
          Pick our perfect little date, Johra.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <button className="yes-button group" type="button" onClick={onYes}>
            <span className="grid size-9 place-items-center rounded-full bg-white/20">
              <Heart className="size-[18px] fill-white text-white transition-transform group-hover:scale-125" />
            </span>
            <span>Yes, a thousand times!</span>
            <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
          </button>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#a87880]">
            <Star className="size-3.5 fill-[#edbd72] text-[#edbd72]" />
            Psst… there&apos;s only one right answer
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[.18em] text-[#aa7b82] lg:justify-start">
          <span className="h-px w-8 bg-[#e7c4c9]" />
          Sami loves you to infinity
          <span aria-hidden>∞</span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[520px]">
        <div className="absolute -left-4 top-12 z-20 hidden rotate-[-12deg] items-center gap-2 rounded-full border border-[#ead2b1] bg-[#fff5dc] px-4 py-2 text-xs font-bold text-[#95652b] shadow-lg sm:flex">
          <Sparkles className="size-4" />
          Limited edition: us
        </div>

        <div className="invitation-card relative rotate-[1.6deg] rounded-[30px] border border-white/90 bg-[#fffdfb]/90 p-3 shadow-[0_30px_80px_rgba(117,59,70,.16)] backdrop-blur sm:rounded-[38px] sm:p-4">
          <div className="relative overflow-hidden rounded-[24px] border border-[#ead9d5] bg-[#fdf3f0] px-5 pb-5 pt-7 sm:rounded-[31px] sm:px-8 sm:pb-7 sm:pt-9">
            <div className="absolute -right-8 -top-9 size-32 rounded-full border-[22px] border-[#f4ccd4]/60" />
            <div className="absolute -bottom-12 -left-10 size-36 rounded-full border-[26px] border-[#f5dfc6]/60" />
            <Flower2 className="absolute right-7 top-7 size-6 text-[#d98796]" strokeWidth={1.3} />

            <div className="mb-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#b67882]">Official date invitation</p>
              <div className="mx-auto my-4 flex items-center justify-center gap-3 text-[#d27a8a]">
                <span className="h-px w-12 bg-[#e3b3bb]" />
                <Heart className="size-4 fill-[#d9778a]" />
                <span className="h-px w-12 bg-[#e3b3bb]" />
              </div>
              <h2 className="font-display text-4xl italic text-[#55363a] sm:text-5xl">Dear Johra,</h2>
              <p className="mt-3 text-sm leading-6 text-[#836166]">Can I reserve a little piece of your time?</p>
            </div>

            <div
              className="no-zone relative h-52 overflow-hidden rounded-2xl border border-dashed border-[#dfbac0] bg-white/45 sm:h-56"
              ref={noZoneRef}
              aria-label="Playful answer area"
            >
              <div className="absolute left-4 top-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#bd8b93]">
                <Laugh className="size-4" />
                Catch it if you can
              </div>
              <button
                type="button"
                className="no-button"
                style={{
                  left: `${noPosition.x}%`,
                  top: `${noPosition.y}%`,
                }}
                onPointerEnter={dodgeNo}
                onPointerDown={dodgeNo}
                onClick={dodgeNo}
                onFocus={dodgeNo}
                aria-label="No — this playful button runs away"
              >
                No
              </button>

              <div className="pointer-events-none absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center text-[11px] text-[#af7f87]">
                {noMoves === 0 && "This answer seems a little shy…"}
                {noMoves > 0 && noMoves < 3 && "Oops! Not today 😌"}
                {noMoves >= 3 && noMoves < 6 && "The universe says try the pink button ♡"}
                {noMoves >= 6 && "Still faster than you, pretty girl! ✨"}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#ead7d4] pt-4 text-[10px] font-bold uppercase tracking-[.17em] text-[#bc8a91]">
              <span>To: My favorite</span>
              <span>From: Yours, always</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-5 right-5 -z-10 h-16 w-40 rotate-[-7deg] rounded-2xl bg-[#ecc4b6]/60 blur-[1px]" />
      </div>
    </section>
  );
}

function PlannerScreen({
  activity,
  date,
  error,
  foods,
  notes,
  setActivity,
  setDate,
  setNotes,
  setStep,
  setTime,
  step,
  time,
  today,
  toggleFood,
  validateAndContinue,
}: {
  activity: string;
  date: string;
  error: string;
  foods: string[];
  notes: string;
  setActivity: (value: string) => void;
  setDate: (value: string) => void;
  setNotes: (value: string) => void;
  setStep: (value: number) => void;
  setTime: (value: string) => void;
  step: number;
  time: string;
  today: string;
  toggleFood: (value: string) => void;
  validateAndContinue: () => void;
}) {
  const current = steps[step - 1];

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-14 pt-5 sm:px-8 sm:pb-20 sm:pt-10">
      <div className="mb-8 text-center sm:mb-11">
        <div className="mb-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#b36c79]">
          <Sparkles className="size-3.5" />
          Our little date planner
        </div>
        <h1 className="font-display text-5xl leading-[.92] tracking-[-.035em] text-[#513238] sm:text-7xl">
          Let&apos;s make it <span className="italic text-[#d75f77]">perfect.</span>
        </h1>
      </div>

      <div className="mx-auto mb-7 flex max-w-2xl items-center" aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((item, index) => (
          <div className="flex flex-1 items-center last:flex-none" key={item}>
            <button
              type="button"
              onClick={() => item < step && setStep(item)}
              disabled={item > step}
              className={`step-dot ${item === step ? "active" : ""} ${item < step ? "done" : ""}`}
              aria-label={`Go to step ${item}`}
            >
              {item < step ? <Check className="size-4" strokeWidth={3} /> : item}
            </button>
            {index < 3 && <span className={`step-line ${item < step ? "done" : ""}`} />}
          </div>
        ))}
      </div>

      <div className="planner-card mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-white/90 bg-white/75 shadow-[0_24px_70px_rgba(118,60,72,.13)] backdrop-blur sm:rounded-[38px]">
        <div className="border-b border-[#ecd9d7] bg-[#fffaf8]/75 px-5 py-7 text-center sm:px-10 sm:py-9">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[.27em] text-[#bd7180]">
            Step {step} of 4 · {current.eyebrow}
          </p>
          <h2 className="font-display text-[2.25rem] leading-[1.02] text-[#56363b] sm:text-5xl">{current.title}</h2>
        </div>

        <div key={step} className="step-content min-h-[360px] px-5 py-7 sm:min-h-[410px] sm:px-10 sm:py-10">
          {step === 1 && (
            <div className="mx-auto max-w-2xl">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <label className="input-card group">
                  <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#9e626c]">
                    <span className="grid size-8 place-items-center rounded-full bg-[#fbe3e7] text-[#d06178]">
                      <CalendarDays className="size-4" />
                    </span>
                    Pick our day
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="date-input"
                  />
                  <span className="mt-2 block text-xs text-[#a57c82]">
                    {date ? prettyDate(date) : "A day worth looking forward to"}
                  </span>
                </label>

                <label className="input-card group">
                  <span className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-[#9e626c]">
                    <span className="grid size-8 place-items-center rounded-full bg-[#f8ead5] text-[#b67b31]">
                      <Clock3 className="size-4" />
                    </span>
                    Choose a time
                  </span>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="date-input"
                  />
                  <span className="mt-2 block text-xs text-[#a57c82]">
                    {time ? prettyTime(time) : "Whenever the magic should begin"}
                  </span>
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-[#f0d9dd] bg-[#fff6f7] p-4 text-center text-sm leading-6 text-[#8b6269]">
                <Heart className="mr-2 inline size-4 fill-[#df7388] text-[#df7388]" />
                Any day with you is my favorite day.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="choice-grid mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {activities.map((item, index) => (
                <ChoiceCard
                  item={item}
                  key={item.id}
                  selected={activity === item.id}
                  onClick={() => setActivity(item.id)}
                  featured={index === activities.length - 1}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-between rounded-xl bg-[#fdf1ef] px-4 py-3 text-xs text-[#91676d]">
                <span>Choose as many as your heart (and appetite) wants.</span>
                <span className="font-bold text-[#cf6277]">{foods.length} picked</span>
              </div>
              <div className="choice-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {foodChoices.map((item, index) => (
                  <ChoiceCard
                    item={item}
                    key={item.id}
                    selected={foods.includes(item.id)}
                    onClick={() => toggleFood(item.id)}
                    featured={index === 4}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mx-auto max-w-2xl">
              <label className="block">
                <span className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[.15em] text-[#9e626c]">
                  <span className="flex items-center gap-2">
                    <MessageCircleHeart className="size-4 text-[#d36278]" />
                    A note for Sami
                  </span>
                  <span className="font-medium normal-case tracking-normal text-[#b38e94]">Optional</span>
                </span>
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value.slice(0, 280))}
                    rows={6}
                    placeholder="Tell me anything… a place you love, a song for the ride, or just a little message ♡"
                    className="note-input"
                  />
                  <span className="absolute bottom-4 right-4 text-[10px] font-semibold text-[#b28a90]">{notes.length}/280</span>
                </div>
              </label>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#ead9c0] bg-[#fff9ea] p-4 text-sm leading-6 text-[#896d48]">
                <Sparkles className="mt-1 size-4 shrink-0 text-[#c4913f]" />
                <span>No request is too small. The whole point is making you happy.</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#ecd9d7] bg-[#fffbfa] px-5 py-5 sm:px-10 sm:py-6">
          {error && (
            <div role="alert" className="mb-4 flex items-center justify-center gap-2 text-center text-xs font-semibold text-[#c84e68]">
              <Heart className="size-3.5 fill-[#d9647b]" />
              {error}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="back-button"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
            <button type="button" onClick={validateAndContinue} className="continue-button group">
              <span>{step === 4 ? "Reveal our date" : "Continue"}</span>
              {step === 4 ? (
                <PartyPopper className="size-[18px] transition-transform group-hover:-rotate-12 group-hover:scale-110" />
              ) : (
                <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceCard({
  item,
  selected,
  onClick,
  featured = false,
}: {
  item: Choice;
  selected: boolean;
  onClick: () => void;
  featured?: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`choice-card accent-${item.accent} ${selected ? "selected" : ""} ${featured ? "col-span-2 sm:col-span-1" : ""}`}
      aria-pressed={selected}
    >
      <span className="choice-check" aria-hidden>
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span className="choice-icon">
        <Icon className="size-6 sm:size-7" strokeWidth={1.7} />
      </span>
      <span className="mt-3 block text-left">
        <span className="block text-sm font-bold text-[#5d3b41] sm:text-[15px]">{item.label}</span>
        <span className="mt-1 hidden text-[11px] leading-4 text-[#927177] sm:block">{item.detail}</span>
      </span>
    </button>
  );
}

function SummaryScreen({
  activity,
  copied,
  copyPlan,
  date,
  foods,
  notes,
  restart,
  shareWhatsApp,
  time,
}: {
  activity: string;
  copied: boolean;
  copyPlan: () => void;
  date: string;
  foods: string[];
  notes: string;
  restart: () => void;
  shareWhatsApp: () => void;
  time: string;
}) {
  return (
    <section className="relative z-10 mx-auto flex min-h-[calc(100svh-84px)] w-full max-w-5xl flex-col items-center px-5 pb-14 pt-3 sm:px-8 sm:pb-20 sm:pt-7">
      <Confetti />

      <div className="celebration-pop relative z-10 mb-6 text-center sm:mb-8">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-[#da637b] text-white shadow-[0_12px_30px_rgba(207,84,108,.28)] sm:size-20">
          <Heart className="size-8 fill-white sm:size-10" />
        </div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.26em] text-[#b36977]">It&apos;s officially a date</p>
        <h1 className="font-display text-5xl leading-[.9] text-[#54343a] sm:text-7xl">
          You said <span className="italic text-[#d65f77]">yes!</span>
        </h1>
        <p className="mt-4 text-sm text-[#89646a] sm:text-base">Best. Answer. Ever. I can&apos;t wait, Johra. ♡</p>
      </div>

      <div className="summary-card relative z-10 w-full max-w-[680px] overflow-hidden rounded-[28px] border border-white bg-white/85 shadow-[0_30px_90px_rgba(112,53,65,.16)] backdrop-blur sm:rounded-[38px]">
        <div className="relative overflow-hidden border-b border-[#ead8d4] bg-[#fdf1ef] px-6 py-7 text-center sm:px-10 sm:py-9">
          <Heart className="absolute -right-6 -top-6 size-28 rotate-12 text-[#f3d4d9]" strokeWidth={1} />
          <Heart className="absolute -bottom-10 -left-6 size-24 -rotate-12 text-[#f1ddd2]" strokeWidth={1} />
          <p className="relative text-[10px] font-bold uppercase tracking-[.28em] text-[#b36d79]">Made for two</p>
          <h2 className="relative mt-1 font-display text-4xl italic text-[#55363b] sm:text-5xl">Our Date Plan</h2>
        </div>

        <div className="grid gap-px bg-[#eededb] sm:grid-cols-2">
          <SummaryItem icon={CalendarDays} label="Our day" value={prettyDate(date)} />
          <SummaryItem icon={Clock3} label="Our time" value={prettyTime(time)} />
          <SummaryItem icon={Sparkles} label="The vibe" value={activity} />
          <SummaryItem icon={UtensilsCrossed} label="On the menu" value={foods.join(" · ")} />
        </div>

        {notes.trim() && (
          <div className="border-t border-[#ead8d4] bg-[#fffaf8] px-6 py-6 sm:px-9">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#b36d79]">
              <MessageCircleHeart className="size-4" />
              A note from Johra
            </div>
            <p className="font-display text-xl italic leading-8 text-[#67464c]">&ldquo;{notes.trim()}&rdquo;</p>
          </div>
        )}

        <div className="border-t border-[#ead8d4] bg-white px-5 py-6 sm:px-8 sm:py-7">
          <div className="grid gap-3 sm:grid-cols-[.9fr_1.1fr]">
            <button type="button" onClick={copyPlan} className="copy-button">
              {copied ? <CheckCircle2 className="size-[18px]" /> : <Copy className="size-[18px]" />}
              {copied ? "Copied with love!" : "Copy our plan"}
            </button>
            <button type="button" onClick={shareWhatsApp} className="whatsapp-button group">
              <Send className="size-[18px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Confirm & share on WhatsApp
            </button>
          </div>
          <p className="mt-4 text-center text-[10px] leading-4 text-[#a67d84]">
            Your choices stay private on this device until you choose to share them.
          </p>
        </div>
      </div>

      <button type="button" onClick={restart} className="relative z-10 mt-7 flex items-center gap-2 text-xs font-bold text-[#a06a73] transition-colors hover:text-[#cf5870]">
        <RefreshCcw className="size-3.5" />
        Plan it all over again
      </button>
    </section>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-28 bg-[#fffdfc] px-6 py-5 sm:px-8">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#b4747f]">
        <span className="grid size-7 place-items-center rounded-full bg-[#fbe7ea] text-[#d26278]">
          <Icon className="size-3.5" />
        </span>
        {label}
      </div>
      <p className="font-display text-xl leading-6 text-[#5d3b41]">{value}</p>
    </div>
  );
}

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 34 }).map((_, index) => (
        <span
          key={index}
          className={`confetti-piece ${index % 6 === 0 ? "heart-piece" : ""}`}
          style={{
            left: `${(index * 37) % 100}%`,
            backgroundColor: confettiPalette[index % confettiPalette.length],
            animationDelay: `${(index % 11) * 0.13}s`,
            animationDuration: `${3.3 + (index % 7) * 0.28}s`,
            transform: `rotate(${(index * 47) % 180}deg)`,
          }}
        />
      ))}
    </div>
  );
}
