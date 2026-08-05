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
  Heart,
  IceCreamBowl,
  LoaderCircle,
  Mail,
  MessageCircleHeart,
  MoonStar,
  PartyPopper,
  Pizza,
  Popcorn,
  RefreshCcw,
  Send,
  Sparkles,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";
import {
  type ComponentType,
  useCallback,
  useMemo,
  useState,
} from "react";

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;
type Screen = "proposal" | "planner" | "summary";
type DeliveryState = "idle" | "sending" | "activation" | "sent" | "error";
type PdfShareState = "idle" | "preparing" | "shared" | "downloaded" | "error";

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
const formSubmitEndpoint =
  "https://formsubmit.co/ajax/mazharulislam8897@gmail.com";

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
  const [noPosition, setNoPosition] = useState({ x: 74, y: 50 });
  const [noMoves, setNoMoves] = useState(0);

  const today = useMemo(() => toLocalDateInput(new Date()), []);

  const dodgeNo = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      const nextX = 64 + Math.random() * 23;
      let nextY = 17 + Math.random() * 66;

      if (Math.abs(nextY - noPosition.y) < 24) {
        nextY = nextY > 50 ? 17 + Math.random() * 18 : 65 + Math.random() * 18;
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
    setNoPosition({ x: 74, y: 50 });
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

        <div className="love-pill hidden items-center gap-2.5 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[.17em] text-[#9e5967] sm:flex sm:text-[11px]">
          <Sparkles className="size-3.5 text-[#d9657d]" />
          <span>I love you, Johra</span>
        </div>
      </header>

      {screen === "proposal" && (
        <ProposalScreen
          dodgeNo={dodgeNo}
          noMoves={noMoves}
          noPosition={noPosition}
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
          planMessage={planMessage}
          restart={restart}
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
  onYes,
}: {
  dodgeNo: (event?: { preventDefault: () => void; stopPropagation: () => void }) => void;
  noMoves: number;
  noPosition: { x: number; y: number };
  onYes: () => void;
}) {
  return (
    <section className="relative z-10 mx-auto flex min-h-[calc(100svh-84px)] w-full max-w-5xl items-center justify-center px-5 pb-12 pt-3 sm:px-8 sm:pb-20">
      <div className="simple-proposal-card w-full max-w-[820px] px-5 py-8 text-center sm:px-12 sm:py-12">
        <Heart className="proposal-heart proposal-heart-left" aria-hidden />
        <Heart className="proposal-heart proposal-heart-right" aria-hidden />

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e9bcc4] bg-white/75 px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-[#b64f65] sm:text-xs">
          <Sparkles className="size-3.5" />
          I love you, Johra
        </div>

        <h1 className="proposal-title font-display text-[clamp(2.45rem,9vw,6.7rem)] leading-[.88] tracking-[-.055em] text-[#4c2c32]">
          <span className="block text-[#d45770]">Johra,</span>
          <span className="block">will you go on a</span>
          <span className="relative mx-auto mt-1 block w-fit italic text-[#d45770]">
            date with me?
            <span className="hand-underline absolute -bottom-2 left-1/2 h-3 w-[90%] -translate-x-1/2" />
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-base font-bold leading-7 text-[#735158] sm:text-lg">
          One simple question. One beautiful date. And my favorite person—you.
        </p>

        <div className="answer-panel mx-auto mt-8 max-w-[620px]">
          <p className="pt-5 text-xs font-black uppercase tracking-[.2em] text-[#a95c6a]">
            Choose your answer ♡
          </p>
          <div className="answer-zone relative" aria-label="Choose yes or no">
            <button className="proposal-yes group" type="button" onClick={onYes}>
              <Heart className="size-5 fill-white text-white transition-transform group-hover:scale-125" />
              <span>Yes, I&apos;d love to!</span>
            </button>
            <button
              type="button"
              className="no-button proposal-no"
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
          </div>

          <p className="min-h-6 px-4 pb-5 text-xs font-semibold text-[#a66f79]" aria-live="polite">
            {noMoves === 0 && "Yes will take you to the next round ✨"}
            {noMoves > 0 && noMoves < 3 && "Oops! The No button ran away 😌"}
            {noMoves >= 3 && noMoves < 6 && "It really wants you to choose Yes ♡"}
            {noMoves >= 6 && "Still too quick—try the pink button! ✨"}
          </p>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[.2em] text-[#a35f6c]">
          <span className="h-px w-8 bg-[#ddb1b8]" />
          Sami loves you to infinity
          <span className="font-display text-xl" aria-hidden>∞</span>
          <span className="h-px w-8 bg-[#ddb1b8]" />
        </div>
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
  planMessage,
  restart,
  time,
}: {
  activity: string;
  copied: boolean;
  copyPlan: () => void;
  date: string;
  foods: string[];
  notes: string;
  planMessage: string;
  restart: () => void;
  time: string;
}) {
  const [deliveryState, setDeliveryState] = useState<DeliveryState>("idle");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [pdfShareState, setPdfShareState] = useState<PdfShareState>("idle");
  const [pdfShareMessage, setPdfShareMessage] = useState("");

  const sharePdfOnWhatsApp = async () => {
    if (pdfShareState === "preparing") return;

    const placeholderFile = new File([""], "Sami-and-Johra-Date-Plan.pdf", {
      type: "application/pdf",
    });
    const canShareFiles =
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [placeholderFile] });
    const whatsappWindow = canShareFiles
      ? null
      : window.open("about:blank", "_blank");
    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }

    setPdfShareState("preparing");
    setPdfShareMessage("");

    try {
      const { createDatePlanPdf } = await import("@/lib/date-plan-pdf");
      const { blob, fileName } = createDatePlanPdf({
        date: prettyDate(date),
        time: prettyTime(time),
        activity,
        foods,
        notes,
      });
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (canShareFiles && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Sami & Johra - Our Date Plan",
          text: "Our date plan is ready ♡",
        });
        setPdfShareState("shared");
        setPdfShareMessage(
          "PDF share opened. Choose WhatsApp and send it to Sami ♡",
        );
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        `${planMessage}\n\nI downloaded our date plan as a PDF. I’m attaching it here ♡`,
      )}`;
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      setPdfShareState("downloaded");
      setPdfShareMessage(
        "PDF downloaded. Attach “Sami-and-Johra-Date-Plan.pdf” in WhatsApp ♡",
      );
    } catch (error) {
      whatsappWindow?.close();
      if (error instanceof DOMException && error.name === "AbortError") {
        setPdfShareState("idle");
        return;
      }
      setPdfShareState("error");
      setPdfShareMessage(
        "Couldn’t prepare the PDF just now. Please try again.",
      );
    }
  };

  const sendPlanToSami = async () => {
    if (
      deliveryState === "sending" ||
      deliveryState === "activation" ||
      deliveryState === "sent"
    ) {
      return;
    }

    setDeliveryState("sending");
    setDeliveryMessage("");

    try {
      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "💌 Johra said YES — a new date plan!",
          _template: "table",
          _captcha: "false",
          _honey: "",
          _url: window.location.href,
          "Submitted by": "Johra",
          Date: prettyDate(date),
          Time: prettyTime(time),
          "Date vibe": activity,
          Food: foods.join(", "),
          "Special note": notes.trim() || "No special requests",
          "Submitted at": new Date().toISOString(),
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        success?: boolean | string;
        message?: string;
      } | null;
      const providerAccepted =
        result?.success === true || result?.success === "true";
      const activationRequired =
        response.ok &&
        result?.success === "false" &&
        /activation|activate form/i.test(result.message ?? "");

      if (!response.ok || (!providerAccepted && !activationRequired)) {
        throw new Error("The plan could not be delivered.");
      }

      if (activationRequired) {
        setDeliveryState("activation");
        setDeliveryMessage(
          "Activation email sent to Sami. He only needs to tap “Activate Form” once—this plan will then arrive in his inbox.",
        );
        return;
      }

      setDeliveryState("sent");
      setDeliveryMessage("Sent to Sami’s inbox! Your date plan is on its way ♡");
    } catch {
      setDeliveryState("error");
      setDeliveryMessage("Couldn’t send it just now. Please try again or share it on WhatsApp.");
    }
  };

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
          <button
            type="button"
            onClick={sendPlanToSami}
            disabled={
              deliveryState === "sending" ||
              deliveryState === "activation" ||
              deliveryState === "sent"
            }
            className={`email-button group ${
              deliveryState === "activation" || deliveryState === "sent" ? "sent" : ""
            }`}
          >
            {deliveryState === "sending" && <LoaderCircle className="size-5 animate-spin" />}
            {deliveryState === "sent" && <CheckCircle2 className="size-5" />}
            {deliveryState === "activation" && <Mail className="size-5" />}
            {(deliveryState === "idle" || deliveryState === "error") && <Mail className="size-5" />}
            <span>
              {deliveryState === "sending" && "Sending our plan…"}
              {deliveryState === "sent" && "Plan sent to Sami!"}
              {deliveryState === "activation" && "Check Sami’s email to activate"}
              {(deliveryState === "idle" || deliveryState === "error") && "Confirm & send to Sami"}
            </span>
          </button>

          {deliveryMessage && (
            <p
              className={`email-status ${deliveryState === "error" ? "error" : "success"}`}
              role={deliveryState === "error" ? "alert" : "status"}
            >
              {deliveryMessage}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-[.9fr_1.1fr]">
            <button type="button" onClick={copyPlan} className="copy-button">
              {copied ? <CheckCircle2 className="size-[18px]" /> : <Copy className="size-[18px]" />}
              {copied ? "Copied with love!" : "Copy our plan"}
            </button>
            <button
              type="button"
              onClick={sharePdfOnWhatsApp}
              disabled={pdfShareState === "preparing"}
              className="whatsapp-button group"
            >
              {pdfShareState === "preparing" ? (
                <LoaderCircle className="size-[18px] animate-spin" />
              ) : pdfShareState === "shared" ||
                pdfShareState === "downloaded" ? (
                <CheckCircle2 className="size-[18px]" />
              ) : (
                <Send className="size-[18px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
              {pdfShareState === "preparing"
                ? "Making your PDF…"
                : "Share PDF on WhatsApp"}
            </button>
          </div>
          {pdfShareMessage && (
            <p
              className={`email-status share-status ${
                pdfShareState === "error" ? "error" : "success"
              }`}
              role={pdfShareState === "error" ? "alert" : "status"}
            >
              {pdfShareMessage}
            </p>
          )}
          <p className="mt-4 text-center text-[10px] leading-4 text-[#a67d84]">
            Your choices are only sent when you tap the confirm button.
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
