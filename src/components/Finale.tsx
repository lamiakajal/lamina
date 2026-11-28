import JoinForm from "./JoinForm";
import Reveal from "./Reveal";

export default function Finale() {
  return (
    <section
      id="finale"
      aria-labelledby="finale-title"
      className="relative flex min-h-screen items-center justify-center px-6 py-28 sm:px-14"
    >
      <Reveal className="glass w-full max-w-2xl p-7 text-shadow sm:p-12">
        <p className="eyebrow text-brass">The bottom, and what comes next</p>
        <h2 id="finale-title" className="mt-5 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.02]">
          Join the next <em className="text-aqua">descent</em>
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pearl/80">
          Leave your name and we will send word when the next expedition opens. Lamina is a fictional programme, so
          this form only shows how a sign-up works from start to finish.
        </p>
        <div className="mt-10">
          <JoinForm />
        </div>
      </Reveal>
    </section>
  );
}
